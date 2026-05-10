import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/api/_utils/auth";

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.res;

    const rows = await prisma.manualPaymentRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        offer: true,
        message: true,
        status: true,
        createdAt: true,
      },
    });

    const manualPaymentRequests = rows.map((r) => ({
      id: r.id,
      fullName: r.name,
      whatsAppPhone: r.phone,
      email: r.email ?? undefined,
      offer: r.offer,
      message: r.message ?? undefined,
      createdAt: r.createdAt.toISOString(),
      status: r.status,
    }));

    return NextResponse.json({ ok: true, manualPaymentRequests }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR" } }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
