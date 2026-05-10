import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireSessionId } from "@/app/api/_utils/auth";

export async function GET(request: Request) {
  try {
    const auth = await requireSessionId(request);
    if (!auth.ok) return auth.res;

    const rows = await prisma.bookingRequest.findMany({
      where: { userId: auth.sessionId },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        stayId: true,
        checkInDate: true,
        checkOutDate: true,
        guests: true,
        name: true,
        whatsapp: true,
        message: true,
        status: true,
        createdAt: true,
        stay: {
          select: {
            title: true,
            city: true,
            neighborhood: true,
            pricePerNight: true,
          },
        },
      },
    });

    const bookings = rows.map((r) => ({
      id: r.id,
      stayId: r.stayId,
      stayTitleSnapshot: r.stay.title,
      stayNeighborhoodSnapshot: r.stay.neighborhood,
      stayCitySnapshot: r.stay.city,
      pricePerNightSnapshot: r.stay.pricePerNight,
      checkInDate: r.checkInDate.toISOString().slice(0, 10),
      checkOutDate: r.checkOutDate.toISOString().slice(0, 10),
      guests: r.guests,
      name: r.name,
      whatsapp: r.whatsapp,
      message: r.message ?? undefined,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({ ok: true, bookings }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR" } }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
