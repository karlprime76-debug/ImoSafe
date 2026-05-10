import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/api/_utils/auth";

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.res;

    const rows = await prisma.scamReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      select: {
        id: true,
        reason: true,
        description: true,
        phoneOrContact: true,
        status: true,
        createdAt: true,
        propertyId: true,
        userId: true,
      },
    });

    const reports = rows.map((r) => ({
      id: r.id,
      propertyId: r.propertyId ?? undefined,
      reason: r.reason,
      description: r.description ?? undefined,
      phoneOrContact: r.phoneOrContact ?? undefined,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      userId: r.userId ?? undefined,
    }));

    return NextResponse.json({ ok: true, reports }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR" } }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
