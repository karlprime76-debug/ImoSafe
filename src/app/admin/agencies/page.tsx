"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DEMO_AGENCIES, type VerificationStatus } from "@/lib/demoData";

export default function AdminAgenciesPage() {
  const [overrides, setOverrides] = useState<Record<string, VerificationStatus>>({});

  const rows = useMemo(
    () =>
      DEMO_AGENCIES.map((a) => ({
        ...a,
        actionStatus: overrides[a.id] ?? a.verificationStatus,
      })),
    [overrides],
  );

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <Link href="/admin" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
          ← Retour admin
        </Link>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Agences à vérifier</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">MVP: actions mock (statut non persisté).</p>

        <div className="mt-6 grid gap-3">
          {rows.map((a) => (
            <div key={a.id} className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-extrabold">{a.name}</div>
                <div className="text-xs font-semibold text-slate-600 dark:text-white/60">{a.actionStatus}</div>
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-white/70">{a.city}</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-white/70">{a.address}</div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white"
                  onClick={() => setOverrides((o) => ({ ...o, [a.id]: "VERIFIED" }))}
                >
                  Valider
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-amber-600 px-4 text-sm font-semibold text-white"
                  onClick={() => setOverrides((o) => ({ ...o, [a.id]: "SUSPICIOUS" }))}
                >
                  Marquer suspect
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white"
                  onClick={() => setOverrides((o) => ({ ...o, [a.id]: "REJECTED" }))}
                >
                  Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
