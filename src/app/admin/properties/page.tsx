"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DEMO_PROPERTIES, type Property, type VerificationStatus } from "@/lib/demoData";

type Row = Property & { actionStatus?: VerificationStatus };

export default function AdminPropertiesPage() {
  const [overrides, setOverrides] = useState<Record<string, VerificationStatus>>({});

  const rows: Row[] = useMemo(
    () =>
      DEMO_PROPERTIES.map((p) => ({
        ...p,
        actionStatus: overrides[p.id] ?? p.verificationStatus,
      })),
    [overrides],
  );

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <Link href="/admin" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
          ← Retour admin
        </Link>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Annonces à vérifier</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">MVP: actions mock (statut non persisté).</p>

        <div className="mt-6 grid gap-3">
          {rows.map((p) => (
            <div key={p.id} className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-extrabold">{p.title}</div>
                <div className="text-xs font-semibold text-slate-600 dark:text-white/60">{p.actionStatus}</div>
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-white/70">
                {p.city}
                {p.neighborhood ? ` • ${p.neighborhood}` : ""} • {p.transactionType} • {p.type}
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white"
                  onClick={() => setOverrides((o) => ({ ...o, [p.id]: "VERIFIED" }))}
                >
                  Valider
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-amber-600 px-4 text-sm font-semibold text-white"
                  onClick={() => setOverrides((o) => ({ ...o, [p.id]: "SUSPICIOUS" }))}
                >
                  Marquer suspect
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white"
                  onClick={() => setOverrides((o) => ({ ...o, [p.id]: "REJECTED" }))}
                >
                  Rejeter
                </button>
                <Link
                  href={`/properties/${encodeURIComponent(p.id)}`}
                  className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  Voir détail
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
