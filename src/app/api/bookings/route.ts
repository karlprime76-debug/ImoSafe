import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getOptionalUser, jsonError } from "@/app/api/_utils/auth";

const BookingSchema = z.object({
  stayId: z.string().min(1),
  checkInDate: z.string().min(1),
  checkOutDate: z.string().min(1),
  guests: z.number().int().min(1),
  name: z.string().trim().min(1),
  whatsapp: z.string().trim().min(1),
  message: z.string().trim().optional(),
});

function parseDate(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = BookingSchema.safeParse(json);
    if (!parsed.success) return jsonError(400, "INVALID_PAYLOAD");

    const checkIn = parseDate(parsed.data.checkInDate);
    const checkOut = parseDate(parsed.data.checkOutDate);
    if (!checkIn || !checkOut) return jsonError(400, "INVALID_DATES");
    if (checkOut.getTime() <= checkIn.getTime()) return jsonError(400, "INVALID_DATE_RANGE");

    const stay = await prisma.stay.findFirst({
      where: { id: parsed.data.stayId, isHidden: false },
      select: { id: true },
    });
    if (!stay) return jsonError(404, "STAY_NOT_FOUND");

    const user = await getOptionalUser(request);

    const created = await prisma.bookingRequest.create({
      data: {
        stayId: stay.id,
        userId: user?.id ?? null,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests: parsed.data.guests,
        name: parsed.data.name,
        whatsapp: parsed.data.whatsapp,
        message: parsed.data.message || null,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, bookingRequest: created }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR" } }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
