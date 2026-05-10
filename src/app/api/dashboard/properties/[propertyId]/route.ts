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

  const canManage = user.role === "OWNER" || user.role === "AGENCY" || user.role === "ADMIN";
  if (!canManage) return { ok: false as const, res: jsonError(403, "Forbidden", "FORBIDDEN") };

  return { ok: true as const, user, sessionId: auth.sessionId };
}

async function canEditProperty(user: { id: string; role: string }, propertyId: string) {
  if (user.role === "ADMIN") return { ok: true as const };
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { ownerId: true, agency: { select: { ownerId: true } } },
  });
  if (!property) return { ok: false as const, res: jsonError(404, "Not found", "NOT_FOUND") };

  const isOwner = property.ownerId === user.id;
  const isAgencyOwner = property.agency?.ownerId === user.id;
  if (!isOwner && !isAgencyOwner) return { ok: false as const, res: jsonError(403, "Forbidden", "FORBIDDEN") };

  return { ok: true as const };
}

type UpdatePropertyBody = {
  title?: string;
  description?: string;
  type?: "HOUSE" | "APARTMENT" | "LAND" | "OFFICE" | "SHOP" | "WAREHOUSE";
  transactionType?: "RENT" | "SALE";
  price?: number;
  city?: string;
  neighborhood?: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  contactWhatsApp?: string;
  notes?: string;
  images?: Array<{ url: string; alt?: string }>;
  documents?: Array<{ type: string; name: string; url: string }>;
  action?: "HIDE" | "REACTIVATE";
};

export async function GET(req: Request, ctx: { params: Promise<{ propertyId: string }> }) {
  const auth = await requireSessionUser(req);
  if (!auth.ok) return auth.res;

  const { propertyId: rawId } = await ctx.params;
  const propertyId = decodeURIComponent(rawId).trim();

  const access = await canEditProperty(auth.user, propertyId);
  if (!access.ok) return access.res;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      propertyImages: { orderBy: { sortOrder: "asc" } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!property) return jsonError(404, "Not found", "NOT_FOUND");

  return NextResponse.json({ ok: true, property }, { headers: { "cache-control": "no-store" } });
}

export async function PUT(req: Request, ctx: { params: Promise<{ propertyId: string }> }) {
  const auth = await requireSessionUser(req);
  if (!auth.ok) return auth.res;

  const { propertyId: rawId } = await ctx.params;
  const propertyId = decodeURIComponent(rawId).trim();

  const access = await canEditProperty(auth.user, propertyId);
  if (!access.ok) return access.res;

  let body: UpdatePropertyBody;
  try {
    body = (await req.json()) as UpdatePropertyBody;
  } catch {
    return jsonError(400, "Invalid JSON", "BAD_REQUEST");
  }

  if (body.action === "HIDE") {
    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: { isHidden: true, status: "HIDDEN" },
    });
    return NextResponse.json({ ok: true, property: updated }, { headers: { "cache-control": "no-store" } });
  }

  if (body.action === "REACTIVATE") {
    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: { isHidden: false, status: "AVAILABLE" },
    });
    return NextResponse.json({ ok: true, property: updated }, { headers: { "cache-control": "no-store" } });
  }

  const existing = await prisma.property.findUnique({
    where: { id: propertyId },
    select: {
      title: true,
      description: true,
      type: true,
      transactionType: true,
      price: true,
      city: true,
      neighborhood: true,
      address: true,
      bedrooms: true,
      bathrooms: true,
      area: true,
      contactWhatsApp: true,
      notes: true,
    },
  });

  if (!existing) return jsonError(404, "Not found", "NOT_FOUND");

  const nextTitle = body.title?.trim();
  const nextDescription = body.description?.trim();
  const nextCity = body.city?.trim();

  const changedImportant =
    (typeof nextTitle === "string" && nextTitle !== existing.title) ||
    (typeof nextDescription === "string" && nextDescription !== existing.description) ||
    (typeof body.type === "string" && body.type !== existing.type) ||
    (typeof body.transactionType === "string" && body.transactionType !== existing.transactionType) ||
    (typeof body.price === "number" && Math.floor(body.price) !== existing.price) ||
    (typeof nextCity === "string" && nextCity !== existing.city) ||
    (typeof body.neighborhood === "string" && body.neighborhood !== (existing.neighborhood ?? "")) ||
    (typeof body.address === "string" && body.address !== (existing.address ?? "")) ||
    (typeof body.bedrooms === "number" && Math.floor(body.bedrooms) !== (existing.bedrooms ?? null)) ||
    (typeof body.bathrooms === "number" && Math.floor(body.bathrooms) !== (existing.bathrooms ?? null)) ||
    (typeof body.area === "number" && Math.floor(body.area) !== (existing.area ?? null));

  const images = (body.images ?? [])
    .map((i) => ({ url: i.url?.trim() ?? "", alt: i.alt?.trim() || null }))
    .filter((i) => Boolean(i.url));

  const documents = (body.documents ?? [])
    .map((d) => ({ type: d.type?.trim() ?? "", name: d.name?.trim() ?? "", url: d.url?.trim() ?? "" }))
    .filter((d) => Boolean(d.type) && Boolean(d.name) && Boolean(d.url));

  const updated = await prisma.$transaction(async (tx) => {
    if (body.images) {
      await tx.propertyImage.deleteMany({ where: { propertyId } });
    }
    if (body.documents) {
      await tx.document.deleteMany({ where: { propertyId } });
    }

    const property = await tx.property.update({
      where: { id: propertyId },
      data: {
        title: typeof nextTitle === "string" ? nextTitle : undefined,
        description: typeof nextDescription === "string" ? nextDescription : undefined,
        type: body.type,
        transactionType: body.transactionType,
        price: typeof body.price === "number" ? Math.floor(body.price) : undefined,
        city: typeof nextCity === "string" ? nextCity : undefined,
        neighborhood: typeof body.neighborhood === "string" ? body.neighborhood.trim() || null : undefined,
        address: typeof body.address === "string" ? body.address.trim() || null : undefined,
        bedrooms: typeof body.bedrooms === "number" && Number.isFinite(body.bedrooms) ? Math.floor(body.bedrooms) : undefined,
        bathrooms: typeof body.bathrooms === "number" && Number.isFinite(body.bathrooms) ? Math.floor(body.bathrooms) : undefined,
        area: typeof body.area === "number" && Number.isFinite(body.area) ? Math.floor(body.area) : undefined,
        contactWhatsApp: typeof body.contactWhatsApp === "string" ? body.contactWhatsApp.trim() || null : undefined,
        notes: typeof body.notes === "string" ? body.notes.trim() || null : undefined,
        verificationStatus: changedImportant ? "PENDING" : undefined,
        images: body.images ? images.map((i) => i.url) : undefined,
        propertyImages: body.images
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
        propertyImages: { orderBy: { sortOrder: "asc" } },
        documents: { orderBy: { createdAt: "desc" } },
      },
    });

    return property;
  });

  return NextResponse.json(
    {
      ok: true,
      property: updated,
      message: changedImportant ? "Modifications envoyées pour vérification ImoSafe." : undefined,
    },
    { headers: { "cache-control": "no-store" } }
  );
}
