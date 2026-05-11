import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createSupabaseRouteClient } from "@/lib/supabaseServer";

const LoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

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

    const { supabase, getSetCookieHeaders } = createSupabaseRouteClient(req);
    const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });

    if (error || !data.user?.id) {
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

    const name =
      (typeof supaUser.user_metadata?.name === "string" && supaUser.user_metadata.name.trim()) || normalizedEmail;
    const phone = typeof supaUser.user_metadata?.phone === "string" ? supaUser.user_metadata.phone.trim() : null;
    const role =
      typeof supaUser.user_metadata?.accountType === "string" &&
      ["USER", "OWNER", "AGENCY", "HOST", "ADMIN"].includes(supaUser.user_metadata.accountType)
        ? (supaUser.user_metadata.accountType as "USER" | "OWNER" | "AGENCY" | "HOST" | "ADMIN")
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
