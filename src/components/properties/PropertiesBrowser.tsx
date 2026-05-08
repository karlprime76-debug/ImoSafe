"use client";

import { useMemo, useState } from "react";

import type { Property } from "@/lib/demoData";
import { SearchFilters } from "@/components/properties/SearchFilters";
import { PropertyCard } from "@/components/properties/PropertyCard";

export function PropertiesBrowser({ properties }: { properties: Property[] }) {
  const [filtered, setFiltered] = useState<Property[]>(properties);

  const emptyLabel = useMemo(() => {
    if (!filtered.length) return "Aucun bien ne correspond à tes filtres.";
    return "";
  }, [filtered.length]);

  return (
    <div className="mt-6 grid gap-6">
      <SearchFilters properties={properties} onChange={setFiltered} />

      {emptyLabel ? (
        <div className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
          {emptyLabel}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}
