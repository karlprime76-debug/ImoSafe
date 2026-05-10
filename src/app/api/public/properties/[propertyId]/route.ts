import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function jsonError(status: number, message: string) {
  return NextResponse.json({ ok: false, error: { message } }, { status, headers: { "cache-control": "no-store" } });
}

export async function GET(_req: Request, ctx: { params: Promise<{ propertyId: string }> }) {
  const { propertyId: rawId } = await ctx.params;
  const propertyId = decodeURIComponent(rawId).trim();

  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      isHidden: false,
      status: { not: "HIDDEN" },
    },
    include: {
      owner: { select: { name: true } },
      agency: { select: { name: true } },
      documents: { select: { id: true, verificationStatus: true } },
      propertyImages: { select: { url: true, alt: true, sortOrder: true }, orderBy: { sortOrder: "asc" } },
    },
  });

  if (!property) return jsonError(404, "Not found");

  const docs = property.documents ?? [];

  const item = {
    id: property.id,
    title: property.title,
    description: property.description,
    type: property.type,
    transactionType: property.transactionType,
    price: property.price,
    city: property.city,
    neighborhood: property.neighborhood ?? "",
    address: property.address ?? undefined,
    bedrooms: property.bedrooms ?? undefined,
    bathrooms: property.bathrooms ?? undefined,
    area: property.area ?? undefined,
    images: property.propertyImages?.length
      ? property.propertyImages.map((i) => ({ url: i.url, alt: i.alt ?? undefined }))
      : property.images,
    verificationStatus: property.verificationStatus,
    trustScore: property.trustScore ?? undefined,
    postedBy: property.agency
      ? ({ kind: "agency", name: property.agency.name } as const)
      : ({ kind: "owner", name: property.owner?.name ?? "Propriétaire" } as const),
    documentsSummary: {
      providedCount: docs.length,
      pendingCount: docs.filter((d) => d.verificationStatus === "PENDING").length,
      verifiedCount: docs.filter((d) => d.verificationStatus === "VERIFIED").length,
    },
  };

  return NextResponse.json({ ok: true, property: item }, { headers: { "cache-control": "no-store" } });
}
