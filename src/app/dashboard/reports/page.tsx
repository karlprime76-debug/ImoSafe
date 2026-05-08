"use client";

import { useEffect, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getScamReports, type ScamReportStoreItem } from "@/lib/mockDataStore";

export default function DashboardReportsPage() {
  const [items, setItems] = useState<ScamReportStoreItem[]>([]);

  useEffect(() => {
    const read = () => setItems(getScamReports());
    read();
    window.addEventListener("imosafe:scamReports", read);
    return () => window.removeEventListener("imosafe:scamReports", read);
  }, []);

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Mes signalements</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">MVP: signalements stockés localement.</p>

        {items.length ? (
          <div className="mt-6 grid gap-3">
            {items.map((it) => (
              <div key={it.id} className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-extrabold">{it.reason}</div>
                  <div className="text-xs text-slate-600 dark:text-white/60">{new Date(it.createdAt).toLocaleString("fr-FR")}</div>
                </div>
                <div className="mt-2 text-sm text-slate-700 dark:text-white/70">
                  Statut: <span className="font-semibold">{it.status}</span>
                </div>
                {it.propertyId ? <div className="mt-2 text-sm text-slate-700 dark:text-white/70">Bien: {it.propertyId}</div> : null}
                {it.description ? <div className="mt-2 text-sm text-slate-700 dark:text-white/70">{it.description}</div> : null}
                {it.phoneOrContact ? <div className="mt-2 text-sm text-slate-700 dark:text-white/70">Contact: {it.phoneOrContact}</div> : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            Aucun signalement pour l’instant.
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
