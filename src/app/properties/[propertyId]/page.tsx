import Link from "next/link";
import { notFound } from "next/navigation";

import { FavoriteButton } from "@/components/properties/FavoriteButton";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { ReportButton } from "@/components/properties/ReportButton";
import { VisitRequestForm } from "@/components/properties/VisitRequestForm";
import { PriceTag } from "@/components/ui/PriceTag";
import { TrustScoreBadge } from "@/components/ui/TrustScoreBadge";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { RecordRecent } from "@/components/properties/RecordRecent";
import { DEMO_PROPERTIES, type VerificationStatus } from "@/lib/demoData";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ propertyId: string }> | { propertyId: string };
}) {
  const resolved = await Promise.resolve(params);
  const propertyId = decodeURIComponent(resolved.propertyId).trim();

  const apiUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/public/properties/${encodeURIComponent(propertyId)}`;

  type ApiResponse =
    | {
        ok: true;
        property: {
          id: string;
          title: string;
          description: string;
          type: string;
          transactionType: string;
          price: number;
          city: string;
          neighborhood: string;
          address?: string;
          bedrooms?: number;
          bathrooms?: number;
          area?: number;
          images: Array<string | { url: string; alt?: string }>;
          verificationStatus: string;
          trustScore?: number;
          postedBy: { kind: "agency" | "owner"; name: string };
          documentsSummary: { providedCount: number; pendingCount: number; verifiedCount: number };
        };
      }
    | { ok: false; error?: { message?: string } }
    | null;

  let res: Response | null = null;
  let data: ApiResponse = null;

  try {
    res = await fetch(apiUrl, { cache: "no-store" });
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      data = (await res.json()) as ApiResponse;
    }
  } catch {
    // handled below
  }

  if (!res || !res.ok || !data || !data.ok) {
    const demo = DEMO_PROPERTIES.find((p) => p.id === propertyId);
    if (!demo) return notFound();

    data = {
      ok: true,
      property: {
        id: demo.id,
        title: demo.title,
        description: demo.description,
        type: demo.type,
        transactionType: demo.transactionType,
        price: demo.price,
        city: demo.city,
        neighborhood: demo.neighborhood,
        address: demo.address,
        bedrooms: demo.bedrooms,
        bathrooms: demo.bathrooms,
        area: demo.area,
        images: demo.images,
        verificationStatus: demo.verificationStatus,
        trustScore: demo.trustScore,
        postedBy: demo.postedBy,
        documentsSummary: { providedCount: 0, pendingCount: 0, verifiedCount: 0 },
      },
    };
  }

  const property = data.property;
  const trustScore = property.trustScore;
  const verificationStatus = property.verificationStatus as VerificationStatus;
  const providedCount = property.documentsSummary.providedCount;
  const pendingCount = property.documentsSummary.pendingCount;
  const verifiedCount = property.documentsSummary.verifiedCount;

  return (
    <div className="min-h-full">
      <SiteHeader />

      <RecordRecent propertyId={property.id} />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-3">
          <Link href="/properties" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
            ← Retour aux biens
          </Link>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="grid gap-4">
              <PropertyGallery images={property.images} title={property.title} />

              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="truncate text-2xl font-extrabold tracking-tight">{property.title}</h1>
                    <div className="mt-1 text-sm text-slate-600 dark:text-white/70">
                      {property.city}
                      {property.neighborhood ? ` • ${property.neighborhood}` : ""}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {typeof trustScore === "number" ? (
                      <TrustScoreBadge score={trustScore} />
                    ) : null}
                    <VerificationBadge status={verificationStatus} />
                  </div>
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <PriceTag amount={property.price} />
                  <div className="text-sm font-semibold text-slate-600 dark:text-white/70">
                    {property.transactionType === "RENT" ? "Location" : "Vente"}
                  </div>
                </div>

                <div className="mt-4 text-sm text-slate-700 dark:text-white/70">{property.description}</div>

                <div className="mt-4 rounded-2xl border border-black/10 bg-slate-50 p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-white/70">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white">Documents (public)</div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    <DocStat label="Documents fournis" value={providedCount} />
                    <DocStat label="En cours de vérification" value={pendingCount} />
                    <DocStat label="Documents vérifiés" value={verifiedCount} />
                  </div>
                  <div className="mt-2 text-xs text-slate-600 dark:text-white/60">
                    Pour des raisons de sécurité, les liens vers les documents ne sont visibles que par l’équipe ImoSafe et le propriétaire.
                  </div>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-white/70 sm:grid-cols-3">
                  <div className="rounded-2xl border border-black/10 bg-slate-50 p-3 dark:border-white/10 dark:bg-black/20">
                    <div className="text-xs font-semibold">Chambres</div>
                    <div className="mt-1 font-bold">{property.bedrooms ?? "—"}</div>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-slate-50 p-3 dark:border-white/10 dark:bg-black/20">
                    <div className="text-xs font-semibold">Salles de bain</div>
                    <div className="mt-1 font-bold">{property.bathrooms ?? "—"}</div>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-slate-50 p-3 dark:border-white/10 dark:bg-black/20">
                    <div className="text-xs font-semibold">Surface</div>
                    <div className="mt-1 font-bold">{property.area ? `${property.area} m²` : "—"}</div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-amber-600/20 bg-amber-500/10 p-4 text-sm text-amber-900 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
                  <div className="font-semibold">Conseil sécurité</div>
                  <div className="mt-1">Ne payez jamais avant visite ou vérification.</div>
                  <div className="mt-1">Ne versez jamais d’argent hors canal vérifié.</div>
                  <div className="mt-1">ImoSafe réduit les risques mais ne remplace pas une vérification juridique complète.</div>
                  <div className="mt-2 text-xs">Ce score est un indicateur d’aide à la décision, pas une garantie.</div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Link
                    href="/request-verification"
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  >
                    Demander une vérification
                  </Link>
                  <Link
                    href="/guide-anti-arnaque"
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    Guide anti-arnaque
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold">Demander une visite</div>
                    <div className="mt-1 text-xs text-slate-600 dark:text-white/70">
                      Une demande = plus de traçabilité et moins de risques.
                    </div>
                  </div>
                  <VerificationBadge status={verificationStatus} />
                </div>

                <div className="mt-4">
                  <VisitRequestForm propertyId={property.id} />
                </div>

                <div className="mt-4 grid gap-2">
                  <FavoriteButton propertyId={property.id} />
                  <ReportButton propertyId={property.id} />
                </div>
              </div>

              <div className="rounded-3xl border border-black/10 bg-white p-5 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                <div className="font-semibold">Publié par</div>
                <div className="mt-1">
                  {property.postedBy.kind === "agency" ? "Agence" : "Propriétaire"} • {property.postedBy.name}
                </div>
                <div className="mt-3 text-xs">
                  Badge: <span className="font-semibold">{property.verificationStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function DocStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-3 text-xs dark:border-white/10 dark:bg-white/5">
      <div className="font-semibold text-slate-600 dark:text-white/60">{label}</div>
      <div className="mt-1 text-base font-extrabold text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}
