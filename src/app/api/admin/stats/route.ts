import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

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

    const [total, user, owner, agency, host, admin] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.user.count({ where: { role: "OWNER" } }),
      prisma.user.count({ where: { role: "AGENCY" } }),
      prisma.user.count({ where: { role: "HOST" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
    ]);

    return NextResponse.json({
      ok: true,
      stats: {
        total,
        USER: user,
        OWNER: owner,
        AGENCY: agency,
        HOST: host,
        ADMIN: admin,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR" } }, { status: 500 });
  }
}
