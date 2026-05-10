import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function jsonError(status: number, message: string) {
  return NextResponse.json({ ok: false, error: { message } }, { status, headers: { "cache-control": "no-store" } });
}

export async function GET(_req: Request, ctx: { params: Promise<{ stayId: string }> }) {
  const { stayId: rawId } = await ctx.params;
  const stayId = decodeURIComponent(rawId).trim();

  const stay = await prisma.stay.findFirst({
    where: { id: stayId, isHidden: false },
    include: {
      host: { select: { name: true, role: true } },
      documents: { select: { id: true, verificationStatus: true } },
      stayImages: { select: { url: true, alt: true, sortOrder: true }, orderBy: { sortOrder: "asc" } },
    },
  });

  if (!stay) return jsonError(404, "Not found");

  const docs = stay.documents ?? [];

  const item = {
    id: stay.id,
    title: stay.title,
    description: stay.description,
    city: stay.city,
    neighborhood: stay.neighborhood,
    addressApprox: stay.addressApprox ?? undefined,
    pricePerNight: stay.pricePerNight,
    pricePerWeek: stay.pricePerWeek ?? undefined,
    pricePerMonth: stay.pricePerMonth ?? undefined,
    cleaningFee: stay.cleaningFee ?? undefined,
    deposit: stay.deposit ?? undefined,
    maxGuests: stay.maxGuests,
    bedrooms: stay.bedrooms,
    bathrooms: stay.bathrooms,
    amenities: stay.amenities,
    images: stay.stayImages?.length ? stay.stayImages.map((i) => ({ url: i.url, alt: i.alt ?? undefined })) : [],
    availabilityStatus: stay.availabilityStatus,
    verificationStatus: stay.verificationStatus,
    trustScore: stay.trustScore ?? undefined,
    hostName: stay.host?.name ?? "Hôte",
    hostVerified: stay.host?.role === "HOST" ? true : false,
    photosVerified: stay.verificationStatus === "VERIFIED",
    checkInTime: stay.checkInTime ?? undefined,
    checkOutTime: stay.checkOutTime ?? undefined,
    rules: stay.rules,
    documentsSummary: {
      providedCount: docs.length,
      pendingCount: docs.filter((d) => d.verificationStatus === "PENDING").length,
      verifiedCount: docs.filter((d) => d.verificationStatus === "VERIFIED").length,
    },
  };

  return NextResponse.json({ ok: true, stay: item }, { headers: { "cache-control": "no-store" } });
}
