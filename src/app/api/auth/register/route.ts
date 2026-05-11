import { NextResponse } from "next/server";
import { z } from "zod";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { createSupabaseRouteClient } from "@/lib/supabaseServer";

type UserCreateArgs = Parameters<typeof prisma.user.create>[0];
type UserRoleValue = UserCreateArgs["data"] extends { role?: infer R } ? R : never;

const RegisterSchema = z
  .object({
    name: z.string().trim().min(1),
    email: z.string().trim().email(),
    phone: z.string().trim().min(1),
    accountType: z.enum(["USER", "OWNER", "AGENCY", "HOST"]),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({ code: "custom", message: "CONFIRM_PASSWORD_MISMATCH", path: ["confirmPassword"] });
    }
  });

function mapAccountTypeToRole(accountType: "USER" | "OWNER" | "AGENCY" | "HOST") {
  return accountType;
}

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
    console.info("[auth.register] request received");

    let json: unknown;
    try {
      json = await req.json();
    } catch {
      console.info("[auth.register] invalid json");
      return NextResponse.json(
        { ok: false, error: { code: "INVALID_PAYLOAD", message: "Payload invalide." } },
        { status: 400, headers: { "cache-control": "no-store" } }
      );
    }

    const parsed = RegisterSchema.safeParse(json);

    console.info("[auth.register] validation ok", { ok: parsed.success });

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

    const { name, email, phone, accountType, password } = parsed.data;

    const normalizedEmail = email.trim().toLowerCase();
    console.info("[auth.register] normalized email", { email: normalizedEmail });
    console.info("[auth.register] accountType", { accountType });
    const role = mapAccountTypeToRole(accountType) as UserRoleValue;

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

    let data: { user: { id: string } } | null = null;
    let error: { name?: string; message?: string } | null = null;

    try {
      const result = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            name: name.trim(),
            phone: phone.trim(),
            accountType,
          },
        },
      });
      data = result.data?.user?.id ? { user: { id: result.data.user.id } } : null;
      error = result.error ? { name: result.error.name, message: result.error.message } : null;
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
      console.info("[auth.register] supabase signUp success", { success: false });
      console.error("[auth/register] supabase signUp failed", {
        name: error?.name,
        message: error?.message,
      });

      const msg = (error?.message ?? "").toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists") || msg.includes("user already")) {
        return NextResponse.json(
          { ok: false, error: { code: "EMAIL_IN_USE", message: "Email déjà utilisé." } },
          { status: 409, headers: { "cache-control": "no-store" } }
        );
      }

      return NextResponse.json(
        { ok: false, error: { code: "AUTH_SIGNUP_FAILED", message: "Inscription impossible." } },
        { status: 400, headers: { "cache-control": "no-store" } }
      );
    }

    console.info("[auth.register] supabase signUp success", { success: true });

    const userId = data.user.id;

    let user:
      | {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          role: UserRoleValue;
          createdAt: Date;
        }
      | null = null;

    try {
      user = await prisma.user.upsert({
        where: { id: userId },
        create: {
          id: userId,
          name: name.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          role,
          passwordHash: "SUPABASE_AUTH",
        },
        update: {
          name: name.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          role,
        },
        select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      });
      console.info("[auth.register] upsert user success", { success: true });
    } catch (error) {
      const isInit = error instanceof Prisma.PrismaClientInitializationError;
      const isRust = error instanceof Prisma.PrismaClientRustPanicError;

      console.info("[auth.register] upsert user success", { success: false });

      if (isInit || isRust) {
        console.error("[auth/register] prisma", {
          name: (error as { name?: string }).name,
          message: (error as { message?: string }).message,
        });
        return NextResponse.json(
          { ok: false, error: { code: "DB_UNAVAILABLE", message: "Service indisponible. Réessayez." } },
          { status: 503, headers: { "cache-control": "no-store" } }
        );
      }

      if (error instanceof Error) {
        console.error("[auth/register] user profile create failed", { name: error.name, message: error.message });
      } else {
        console.error("[auth/register] user profile create failed", { value: String(error) });
      }

      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "USER_PROFILE_CREATE_FAILED",
            message: "Compte créé, mais profil indisponible. Réessayez.",
          },
        },
        { status: 500, headers: { "cache-control": "no-store" } }
      );
    }

    const headers = new Headers({ "cache-control": "no-store" });
    for (const c of getSetCookieHeaders()) headers.append("set-cookie", c);

    return NextResponse.json({ ok: true, user }, { headers });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientInitializationError || error instanceof Prisma.PrismaClientRustPanicError) {
      console.error("[auth/register] prisma", { name: error.name, message: error.message });
      return NextResponse.json(
        { ok: false, error: { code: "DB_UNAVAILABLE", message: "Service indisponible. Réessayez." } },
        { status: 503, headers: { "cache-control": "no-store" } }
      );
    }

    if (error instanceof Error) {
      console.error("[auth/register] unknown", { name: error.name, message: error.message });
    } else {
      console.error("[auth/register] unknown", { value: String(error) });
    }

    console.info("[auth.register] server error");
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Erreur serveur." } },
      { status: 500, headers: { "cache-control": "no-store" } }
    );
  }
}
