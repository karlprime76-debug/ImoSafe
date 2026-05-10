import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/api/_utils/auth";

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.res;

    const rows = await prisma.verificationRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      select: {
        id: true,
        userId: true,
        kind: true,
        fullName: true,
        whatsAppPhone: true,
        email: true,
        city: true,
        neighborhood: true,
        listingRefOrUrl: true,
        message: true,
        status: true,
        createdAt: true,
      },
    });

    const verificationRequests = rows.map((r) => ({
      id: r.id,
      userId: r.userId ?? undefined,
      kind: r.kind,
      fullName: r.fullName,
      whatsAppPhone: r.whatsAppPhone,
      email: r.email ?? undefined,
      city: r.city ?? undefined,
      neighborhood: r.neighborhood ?? undefined,
      listingRefOrUrl: r.listingRefOrUrl ?? undefined,
      message: r.message ?? undefined,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({ ok: true, verificationRequests }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR" } }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
