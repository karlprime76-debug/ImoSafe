import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireSessionId } from "@/app/api/_utils/auth";

export async function GET(request: Request) {
  try {
    const auth = await requireSessionId(request);
    if (!auth.ok) return auth.res;

    const rows = await prisma.visitRequest.findMany({
      where: { userId: auth.sessionId },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        propertyId: true,
        preferredDate: true,
        preferredTime: true,
        message: true,
        createdAt: true,
        status: true,
        property: { select: { title: true } },
      },
    });

    const visits = rows.map((r) => ({
      id: r.id,
      propertyId: r.propertyId,
      propertyTitle: r.property.title,
      preferredDate: r.preferredDate ? r.preferredDate.toISOString().slice(0, 10) : undefined,
      preferredTime: r.preferredTime ?? undefined,
      message: r.message ?? undefined,
      createdAt: r.createdAt.toISOString(),
      status: r.status,
    }));

    return NextResponse.json({ ok: true, visits }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR" } }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
