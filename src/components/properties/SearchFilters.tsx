"use client";

import { useMemo, useState } from "react";

import type { Property, PropertyType, TransactionType, VerificationStatus } from "@/lib/demoData";

type Filters = {
  city: string;
  neighborhood: string;
  type: "" | PropertyType;
  transactionType: "" | TransactionType;
  verifiedOnly: boolean;
  priceMin: string;
  priceMax: string;
};

export function SearchFilters({ properties, onChange }: { properties: Property[]; onChange: (filtered: Property[]) => void }) {
  const [filters, setFilters] = useState<Filters>({
    city: "",
    neighborhood: "",
    type: "",
    transactionType: "",
    verifiedOnly: false,
    priceMin: "",
    priceMax: "",
  });

  const cities = useMemo(() => Array.from(new Set(properties.map((p) => p.city))).sort(), [properties]);
  const neighborhoods = useMemo(
    () => Array.from(new Set(properties.map((p) => p.neighborhood).filter(Boolean) as string[])).sort(),
    [properties],
  );

  function apply(next: Filters) {
    setFilters(next);

    const min = next.priceMin ? Number(next.priceMin) : undefined;
    const max = next.priceMax ? Number(next.priceMax) : undefined;

    const filtered = properties.filter((p) => {
      if (next.city && p.city !== next.city) return false;
      if (next.neighborhood && p.neighborhood !== next.neighborhood) return false;
      if (next.type && p.type !== next.type) return false;
      if (next.transactionType && p.transactionType !== next.transactionType) return false;
      if (next.verifiedOnly && p.verificationStatus !== ("VERIFIED" satisfies VerificationStatus)) return false;
      if (typeof min === "number" && !Number.isNaN(min) && p.price < min) return false;
      if (typeof max === "number" && !Number.isNaN(max) && p.price > max) return false;
      return true;
    });

    onChange(filtered);
  }

  return (
    <div className="grid gap-3 rounded-3xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-5">
      <div className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">Filtres</div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Ville</label>
          <select
            className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
            value={filters.city}
            onChange={(e) => apply({ ...filters, city: e.target.value })}
          >
            <option value="">Toutes</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Quartier</label>
          <select
            className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
            value={filters.neighborhood}
            onChange={(e) => apply({ ...filters, neighborhood: e.target.value })}
          >
            <option value="">Tous</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Type</label>
          <select
            className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
            value={filters.type}
            onChange={(e) => apply({ ...filters, type: e.target.value as Filters["type"] })}
          >
            <option value="">Tous</option>
            <option value="HOUSE">Maison</option>
            <option value="APARTMENT">Appartement</option>
            <option value="LAND">Terrain</option>
            <option value="OFFICE">Bureau</option>
            <option value="SHOP">Boutique</option>
            <option value="WAREHOUSE">Entrepôt</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Transaction</label>
          <select
            className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
            value={filters.transactionType}
            onChange={(e) => apply({ ...filters, transactionType: e.target.value as Filters["transactionType"] })}
          >
            <option value="">Toutes</option>
            <option value="RENT">Location</option>
            <option value="SALE">Vente</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex h-11 w-full items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm dark:border-white/10 dark:bg-black/20 dark:text-white">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(e) => apply({ ...filters, verifiedOnly: e.target.checked })}
            />
            Vérifiés uniquement
          </label>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:max-w-md">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Prix min</label>
          <input
            inputMode="numeric"
            className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
            value={filters.priceMin}
            onChange={(e) => apply({ ...filters, priceMin: e.target.value.replace(/[^0-9]/g, "") })}
            placeholder="0"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Prix max</label>
          <input
            inputMode="numeric"
            className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
            value={filters.priceMax}
            onChange={(e) => apply({ ...filters, priceMax: e.target.value.replace(/[^0-9]/g, "") })}
            placeholder="∞"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          onClick={() => apply(filters)}
        >
          Appliquer
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          onClick={() => {
            const reset: Filters = {
              city: "",
              neighborhood: "",
              type: "",
              transactionType: "",
              verifiedOnly: false,
              priceMin: "",
              priceMax: "",
            };
            apply(reset);
          }}
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
