import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { jsonError } from "@/app/api/_utils/auth";

const ManualPaymentSchema = z.object({
  fullName: z.string().trim().min(1),
  whatsAppPhone: z.string().trim().min(1),
  email: z.string().trim().email().optional(),
  offer: z.enum(["AGENCE_PRO", "HOST_STAYS_PRO", "PREMIUM_USER", "VERIFICATION", "BOOST_LISTING"]),
  message: z.string().trim().optional(),
  proofHint: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = ManualPaymentSchema.safeParse(json);
    if (!parsed.success) return jsonError(400, "INVALID_PAYLOAD");

    const combinedMessage =
      parsed.data.proofHint && parsed.data.proofHint.trim()
        ? [parsed.data.message?.trim(), `Preuve/indice: ${parsed.data.proofHint.trim()}`].filter(Boolean).join("\n\n")
        : parsed.data.message?.trim();

    const created = await prisma.manualPaymentRequest.create({
      data: {
        name: parsed.data.fullName,
        phone: parsed.data.whatsAppPhone,
        email: parsed.data.email || null,
        offer: parsed.data.offer,
        message: combinedMessage || null,
      },
      select: { id: true, status: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, manualPaymentRequest: created }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR" } }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
