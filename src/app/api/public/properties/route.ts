import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const properties = await prisma.property.findMany({
    where: {
      isHidden: false,
      status: { not: "HIDDEN" },
    },
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { name: true } },
      agency: { select: { name: true } },
    },
  });

  const items = properties.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    type: p.type,
    transactionType: p.transactionType,
    price: p.price,
    city: p.city,
    neighborhood: p.neighborhood ?? "",
    address: p.address ?? undefined,
    bedrooms: p.bedrooms ?? undefined,
    bathrooms: p.bathrooms ?? undefined,
    area: p.area ?? undefined,
    images: p.images,
    verificationStatus: p.verificationStatus,
    trustScore: p.trustScore ?? undefined,
    postedBy: p.agency
      ? ({ kind: "agency", name: p.agency.name } as const)
      : ({ kind: "owner", name: p.owner?.name ?? "Propriétaire" } as const),
  }));

  return NextResponse.json({ ok: true, properties: items }, { headers: { "cache-control": "no-store" } });
}
