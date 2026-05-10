import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

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

const ALLOWED_STAY_DOCUMENT_TYPES = new Set(["RENTAL_AUTH", "ID", "OTHER"]);

async function requireSessionUser(req: Request) {
  const sessionId = req.headers.get("x-imosafe-session-id");
  if (!sessionId) return { ok: false as const, res: jsonError(401, "Unauthorized", "UNAUTHORIZED") };

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: { id: true, role: true },
  });

  if (!user) return { ok: false as const, res: jsonError(401, "Unauthorized", "UNAUTHORIZED") };

  const canPublish = user.role === "HOST" || user.role === "ADMIN";
  if (!canPublish) return { ok: false as const, res: jsonError(403, "Forbidden", "FORBIDDEN") };

  return { ok: true as const, user };
}

export async function GET(req: Request) {
  const auth = await requireSessionUser(req);
  if (!auth.ok) return auth.res;

  const where = auth.user.role === "ADMIN" ? {} : { hostId: auth.user.id };

  const stays = await prisma.stay.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      stayImages: { orderBy: { sortOrder: "asc" } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  return NextResponse.json({ ok: true, stays }, { headers: { "cache-control": "no-store" } });
}

type PublishStayBody = {
  title: string;
  description?: string;
  city: string;
  neighborhood: string;
  addressApprox?: string;
  pricePerNight: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  cleaningFee?: number;
  deposit?: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities?: string[];
  checkInTime?: string;
  checkOutTime?: string;
  rules?: string[];
  images?: Array<{ url: string; alt?: string }>;
  documents?: Array<{ type: string; name: string; url: string }>;
};

export async function POST(req: Request) {
  const auth = await requireSessionUser(req);
  if (!auth.ok) return auth.res;

  let body: PublishStayBody;
  try {
    body = (await req.json()) as PublishStayBody;
  } catch {
    return jsonError(400, "Invalid JSON", "BAD_REQUEST");
  }

  const title = body.title?.trim();
  const description = body.description?.trim() ?? "";
  const city = body.city?.trim();
  const neighborhood = body.neighborhood?.trim();
  const addressApprox = body.addressApprox?.trim() || null;

  if (!title || title.length < 3) return jsonError(400, "Titre invalide", "VALIDATION_ERROR");
  if (!city) return jsonError(400, "Ville invalide", "VALIDATION_ERROR");
  if (!neighborhood) return jsonError(400, "Quartier invalide", "VALIDATION_ERROR");

  const pricePerNight = Math.floor(body.pricePerNight);
  if (!Number.isFinite(pricePerNight) || pricePerNight < 0) return jsonError(400, "Prix invalide", "VALIDATION_ERROR");

  const images = (body.images ?? [])
    .map((i) => ({ url: i.url?.trim() ?? "", alt: i.alt?.trim() || null }))
    .filter((i) => Boolean(i.url));

  const documents = (body.documents ?? [])
    .map((d) => ({ type: d.type?.trim() ?? "", name: d.name?.trim() ?? "", url: d.url?.trim() ?? "" }))
    .filter((d) => Boolean(d.type) && Boolean(d.name) && Boolean(d.url) && ALLOWED_STAY_DOCUMENT_TYPES.has(d.type));

  const created = await prisma.stay.create({
    data: {
      title,
      description,
      city,
      neighborhood,
      addressApprox,
      pricePerNight,
      pricePerWeek: typeof body.pricePerWeek === "number" && Number.isFinite(body.pricePerWeek) ? Math.floor(body.pricePerWeek) : null,
      pricePerMonth: typeof body.pricePerMonth === "number" && Number.isFinite(body.pricePerMonth) ? Math.floor(body.pricePerMonth) : null,
      cleaningFee: typeof body.cleaningFee === "number" && Number.isFinite(body.cleaningFee) ? Math.floor(body.cleaningFee) : null,
      deposit: typeof body.deposit === "number" && Number.isFinite(body.deposit) ? Math.floor(body.deposit) : null,
      maxGuests: Math.max(1, Math.floor(body.maxGuests)),
      bedrooms: Math.max(0, Math.floor(body.bedrooms)),
      bathrooms: Math.max(0, Math.floor(body.bathrooms)),
      amenities: Array.isArray(body.amenities) ? body.amenities.filter(Boolean) : [],
      rules: Array.isArray(body.rules) ? body.rules.filter(Boolean) : [],
      checkInTime: body.checkInTime?.trim() || null,
      checkOutTime: body.checkOutTime?.trim() || null,
      hostId: auth.user.id,
      verificationStatus: "PENDING",
      availabilityStatus: "AVAILABLE",
      isHidden: false,
      stayImages: {
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
      stayImages: { orderBy: { sortOrder: "asc" } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  return NextResponse.json(
    { ok: true, stay: created, message: "Annonce envoyée pour vérification ImoSafe." },
    { headers: { "cache-control": "no-store" } }
  );
}
