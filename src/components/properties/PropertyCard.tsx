import Link from "next/link";

import type { Property } from "@/lib/demoData";
import { cn } from "@/lib/utils";
import { PriceTag } from "@/components/ui/PriceTag";
import { VerificationBadge } from "@/components/ui/VerificationBadge";

export function PropertyCard({ property, className }: { property: Property; className?: string }) {
  const cover = property.images[0] ?? "";

  return (
    <Link
      href={`/properties/${encodeURIComponent(property.id)}`}
      className={cn(
        "group grid overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5",
        className,
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-white/10">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={property.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : null}
        <div className="absolute left-3 top-3">
          <VerificationBadge status={property.verificationStatus} />
        </div>
      </div>

      <div className="grid gap-2 p-4">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-slate-900 dark:text-white">{property.title}</div>
          <div className="mt-0.5 text-sm text-slate-600 dark:text-white/70">
            {property.city}
            {property.neighborhood ? ` • ${property.neighborhood}` : ""}
          </div>
        </div>

        <div className="flex items-end justify-between gap-3">
          <PriceTag amount={property.price} />
          <div className="text-xs font-medium text-slate-600 dark:text-white/60">
            {property.transactionType === "RENT" ? "Location" : "Vente"}
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-white/50">
          Publié par {property.postedBy.kind === "agency" ? "Agence" : "Propriétaire"} • {property.postedBy.name}
        </div>
      </div>
    </Link>
  );
}
