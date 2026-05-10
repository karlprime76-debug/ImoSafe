import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/api/_utils/auth";

function jsonError(status: number, code: string, message?: string) {
  return NextResponse.json(
    { ok: false, error: { code, message } },
    {
      status,
      headers: {
        "cache-control": "no-store",
      },
    }
  );
}

type PatchBody = {
  action:
    | "VERIFY"
    | "REJECT"
    | "SUSPICIOUS"
    | "HIDE"
    | "REACTIVATE"
    | "SET_VERIFICATION_STATUS";
  verificationStatus?: "NOT_VERIFIED" | "PENDING" | "VERIFIED" | "REJECTED" | "SUSPICIOUS";
};

export async function PATCH(request: Request, ctx: { params: Promise<{ propertyId: string }> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.res;

  const { propertyId: rawId } = await ctx.params;
  const propertyId = decodeURIComponent(rawId).trim();
  if (!propertyId) return jsonError(400, "BAD_REQUEST", "Missing propertyId");

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return jsonError(400, "BAD_REQUEST", "Invalid JSON");
  }

  const action = body.action;
  if (!action) return jsonError(400, "VALIDATION_ERROR", "Missing action");

  const update: {
    verificationStatus?: PatchBody["verificationStatus"];
    isHidden?: boolean;
    status?: "AVAILABLE" | "RESERVED" | "RENTED" | "SOLD" | "HIDDEN";
  } = {};

  if (action === "VERIFY") update.verificationStatus = "VERIFIED";
  else if (action === "REJECT") update.verificationStatus = "REJECTED";
  else if (action === "SUSPICIOUS") update.verificationStatus = "SUSPICIOUS";
  else if (action === "SET_VERIFICATION_STATUS") {
    if (!body.verificationStatus) return jsonError(400, "VALIDATION_ERROR", "Missing verificationStatus");
    update.verificationStatus = body.verificationStatus;
  } else if (action === "HIDE") {
    update.isHidden = true;
    update.status = "HIDDEN";
  } else if (action === "REACTIVATE") {
    update.isHidden = false;
    update.status = "AVAILABLE";
  } else {
    return jsonError(400, "VALIDATION_ERROR", "Unknown action");
  }

  try {
    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: update,
      select: { id: true, verificationStatus: true, isHidden: true, status: true },
    });

    return NextResponse.json({ ok: true, property: updated }, { headers: { "cache-control": "no-store" } });
  } catch {
    return jsonError(404, "NOT_FOUND", "Not found");
  }
}
