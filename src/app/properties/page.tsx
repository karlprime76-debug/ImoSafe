"use client";

import { useEffect, useMemo, useState } from "react";

import { PropertiesBrowser } from "@/components/properties/PropertiesBrowser";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import Link from "next/link";

type PublicProperty = {
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
  images: string[];
  verificationStatus: string;
  trustScore?: number;
  postedBy: { kind: "agency" | "owner"; name: string };
};

export default function PropertiesPage() {
  const [items, setItems] = useState<PublicProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/public/properties");
        const data = (await res.json()) as
          | { ok: true; properties: PublicProperty[] }
          | { ok: false; error?: { message?: string } };
        if (!res.ok || !data.ok) {
          setError((data.ok ? undefined : data.error?.message) || "Erreur serveur.");
          setItems([]);
          return;
        }
        setItems(data.properties);
      } catch {
        setError("Erreur serveur.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const verifiedOnly = useMemo(() => items.filter((p) => p.verificationStatus === "VERIFIED"), [items]);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Biens immobiliers</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
              Filtre par ville, quartier, type, location/vente, prix, et biens vérifiés.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
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

        {error ? <div className="mt-6 text-sm font-semibold text-rose-700 dark:text-rose-300">{error}</div> : null}

        {loading ? (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            Chargement...
          </div>
        ) : (
          <PropertiesBrowser properties={verifiedOnly as never} />
        )}

        <div className="mt-10 rounded-2xl border border-black/10 bg-white p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
          <div className="font-semibold">Rappel anti-arnaque</div>
          <div className="mt-1">
            Ne payez jamais avant visite ou vérification. Signalez toute demande d’argent suspecte.
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
