import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

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

    const userWithHash = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        passwordHash: true,
      },
    });

    if (!userWithHash) {
      return NextResponse.json(
        { ok: false, error: { code: "ACCOUNT_NOT_FOUND", message: "Aucun compte trouvé." } },
        { status: 404 }
      );
    }

    const ok = await bcrypt.compare(password, userWithHash.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: { code: "INVALID_PASSWORD", message: "Mot de passe incorrect." } },
        { status: 401 }
      );
    }

    const { passwordHash, ...user } = userWithHash;
    void passwordHash;
    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Erreur serveur." } },
      { status: 500 }
    );
  }
}
