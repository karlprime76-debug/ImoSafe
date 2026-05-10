import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireSessionId } from "@/app/api/_utils/auth";

export async function GET(request: Request) {
  try {
    const auth = await requireSessionId(request);
    if (!auth.ok) return auth.res;

    const rows = await prisma.scamReport.findMany({
      where: { userId: auth.sessionId },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        propertyId: true,
        reason: true,
        description: true,
        phoneOrContact: true,
        status: true,
        createdAt: true,
      },
    });

    const reports = rows.map((r) => ({
      id: r.id,
      propertyId: r.propertyId ?? undefined,
      reason: r.reason,
      description: r.description ?? undefined,
      phoneOrContact: r.phoneOrContact ?? undefined,
      createdAt: r.createdAt.toISOString(),
      status: r.status,
    }));

    return NextResponse.json({ ok: true, reports }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR" } }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
