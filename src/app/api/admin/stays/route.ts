import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/api/_utils/auth";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.res;

  const stays = await prisma.stay.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      host: { select: { name: true } },
      stayImages: { select: { id: true } },
      documents: { select: { id: true, verificationStatus: true } },
    },
    take: 500,
  });

  const rows = stays.map((s) => {
    const docs = s.documents ?? [];

    return {
      id: s.id,
      title: s.title,
      city: s.city,
      neighborhood: s.neighborhood,
      pricePerNight: s.pricePerNight,
      availabilityStatus: s.availabilityStatus,
      verificationStatus: s.verificationStatus,
      trustScore: s.trustScore,
      isHidden: s.isHidden,
      createdAt: s.createdAt,
      hostName: s.host?.name ?? "Hôte",
      imagesCount: s.stayImages?.length ?? 0,
      documentsProvidedCount: docs.length,
      documentsVerifiedCount: docs.filter((d) => d.verificationStatus === "VERIFIED").length,
      documentsPendingCount: docs.filter((d) => d.verificationStatus === "PENDING").length,
    };
  });

  return NextResponse.json({ ok: true, stays: rows }, { headers: { "cache-control": "no-store" } });
}
