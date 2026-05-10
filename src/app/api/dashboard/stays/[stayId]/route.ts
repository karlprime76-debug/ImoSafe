import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireSessionId, jsonError as authJsonError } from "@/app/api/_utils/auth";

function jsonError(status: number, message: string, code?: string) {
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

async function requireSessionUser(req: Request) {
  const auth = await requireSessionId(req);
  if (!auth.ok) return { ok: false as const, res: auth.res };

  const user = await prisma.user.findUnique({ where: { id: auth.sessionId }, select: { id: true, role: true } });
  if (!user) return { ok: false as const, res: authJsonError(401, "UNAUTHORIZED") };

  const canManage = user.role === "HOST" || user.role === "ADMIN";
  if (!canManage) return { ok: false as const, res: jsonError(403, "Forbidden", "FORBIDDEN") };

  return { ok: true as const, user, sessionId: auth.sessionId };
}

async function canEditStay(user: { id: string; role: string }, stayId: string) {
  if (user.role === "ADMIN") return { ok: true as const };

  const stay = await prisma.stay.findUnique({
    where: { id: stayId },
    select: { hostId: true },
  });

  if (!stay) return { ok: false as const, res: jsonError(404, "Not found", "NOT_FOUND") };

  if (stay.hostId !== user.id) return { ok: false as const, res: jsonError(403, "Forbidden", "FORBIDDEN") };

  return { ok: true as const };
}

type UpdateStayBody = {
  title?: string;
  description?: string;
  city?: string;
  neighborhood?: string;
  addressApprox?: string;
  pricePerNight?: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  cleaningFee?: number;
  deposit?: number;
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  checkInTime?: string;
  checkOutTime?: string;
  rules?: string[];
  images?: Array<{ url: string; alt?: string }>;
  documents?: Array<{ type: string; name: string; url: string }>;
  action?: "HIDE" | "REACTIVATE";
};

export async function GET(req: Request, ctx: { params: Promise<{ stayId: string }> }) {
  const auth = await requireSessionUser(req);
  if (!auth.ok) return auth.res;

  const { stayId: rawId } = await ctx.params;
  const stayId = decodeURIComponent(rawId).trim();

  const access = await canEditStay(auth.user, stayId);
  if (!access.ok) return access.res;

  const stay = await prisma.stay.findUnique({
    where: { id: stayId },
    include: {
      stayImages: { orderBy: { sortOrder: "asc" } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!stay) return jsonError(404, "Not found", "NOT_FOUND");

  return NextResponse.json({ ok: true, stay }, { headers: { "cache-control": "no-store" } });
}

export async function PUT(req: Request, ctx: { params: Promise<{ stayId: string }> }) {
  const auth = await requireSessionUser(req);
  if (!auth.ok) return auth.res;

  const { stayId: rawId } = await ctx.params;
  const stayId = decodeURIComponent(rawId).trim();

  const access = await canEditStay(auth.user, stayId);
  if (!access.ok) return access.res;

  let body: UpdateStayBody;
  try {
    body = (await req.json()) as UpdateStayBody;
  } catch {
    return jsonError(400, "Invalid JSON", "BAD_REQUEST");
  }

  if (body.action === "HIDE") {
    const updated = await prisma.stay.update({
      where: { id: stayId },
      data: { isHidden: true },
    });
    return NextResponse.json({ ok: true, stay: updated }, { headers: { "cache-control": "no-store" } });
  }

  if (body.action === "REACTIVATE") {
    const updated = await prisma.stay.update({
      where: { id: stayId },
      data: { isHidden: false },
    });
    return NextResponse.json({ ok: true, stay: updated }, { headers: { "cache-control": "no-store" } });
  }

  const existing = await prisma.stay.findUnique({
    where: { id: stayId },
    select: {
      title: true,
      description: true,
      city: true,
      neighborhood: true,
      addressApprox: true,
      pricePerNight: true,
      maxGuests: true,
      bedrooms: true,
      bathrooms: true,
    },
  });

  if (!existing) return jsonError(404, "Not found", "NOT_FOUND");

  const nextTitle = body.title?.trim();
  const nextDescription = body.description?.trim();
  const nextCity = body.city?.trim();
  const nextNeighborhood = body.neighborhood?.trim();

  const changedImportant =
    (typeof nextTitle === "string" && nextTitle !== existing.title) ||
    (typeof nextDescription === "string" && nextDescription !== existing.description) ||
    (typeof nextCity === "string" && nextCity !== existing.city) ||
    (typeof nextNeighborhood === "string" && nextNeighborhood !== existing.neighborhood) ||
    (typeof body.addressApprox === "string" && body.addressApprox !== (existing.addressApprox ?? "")) ||
    (typeof body.pricePerNight === "number" && Math.floor(body.pricePerNight) !== existing.pricePerNight) ||
    (typeof body.maxGuests === "number" && Math.floor(body.maxGuests) !== existing.maxGuests) ||
    (typeof body.bedrooms === "number" && Math.floor(body.bedrooms) !== existing.bedrooms) ||
    (typeof body.bathrooms === "number" && Math.floor(body.bathrooms) !== existing.bathrooms);

  const images = (body.images ?? [])
    .map((i) => ({ url: i.url?.trim() ?? "", alt: i.alt?.trim() || null }))
    .filter((i) => Boolean(i.url));

  const documents = (body.documents ?? [])
    .map((d) => ({ type: d.type?.trim() ?? "", name: d.name?.trim() ?? "", url: d.url?.trim() ?? "" }))
    .filter((d) => Boolean(d.type) && Boolean(d.name) && Boolean(d.url));

  const updated = await prisma.$transaction(async (tx) => {
    if (body.images) {
      await tx.stayImage.deleteMany({ where: { stayId } });
    }
    if (body.documents) {
      await tx.document.deleteMany({ where: { stayId } });
    }

    const stay = await tx.stay.update({
      where: { id: stayId },
      data: {
        title: typeof nextTitle === "string" ? nextTitle : undefined,
        description: typeof nextDescription === "string" ? nextDescription : undefined,
        city: typeof nextCity === "string" ? nextCity : undefined,
        neighborhood: typeof nextNeighborhood === "string" ? nextNeighborhood : undefined,
        addressApprox: typeof body.addressApprox === "string" ? body.addressApprox.trim() || null : undefined,
        pricePerNight: typeof body.pricePerNight === "number" ? Math.floor(body.pricePerNight) : undefined,
        pricePerWeek: typeof body.pricePerWeek === "number" && Number.isFinite(body.pricePerWeek) ? Math.floor(body.pricePerWeek) : undefined,
        pricePerMonth: typeof body.pricePerMonth === "number" && Number.isFinite(body.pricePerMonth) ? Math.floor(body.pricePerMonth) : undefined,
        cleaningFee: typeof body.cleaningFee === "number" && Number.isFinite(body.cleaningFee) ? Math.floor(body.cleaningFee) : undefined,
        deposit: typeof body.deposit === "number" && Number.isFinite(body.deposit) ? Math.floor(body.deposit) : undefined,
        maxGuests: typeof body.maxGuests === "number" ? Math.max(1, Math.floor(body.maxGuests)) : undefined,
        bedrooms: typeof body.bedrooms === "number" ? Math.max(0, Math.floor(body.bedrooms)) : undefined,
        bathrooms: typeof body.bathrooms === "number" ? Math.max(0, Math.floor(body.bathrooms)) : undefined,
        amenities: Array.isArray(body.amenities) ? body.amenities.filter(Boolean) : undefined,
        rules: Array.isArray(body.rules) ? body.rules.filter(Boolean) : undefined,
        checkInTime: typeof body.checkInTime === "string" ? body.checkInTime.trim() || null : undefined,
        checkOutTime: typeof body.checkOutTime === "string" ? body.checkOutTime.trim() || null : undefined,
        verificationStatus: changedImportant ? "PENDING" : undefined,
        stayImages: body.images
          ? {
              create: images.map((img, idx) => ({ url: img.url, alt: img.alt, sortOrder: idx })),
            }
          : undefined,
        documents: body.documents
          ? {
              create: documents.map((d) => ({
                type: d.type as never,
                fileUrl: d.url,
                fileName: d.name,
                verificationStatus: "PENDING",
                uploadedById: auth.sessionId,
              })),
            }
          : undefined,
      },
      include: {
        stayImages: { orderBy: { sortOrder: "asc" } },
        documents: { orderBy: { createdAt: "desc" } },
      },
    });

    return stay;
  });

  return NextResponse.json(
    {
      ok: true,
      stay: updated,
      message: changedImportant ? "Modifications envoyées pour vérification ImoSafe." : undefined,
    },
    { headers: { "cache-control": "no-store" } }
  );
}
