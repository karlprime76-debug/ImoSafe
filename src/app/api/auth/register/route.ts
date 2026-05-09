import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

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

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, error: { code: "EMAIL_IN_USE", message: "Email déjà utilisé." } },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        role,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Erreur serveur." } },
      { status: 500 }
    );
  }
}
