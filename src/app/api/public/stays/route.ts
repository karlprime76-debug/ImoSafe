import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const stays = await prisma.stay.findMany({
    where: {
      isHidden: false,
    },
    orderBy: { createdAt: "desc" },
    include: {
      host: { select: { name: true, role: true } },
      stayImages: { select: { url: true, alt: true, sortOrder: true }, orderBy: { sortOrder: "asc" } },
    },
  });

  const items = stays.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    city: s.city,
    neighborhood: s.neighborhood,
    addressApprox: s.addressApprox ?? undefined,
    pricePerNight: s.pricePerNight,
    pricePerWeek: s.pricePerWeek ?? undefined,
    pricePerMonth: s.pricePerMonth ?? undefined,
    cleaningFee: s.cleaningFee ?? undefined,
    deposit: s.deposit ?? undefined,
    maxGuests: s.maxGuests,
    bedrooms: s.bedrooms,
    bathrooms: s.bathrooms,
    amenities: s.amenities,
    images: s.stayImages?.length ? s.stayImages.map((i) => i.url) : [],
    availabilityStatus: s.availabilityStatus,
    verificationStatus: s.verificationStatus,
    trustScore: s.trustScore ?? undefined,
    hostName: s.host?.name ?? "Hôte",
    hostVerified: s.host?.role === "HOST" ? true : false,
    photosVerified: s.verificationStatus === "VERIFIED",
    checkInTime: s.checkInTime ?? undefined,
    checkOutTime: s.checkOutTime ?? undefined,
    rules: s.rules,
  }));

  return NextResponse.json({ ok: true, stays: items }, { headers: { "cache-control": "no-store" } });
}
