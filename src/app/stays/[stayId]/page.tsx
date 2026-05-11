import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StayBookingRequestForm } from "@/components/stays/StayBookingRequestForm";
import { StayGallery } from "@/components/stays/StayGallery";
import { PriceTag } from "@/components/ui/PriceTag";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TrustScoreBadge } from "@/components/ui/TrustScoreBadge";
import { DEMO_STAYS, type Stay } from "@/lib/demoData";

export default async function StayDetailPage({ params }: { params: Promise<{ stayId: string }> }) {
  const { stayId: rawStayId } = await params;
  const stayId = decodeURIComponent(rawStayId).trim();

  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = host ? `${proto}://${host}` : "";
  const apiUrl = `${baseUrl}/api/public/stays/${encodeURIComponent(stayId)}`;

  type ApiResponse =
    | {
        ok: true;
        stay: {
          id: string;
          title: string;
          description: string;
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
          amenities: string[];
          images: Array<{ url: string; alt?: string }>;
          availabilityStatus: string;
          verificationStatus: string;
          trustScore?: number;
          hostName: string;
          hostVerified: boolean;
          photosVerified: boolean;
          checkInTime?: string;
          checkOutTime?: string;
          rules: string[];
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
    const demo = DEMO_STAYS.find((s) => s.id === stayId);
    if (!demo) return notFound();

    data = {
      ok: true,
      stay: {
        id: demo.id,
        title: demo.title,
        description: demo.description,
        city: demo.city,
        neighborhood: demo.neighborhood,
        addressApprox: demo.addressApprox,
        pricePerNight: demo.pricePerNight,
        pricePerWeek: demo.pricePerWeek,
        pricePerMonth: demo.pricePerMonth,
        cleaningFee: demo.cleaningFee,
        deposit: demo.deposit,
        maxGuests: demo.maxGuests,
        bedrooms: demo.bedrooms,
        bathrooms: demo.bathrooms,
        amenities: demo.amenities,
        images: demo.images.map((url) => ({ url })),
        availabilityStatus: demo.availabilityStatus,
        verificationStatus: demo.verificationStatus,
        trustScore: demo.trustScore,
        hostName: demo.hostName,
        hostVerified: demo.hostVerified,
        photosVerified: demo.photosVerified,
        checkInTime: demo.checkInTime,
        checkOutTime: demo.checkOutTime,
        rules: demo.rules,
        documentsSummary: { providedCount: 0, pendingCount: 0, verifiedCount: 0 },
      },
    };
  }

  const dto = data.stay;

  const stay: Stay = {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    city: dto.city,
    neighborhood: dto.neighborhood,
    addressApprox: dto.addressApprox,
    pricePerNight: dto.pricePerNight,
    pricePerWeek: dto.pricePerWeek,
    pricePerMonth: dto.pricePerMonth,
    cleaningFee: dto.cleaningFee,
    deposit: dto.deposit,
    maxGuests: dto.maxGuests,
    bedrooms: dto.bedrooms,
    bathrooms: dto.bathrooms,
    amenities: dto.amenities,
    images: dto.images.map((i) => i.url),
    availabilityStatus: dto.availabilityStatus as Stay["availabilityStatus"],
    verificationStatus: dto.verificationStatus as Stay["verificationStatus"],
    trustScore: dto.trustScore,
    hostName: dto.hostName,
    hostVerified: dto.hostVerified,
    photosVerified: dto.photosVerified,
    checkInTime: dto.checkInTime,
    checkOutTime: dto.checkOutTime,
    rules: dto.rules,
  };

  const providedCount = dto.documentsSummary.providedCount;
  const pendingCount = dto.documentsSummary.pendingCount;
  const verifiedCount = dto.documentsSummary.verifiedCount;

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <Link href="/stays" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
          ← Retour aux séjours
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="grid gap-4">
            <StayGallery
              images={dto.images}
              title={stay.title}
              isStayVerified={stay.verificationStatus === "VERIFIED"}
              isHostVerified={stay.hostVerified}
              arePhotosVerified={stay.photosVerified}
            />

            <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-extrabold tracking-tight">{stay.title}</h1>
                  <div className="mt-1 text-sm text-slate-600 dark:text-white/70">
                    {stay.city}
                    {stay.neighborhood ? ` • ${stay.neighborhood}` : ""}
                    {stay.addressApprox ? ` • ${stay.addressApprox}` : ""}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {stay.verificationStatus === "VERIFIED" ? <StatusBadge tone="success">Logement vérifié</StatusBadge> : null}
                  {stay.hostVerified ? <StatusBadge tone="info">Hôte vérifié</StatusBadge> : null}
                  {stay.photosVerified ? <StatusBadge tone="success">Photos vérifiées</StatusBadge> : null}
                  {typeof stay.trustScore === "number" ? <TrustScoreBadge score={stay.trustScore} /> : null}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <PriceTag amount={stay.pricePerNight} />
                  <div className="text-xs font-medium text-slate-600 dark:text-white/60">/ nuit</div>
                </div>
                <div className="text-sm font-semibold text-slate-600 dark:text-white/70">
                  {stay.maxGuests} voyageurs • {stay.bedrooms} ch • {stay.bathrooms} sdb
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-white/70">
                <div>{stay.description}</div>
              </div>

              <div className="mt-4 rounded-2xl border border-black/10 bg-slate-50 p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-white/70">
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">Documents (public)</div>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <DocStat label="Documents fournis" value={providedCount} />
                  <DocStat label="En cours de vérification" value={pendingCount} />
                  <DocStat label="Documents vérifiés" value={verifiedCount} />
                </div>
                <div className="mt-2 text-xs text-slate-600 dark:text-white/60">
                  Pour des raisons de sécurité, les liens vers les documents ne sont visibles que par l’équipe ImoSafe et l’hôte.
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <InfoLine label="Prix / semaine" value={stay.pricePerWeek ? `${stay.pricePerWeek.toLocaleString("fr-FR")} XOF` : "—"} />
                <InfoLine label="Prix / mois" value={stay.pricePerMonth ? `${stay.pricePerMonth.toLocaleString("fr-FR")} XOF` : "—"} />
                <InfoLine label="Frais ménage" value={stay.cleaningFee ? `${stay.cleaningFee.toLocaleString("fr-FR")} XOF` : "—"} />
                <InfoLine label="Caution" value={stay.deposit ? `${stay.deposit.toLocaleString("fr-FR")} XOF` : "—"} />
                <InfoLine label="Check-in" value={stay.checkInTime ?? "—"} />
                <InfoLine label="Check-out" value={stay.checkOutTime ?? "—"} />
              </div>

              <div className="mt-6 grid gap-3">
                <div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-white/60">Équipements</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {stay.amenities.map((a) => (
                      <span
                        key={a}
                        className="inline-flex items-center rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-500/20 dark:bg-white/5 dark:text-white/70 dark:ring-white/10"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-white/60">Règles</div>
                  <div className="mt-2 grid gap-2 text-sm text-slate-700 dark:text-white/70">
                    {stay.rules.map((r) => (
                      <div key={r} className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-black/20">
                        {r}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-600/20 bg-amber-500/10 p-4 text-sm text-amber-900 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
                  <div className="font-semibold">Message sécurité</div>
                  <div className="mt-1">
                    Ne versez jamais d’argent en dehors d’un canal vérifié. Méfiez-vous des prix trop bas et confirmez toujours la disponibilité.
                  </div>
                  <div className="mt-1">Ne payez jamais avant visite ou vérification.</div>
                  <div className="mt-1">ImoSafe réduit les risques mais ne remplace pas une vérification juridique complète.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-black/10 bg-white p-5 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
              <div className="font-semibold">Hôte</div>
              <div className="mt-1">
                {stay.hostName} {stay.hostVerified ? "• Hôte vérifié" : ""}
              </div>
              <div className="mt-3 text-xs">
                Ce score est un indicateur d’aide à la décision, pas une garantie.
              </div>
            </div>

            <div id="booking">
              <StayBookingRequestForm stay={stay} />
            </div>

            <div className="grid gap-2">
              <Link
                href="/report-scam"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Signaler ce logement
              </Link>
              <Link
                href="/request-verification"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                Demander une vérification
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-black/20">
      <div className="text-[11px] font-semibold text-slate-600 dark:text-white/60">{label}</div>
      <div className="mt-1 font-bold text-slate-900 dark:text-white">{value}</div>
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
