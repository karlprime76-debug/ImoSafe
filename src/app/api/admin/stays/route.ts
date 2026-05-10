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
