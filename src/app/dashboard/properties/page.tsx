"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getDraftProperties, type DraftPropertyStoreItem } from "@/lib/mockDataStore";

export default function DashboardPropertiesPage() {
  const [drafts, setDrafts] = useState<DraftPropertyStoreItem[]>([]);

  useEffect(() => {
    const read = () => setDrafts(getDraftProperties());
    read();
    window.addEventListener("imosafe:draftProperties", read);
    return () => window.removeEventListener("imosafe:draftProperties", read);
  }, []);

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Mes annonces</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/70">MVP: annonces en brouillon local.</p>
          </div>
          <Link
            href="/dashboard/properties/new"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Ajouter un bien
          </Link>
        </div>

        {drafts.length ? (
          <div className="mt-6 grid gap-3">
            {drafts.map((d) => (
              <div key={d.id} className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-extrabold">{d.title}</div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-white/60">{d.verificationStatus}</div>
                </div>
                <div className="mt-2 text-sm text-slate-700 dark:text-white/70">
                  {d.city}
                  {d.neighborhood ? ` • ${d.neighborhood}` : ""} • {d.transactionType} • {d.type}
                </div>
                <div className="mt-2 text-xs text-slate-600 dark:text-white/60">Créé: {new Date(d.createdAt).toLocaleString("fr-FR")}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            Aucune annonce. Clique sur “Ajouter un bien”.
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
