import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/api/_utils/auth";

type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: Date;
};

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
