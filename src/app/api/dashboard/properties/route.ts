import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const ALLOWED_PROPERTY_DOCUMENT_TYPES = new Set([
  "ID",
  "TITLE_DEED",
  "SALE_CONVENTION",
  "LEASE",
  "RECEIPT",
  "RENTAL_AUTH",
  "OWNER_ID",
  "AGENCY_LICENSE",
  "OTHER",
]);

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
  const sessionId = req.headers.get("x-imosafe-session-id");
  if (!sessionId) return { ok: false as const, res: jsonError(401, "Unauthorized", "UNAUTHORIZED") };

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: { id: true, role: true },
  });

  if (!user) return { ok: false as const, res: jsonError(401, "Unauthorized", "UNAUTHORIZED") };

  const canPublish = user.role === "OWNER" || user.role === "AGENCY" || user.role === "ADMIN";
  if (!canPublish) return { ok: false as const, res: jsonError(403, "Forbidden", "FORBIDDEN") };

  return { ok: true as const, user };
}

export async function GET(req: Request) {
  const auth = await requireSessionUser(req);
  if (!auth.ok) return auth.res;

  const where =
    auth.user.role === "ADMIN"
      ? {}
      : auth.user.role === "AGENCY"
        ? {
            OR: [{ ownerId: auth.user.id }, { agency: { ownerId: auth.user.id } }],
          }
        : {
            ownerId: auth.user.id,
          };

  const properties = await prisma.property.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      propertyImages: { orderBy: { sortOrder: "asc" } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  return NextResponse.json(
    {
      ok: true,
      properties,
    },
    { headers: { "cache-control": "no-store" } }
  );
}

type PublishPropertyBody = {
  title: string;
  description?: string;
  type: "HOUSE" | "APARTMENT" | "LAND" | "OFFICE" | "SHOP" | "WAREHOUSE";
  transactionType: "RENT" | "SALE";
  price: number;
  city: string;
  neighborhood?: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: Array<{ url: string; alt?: string }>;
  documents?: Array<{ type: string; name: string; url: string }>;
  contactWhatsApp?: string;
  notes?: string;
};

export async function POST(req: Request) {
  const auth = await requireSessionUser(req);
  if (!auth.ok) return auth.res;

  let body: PublishPropertyBody;
  try {
    body = (await req.json()) as PublishPropertyBody;
  } catch {
    return jsonError(400, "Invalid JSON", "BAD_REQUEST");
  }

  const title = body.title?.trim();
  const description = body.description?.trim() ?? "";
  const city = body.city?.trim();
  const neighborhood = body.neighborhood?.trim() || null;
  const address = body.address?.trim() || null;
  const contactWhatsApp = body.contactWhatsApp?.trim() || null;
  const notes = body.notes?.trim() || null;

  if (!title || title.length < 3) return jsonError(400, "Titre invalide", "VALIDATION_ERROR");
  if (!city) return jsonError(400, "Ville invalide", "VALIDATION_ERROR");
  if (!Number.isFinite(body.price) || body.price < 0) return jsonError(400, "Prix invalide", "VALIDATION_ERROR");

  const images = (body.images ?? [])
    .map((i) => ({ url: i.url?.trim() ?? "", alt: i.alt?.trim() || null }))
    .filter((i) => Boolean(i.url));

  const documents = (body.documents ?? [])
    .map((d) => ({ type: d.type?.trim() ?? "", name: d.name?.trim() ?? "", url: d.url?.trim() ?? "" }))
    .filter((d) => Boolean(d.type) && Boolean(d.name) && Boolean(d.url) && ALLOWED_PROPERTY_DOCUMENT_TYPES.has(d.type));

  const price = Math.floor(body.price);
  const bedrooms = typeof body.bedrooms === "number" && Number.isFinite(body.bedrooms) ? Math.floor(body.bedrooms) : null;
  const bathrooms = typeof body.bathrooms === "number" && Number.isFinite(body.bathrooms) ? Math.floor(body.bathrooms) : null;
  const area = typeof body.area === "number" && Number.isFinite(body.area) ? Math.floor(body.area) : null;

  const agency =
    auth.user.role === "AGENCY"
      ? await prisma.agency.findFirst({ where: { ownerId: auth.user.id }, select: { id: true } })
      : null;

  const created = await prisma.property.create({
    data: {
      title,
      description,
      type: body.type,
      transactionType: body.transactionType,
      price,
      city,
      neighborhood,
      address,
      bedrooms,
      bathrooms,
      area,
      contactWhatsApp,
      notes,
      images: images.map((i) => i.url),
      ownerId: auth.user.id,
      agencyId: agency?.id ?? null,
      verificationStatus: "PENDING",
      status: "AVAILABLE",
      isHidden: false,
      propertyImages: {
        create: images.map((img, idx) => ({
          url: img.url,
          alt: img.alt,
          sortOrder: idx,
        })),
      },
      documents: {
        create: documents.map((d) => ({
          type: d.type as never,
          fileUrl: d.url,
          fileName: d.name,
          verificationStatus: "PENDING",
          uploadedById: auth.user.id,
        })),
      },
    },
    include: {
      propertyImages: { orderBy: { sortOrder: "asc" } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  return NextResponse.json(
    {
      ok: true,
      property: created,
      message: "Annonce envoyée pour vérification ImoSafe.",
    },
    { headers: { "cache-control": "no-store" } }
  );
}
