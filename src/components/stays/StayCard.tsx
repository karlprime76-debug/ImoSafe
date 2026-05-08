import Link from "next/link";

import type { Stay } from "@/lib/demoData";
import { cn } from "@/lib/utils";
import { PriceTag } from "@/components/ui/PriceTag";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TrustScoreBadge } from "@/components/ui/TrustScoreBadge";

export function StayCard({ stay, className }: { stay: Stay; className?: string }) {
  const cover = stay.images[0] ?? "";

  return (
    <div
      className={cn(
        "grid overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5",
        className,
      )}
    >
      <Link href={`/stays/${encodeURIComponent(stay.id)}`} className="group relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-white/10">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={stay.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : null}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {stay.verificationStatus === "VERIFIED" ? <StatusBadge tone="success">Logement vérifié</StatusBadge> : null}
          {stay.hostVerified ? <StatusBadge tone="info">Hôte vérifié</StatusBadge> : null}
          {stay.photosVerified ? <StatusBadge tone="success">Photos vérifiées</StatusBadge> : null}
          {typeof stay.trustScore === "number" ? <TrustScoreBadge score={stay.trustScore} /> : null}
        </div>
      </Link>

      <div className="grid gap-3 p-4">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-slate-900 dark:text-white">{stay.title}</div>
          <div className="mt-0.5 text-sm text-slate-600 dark:text-white/70">
            {stay.city}
            {stay.neighborhood ? ` • ${stay.neighborhood}` : ""}
          </div>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <PriceTag amount={stay.pricePerNight} />
            <div className="text-xs font-medium text-slate-600 dark:text-white/60">/ nuit</div>
          </div>
          <div className="text-xs font-medium text-slate-600 dark:text-white/60">
            {stay.maxGuests} voyageurs • {stay.bedrooms} ch • {stay.bathrooms} sdb
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/stays/${encodeURIComponent(stay.id)}`}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            Voir le séjour
          </Link>
          <Link
            href={`/stays/${encodeURIComponent(stay.id)}?focus=booking`}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Demander une réservation
          </Link>
        </div>
      </div>
    </div>
  );
}
