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
      return NextResponse.json(
        { ok: false, error: { code: "INVALID_CREDENTIALS", message: "Identifiants invalides." } },
        { status: 401, headers: { "cache-control": "no-store" } }
      );
    }

    const supaUser = data.user;

    const existing = await prisma.user.findUnique({ where: { id: supaUser.id }, select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true } });
    const user =
      existing ??
      (await prisma.user.create({
        data: {
          id: supaUser.id,
          name: (typeof supaUser.user_metadata?.name === "string" && supaUser.user_metadata.name.trim()) || normalizedEmail,
          email: normalizedEmail,
          phone: typeof supaUser.user_metadata?.phone === "string" ? supaUser.user_metadata.phone.trim() : null,
          role: "USER",
          passwordHash: "SUPABASE_AUTH",
        },
        select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      }));

    const headers = new Headers({ "cache-control": "no-store" });
    for (const c of getSetCookieHeaders()) headers.append("set-cookie", c);

    return NextResponse.json({ ok: true, user }, { headers });
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Erreur serveur." } },
      { status: 500 }
    );
  }
}
