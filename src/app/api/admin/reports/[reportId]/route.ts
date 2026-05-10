import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/app/api/_utils/auth";

const PatchSchema = z.object({
  status: z.enum(["OPEN", "IN_REVIEW", "RESOLVED", "REJECTED"]),
});

export async function PATCH(request: Request, ctx: { params: Promise<{ reportId: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.res;

    const { reportId: rawId } = await ctx.params;
    const reportId = decodeURIComponent(rawId).trim();

    const json = await request.json();
    const parsed = PatchSchema.safeParse(json);
    if (!parsed.success) return jsonError(400, "INVALID_PAYLOAD");

    const updated = await prisma.scamReport.update({
      where: { id: reportId },
      data: { status: parsed.data.status },
      select: { id: true, status: true },
    });

    return NextResponse.json({ ok: true, report: updated }, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    void e;
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR" } }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
