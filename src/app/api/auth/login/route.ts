import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createSupabaseRouteClient } from "@/lib/supabaseServer";

const LoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

function getSupabaseConfigStatus() {
  const urlRaw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKeyRaw = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const url = typeof urlRaw === "string" ? urlRaw.trim() : "";
  const anonKey = typeof anonKeyRaw === "string" ? anonKeyRaw.trim() : "";

  if (!url || !anonKey) return { ok: false as const, code: "SUPABASE_CONFIG_MISSING" as const };

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return { ok: false as const, code: "SUPABASE_URL_INVALID" as const };
    }
  } catch {
    return { ok: false as const, code: "SUPABASE_URL_INVALID" as const };
  }

  return { ok: true as const };
}

function isAuthFetchFailed(error: unknown) {
  const name = error instanceof Error ? error.name : "";
  const message = error instanceof Error ? error.message : String(error);
  const msg = message.toLowerCase();
  if (name === "AuthRetryableFetchError") return true;
  if (msg.includes("fetch failed")) return true;
  if (msg.includes("timeout")) return true;
  if (msg.includes("econnreset") || msg.includes("enotfound") || msg.includes("etimedout")) return true;
  return false;
}

export async function POST(req: Request) {
  try {
    console.info("[auth.login] request received");
    const json = await req.json();
    const parsed = LoginSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "INVALID_PAYLOAD",
            message: "Payload invalide.",
            issues: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const normalizedEmail = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password;

    const cfg = getSupabaseConfigStatus();
    if (!cfg.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: cfg.code,
            message: cfg.code === "SUPABASE_CONFIG_MISSING" ? "Configuration Supabase manquante." : "URL Supabase invalide.",
          },
        },
        { status: 500, headers: { "cache-control": "no-store" } }
      );
    }

    const { supabase, getSetCookieHeaders } = createSupabaseRouteClient(req);
    let data: { user: { id: string; user_metadata?: unknown; email?: string | null; created_at?: string } } | null = null;
    let error: { message?: string } | null = null;

    try {
      const result = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
      data = result.data?.user ? { user: result.data.user } : null;
      error = result.error ? { message: result.error.message } : null;
    } catch (e) {
      if (isAuthFetchFailed(e)) {
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: "AUTH_FETCH_FAILED",
              message: "Impossible de joindre Supabase Auth depuis le serveur.",
            },
          },
          { status: 503, headers: { "cache-control": "no-store" } }
        );
      }
      throw e;
    }

    if (error || !data?.user?.id) {
      console.info("[auth.login] password valid", { valid: false });

      const msg = (error?.message ?? "").toLowerCase();
      if (msg.includes("email not confirmed")) {
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: "EMAIL_NOT_CONFIRMED",
              message: "Email non confirmé.",
            },
          },
          { status: 401, headers: { "cache-control": "no-store" } }
        );
      }

      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "AUTH_LOGIN_FAILED",
            message: "Identifiants invalides.",
          },
        },
        { status: 401, headers: { "cache-control": "no-store" } }
      );
    }

    console.info("[auth.login] password valid", { valid: true });

    const supaUser = data.user;

    const meta =
      supaUser.user_metadata && typeof supaUser.user_metadata === "object" ? (supaUser.user_metadata as Record<string, unknown>) : null;

    const name = (typeof meta?.name === "string" && meta.name.trim()) || normalizedEmail;
    const phone = typeof meta?.phone === "string" ? meta.phone.trim() : null;
    const role =
      typeof meta?.accountType === "string" && ["USER", "OWNER", "AGENCY", "HOST", "ADMIN"].includes(meta.accountType)
        ? (meta.accountType as "USER" | "OWNER" | "AGENCY" | "HOST" | "ADMIN")
        : "USER";

    let user:
      | { id: string; name: string; email: string; phone: string | null; role: typeof role; createdAt: Date }
      | null = null;

    try {
      user = await prisma.user.upsert({
        where: { id: supaUser.id },
        create: {
          id: supaUser.id,
          name,
          email: normalizedEmail,
          phone,
          role,
          passwordHash: "SUPABASE_AUTH",
        },
        update: {
          name,
          email: normalizedEmail,
          phone,
          role,
        },
        select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      });
    } catch {
      return NextResponse.json(
        { ok: false, error: { code: "DB_UNAVAILABLE", message: "Service indisponible. Réessayez." } },
        { status: 503, headers: { "cache-control": "no-store" } }
      );
    }

    const headers = new Headers({ "cache-control": "no-store" });
    for (const c of getSetCookieHeaders()) headers.append("set-cookie", c);

    console.info("[auth.login] login success");
    return NextResponse.json({ ok: true, user }, { headers });
  } catch {
    console.info("[auth.login] server error");
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Erreur serveur." } },
      { status: 500, headers: { "cache-control": "no-store" } }
    );
  }
}
