import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

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

async function requireAdmin(request: Request) {
  const sessionId = request.headers.get("x-imosafe-session-id")?.trim();
  if (!sessionId) return { ok: false as const, res: jsonError(401, "UNAUTHORIZED") };

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: { id: true, role: true },
  });

  if (!user || user.role !== "ADMIN") return { ok: false as const, res: jsonError(403, "FORBIDDEN") };

  return { ok: true as const, adminId: user.id };
}

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
