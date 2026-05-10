import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/api/_utils/auth";

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
