import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getOptionalUser, jsonError } from "@/app/api/_utils/auth";

const ScamReportSchema = z.object({
  propertyId: z.string().optional(),
  reason: z.string().trim().min(1),
  description: z.string().trim().optional(),
  phoneOrContact: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = ScamReportSchema.safeParse(json);
    if (!parsed.success) return jsonError(400, "INVALID_PAYLOAD");

    const user = await getOptionalUser(request);

    const created = await prisma.scamReport.create({
      data: {
        userId: user?.id ?? null,
        propertyId: parsed.data.propertyId || null,
        reason: parsed.data.reason,
        description: parsed.data.description || null,
        phoneOrContact: parsed.data.phoneOrContact || null,
      },
      select: { id: true, status: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, scamReport: created }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR" } }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
