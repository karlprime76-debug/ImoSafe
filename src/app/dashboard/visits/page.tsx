"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DEMO_PROPERTIES } from "@/lib/demoData";
import { getVisitRequests, type VisitRequestStoreItem } from "@/lib/mockDataStore";

export default function VisitsPage() {
  const [items, setItems] = useState<VisitRequestStoreItem[]>([]);

  useEffect(() => {
    const read = () => setItems(getVisitRequests());
    read();
    window.addEventListener("imosafe:visitRequests", read);
    return () => window.removeEventListener("imosafe:visitRequests", read);
  }, []);

  const rows = useMemo(
    () =>
      items.map((it) => ({
        ...it,
        property: DEMO_PROPERTIES.find((p) => p.id === it.propertyId),
      })),
    [items],
  );

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Mes demandes de visite</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/70">MVP: demandes stockées localement.</p>
          </div>
          <Link href="/properties" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
            Trouver un bien
          </Link>
        </div>

        {rows.length ? (
          <div className="mt-6 grid gap-3">
            {rows.map((r) => (
              <div key={r.id} className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-extrabold">{r.property?.title ?? r.propertyId}</div>
                  <div className="text-xs text-slate-600 dark:text-white/60">{new Date(r.createdAt).toLocaleString("fr-FR")}</div>
                </div>
                <div className="mt-2 text-sm text-slate-700 dark:text-white/70">
                  Date: {r.preferredDate ?? "—"} • Heure: {r.preferredTime ?? "—"}
                </div>
                {r.message ? <div className="mt-2 text-sm text-slate-700 dark:text-white/70">Message: {r.message}</div> : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            Aucune demande pour l’instant.
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
