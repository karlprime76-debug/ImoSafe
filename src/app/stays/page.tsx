"use client";

import { useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StayCard } from "@/components/stays/StayCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DEMO_STAYS } from "@/lib/demoData";

export default function StaysPage() {
  const [neighborhood, setNeighborhood] = useState("");
  const [maxNightPrice, setMaxNightPrice] = useState<number | "">("");
  const [guests, setGuests] = useState<number | "">("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [hostVerifiedOnly, setHostVerifiedOnly] = useState(false);

  const neighborhoods = useMemo(() => {
    return Array.from(new Set(DEMO_STAYS.map((s) => s.neighborhood).filter(Boolean))).sort();
  }, []);

  const stays = useMemo(() => {
    return DEMO_STAYS.filter((s) => {
      if (neighborhood && s.neighborhood !== neighborhood) return false;
      if (typeof maxNightPrice === "number" && s.pricePerNight > maxNightPrice) return false;
      if (typeof guests === "number" && s.maxGuests < guests) return false;
      if (verifiedOnly && s.verificationStatus !== "VERIFIED") return false;
      if (hostVerifiedOnly && !s.hostVerified) return false;
      return true;
    });
  }, [guests, hostVerifiedOnly, maxNightPrice, neighborhood, verifiedOnly]);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Séjours vérifiés</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
              Trouvez une location courte durée fiable, avec hôtes, photos et logements mieux vérifiés.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="success">Logement vérifié</StatusBadge>
            <StatusBadge tone="info">Hôte vérifié</StatusBadge>
            <StatusBadge tone="neutral">Score de confiance</StatusBadge>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="grid gap-3 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Quartier</label>
              <select
                className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none dark:border-white/10 dark:bg-black/20 dark:text-white"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
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
              <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Prix max / nuit</label>
              <input
                type="number"
                className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none dark:border-white/10 dark:bg-black/20 dark:text-white"
                value={maxNightPrice}
                onChange={(e) => setMaxNightPrice(e.target.value ? Number(e.target.value) : "")}
                placeholder="Ex: 30000"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Voyageurs min.</label>
              <input
                type="number"
                min={1}
                className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none dark:border-white/10 dark:bg-black/20 dark:text-white"
                value={guests}
                onChange={(e) => setGuests(e.target.value ? Number(e.target.value) : "")}
                placeholder="Ex: 2"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Filtres</label>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-white/70">
                <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
                Logement vérifié uniquement
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-white/70">
                <input
                  type="checkbox"
                  checked={hostVerifiedOnly}
                  onChange={(e) => setHostVerifiedOnly(e.target.checked)}
                />
                Hôte vérifié uniquement
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stays.map((stay) => (
            <StayCard key={stay.id} stay={stay} />
          ))}
        </div>

        {!stays.length ? (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            Aucun séjour ne correspond à ces filtres.
          </div>
        ) : null}

        <div className="mt-10 rounded-2xl border border-amber-600/20 bg-amber-500/10 p-4 text-sm text-amber-900 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
          <div className="font-semibold">Message sécurité</div>
          <div className="mt-1">
            Ne versez jamais d’argent en dehors d’un canal vérifié. Méfiez-vous des prix trop bas et confirmez toujours la
            disponibilité.
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
