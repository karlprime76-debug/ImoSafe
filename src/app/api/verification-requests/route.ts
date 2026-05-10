import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getOptionalUser, jsonError } from "@/app/api/_utils/auth";

const VerificationRequestSchema = z.object({
  kind: z.string().trim().min(1),
  fullName: z.string().trim().min(1),
  whatsAppPhone: z.string().trim().min(1),
  email: z.string().trim().email().optional(),
  city: z.string().trim().optional(),
  neighborhood: z.string().trim().optional(),
  listingRefOrUrl: z.string().trim().optional(),
  message: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = VerificationRequestSchema.safeParse(json);
    if (!parsed.success) return jsonError(400, "INVALID_PAYLOAD");

    const user = await getOptionalUser(request);

    const created = await prisma.verificationRequest.create({
      data: {
        userId: user?.id ?? null,
        kind: parsed.data.kind,
        fullName: parsed.data.fullName,
        whatsAppPhone: parsed.data.whatsAppPhone,
        email: parsed.data.email || null,
        city: parsed.data.city || null,
        neighborhood: parsed.data.neighborhood || null,
        listingRefOrUrl: parsed.data.listingRefOrUrl || null,
        message: parsed.data.message || null,
      },
      select: { id: true, status: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, verificationRequest: created }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR" } }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
