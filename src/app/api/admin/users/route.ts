import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: Date;
};

async function requireAdmin(request: Request) {
  const sessionId = request.headers.get("x-imosafe-session-id")?.trim();
  if (!sessionId) {
    return { ok: false as const, res: NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED" } }, { status: 401 }) };
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: { id: true, role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return { ok: false as const, res: NextResponse.json({ ok: false, error: { code: "FORBIDDEN" } }, { status: 403 }) };
  }

  return { ok: true as const, adminId: user.id };
}

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.res;

    const users = (await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      take: 500,
    })) as unknown as AdminUserRow[];

    return NextResponse.json({ ok: true, users });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR" } }, { status: 500 });
  }
}
