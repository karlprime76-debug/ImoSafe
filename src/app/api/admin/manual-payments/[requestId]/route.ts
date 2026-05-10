import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/app/api/_utils/auth";

const PatchSchema = z.object({
  status: z.enum(["PENDING", "IN_REVIEW", "ACTIVATED", "REJECTED"]),
});

export async function PATCH(request: Request, ctx: { params: Promise<{ requestId: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.res;

    const { requestId: rawId } = await ctx.params;
    const requestId = decodeURIComponent(rawId).trim();

    const json = await request.json();
    const parsed = PatchSchema.safeParse(json);
    if (!parsed.success) return jsonError(400, "INVALID_PAYLOAD");

    const updated = await prisma.manualPaymentRequest.update({
      where: { id: requestId },
      data: { status: parsed.data.status },
      select: { id: true, status: true },
    });

    return NextResponse.json({ ok: true, manualPaymentRequest: updated }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR" } }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
