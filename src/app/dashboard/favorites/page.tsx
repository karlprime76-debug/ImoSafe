"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { PropertyCard } from "@/components/properties/PropertyCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DEMO_PROPERTIES } from "@/lib/demoData";
import { getFavorites } from "@/lib/mockDataStore";

export default function FavoritesPage() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const read = () => setIds(getFavorites().propertyIds);
    read();
    window.addEventListener("imosafe:favorites", read);
    return () => window.removeEventListener("imosafe:favorites", read);
  }, []);

  const props = useMemo(() => DEMO_PROPERTIES.filter((p) => ids.includes(p.id)), [ids]);

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Mes favoris</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/70">MVP: favoris stockés localement.</p>
          </div>
          <Link href="/properties" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
            Voir les biens
          </Link>
        </div>

        {props.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {props.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            Aucun favori pour l’instant. Ajoute des biens depuis la page détail.
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
