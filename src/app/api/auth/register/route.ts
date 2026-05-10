import { NextResponse } from "next/server";
import { z } from "zod";

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

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = RegisterSchema.safeParse(json);

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
    const role = mapAccountTypeToRole(accountType) as UserRoleValue;

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail }, select: { id: true } });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: { code: "EMAIL_IN_USE", message: "Email déjà utilisé." } },
        { status: 409, headers: { "cache-control": "no-store" } }
      );
    }

    const { supabase, getSetCookieHeaders } = createSupabaseRouteClient(req);
    const { data, error } = await supabase.auth.signUp({
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

    if (error || !data.user?.id) {
      return NextResponse.json(
        { ok: false, error: { code: "AUTH_SIGNUP_FAILED", message: "Inscription impossible." } },
        { status: 400, headers: { "cache-control": "no-store" } }
      );
    }

    const user = await prisma.user.create({
      data: {
        id: data.user.id,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        role,
        passwordHash: "SUPABASE_AUTH",
      },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

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
