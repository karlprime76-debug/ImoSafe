import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getOptionalUser, jsonError } from "@/app/api/_utils/auth";

const VisitRequestSchema = z.object({
  propertyId: z.string().min(1),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().trim().optional(),
  name: z.string().trim().min(1),
  whatsapp: z.string().trim().min(1),
});

function parseOptionalDate(value: string | undefined) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = VisitRequestSchema.safeParse(json);
    if (!parsed.success) return jsonError(400, "INVALID_PAYLOAD");

    const property = await prisma.property.findFirst({
      where: { id: parsed.data.propertyId, isHidden: false, status: { not: "HIDDEN" } },
      select: { id: true },
    });
    if (!property) return jsonError(404, "PROPERTY_NOT_FOUND");

    const user = await getOptionalUser(request);
    if (!user) return jsonError(401, "UNAUTHORIZED");

    const created = await prisma.visitRequest.create({
      data: {
        userId: user.id,
        propertyId: property.id,
        preferredDate: parseOptionalDate(parsed.data.preferredDate) ?? undefined,
        preferredTime: parsed.data.preferredTime || null,
        message: parsed.data.message || null,
      },
      select: { id: true, status: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, visitRequest: created }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR" } }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
