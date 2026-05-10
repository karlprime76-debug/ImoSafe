import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/api/_utils/auth";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.res;

  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { name: true } },
      agency: { select: { name: true } },
      propertyImages: { select: { id: true } },
      documents: { select: { id: true, verificationStatus: true } },
    },
    take: 500,
  });

  const rows = properties.map((p) => {
    const docs = p.documents ?? [];
    const imagesCount = p.propertyImages?.length ?? (p.images?.length ?? 0);

    return {
      id: p.id,
      title: p.title,
      city: p.city,
      neighborhood: p.neighborhood,
      price: p.price,
      transactionType: p.transactionType,
      type: p.type,
      status: p.status,
      verificationStatus: p.verificationStatus,
      trustScore: p.trustScore,
      isHidden: p.isHidden,
      createdAt: p.createdAt,
      postedBy: p.agency
        ? ({ kind: "agency", name: p.agency.name } as const)
        : ({ kind: "owner", name: p.owner?.name ?? "Propriétaire" } as const),
      imagesCount,
      documentsProvidedCount: docs.length,
      documentsVerifiedCount: docs.filter((d) => d.verificationStatus === "VERIFIED").length,
      documentsPendingCount: docs.filter((d) => d.verificationStatus === "PENDING").length,
    };
  });

  return NextResponse.json({ ok: true, properties: rows }, { headers: { "cache-control": "no-store" } });
}
