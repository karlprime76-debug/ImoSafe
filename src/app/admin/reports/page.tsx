"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getScamReports, type ScamReportStoreItem } from "@/lib/mockDataStore";

export default function AdminReportsPage() {
  const [items, setItems] = useState<ScamReportStoreItem[]>([]);
  const [status, setStatus] = useState<Record<string, ScamReportStoreItem["status"]>>({});

  useEffect(() => {
    const read = () => setItems(getScamReports());
    read();
    window.addEventListener("imosafe:scamReports", read);
    return () => window.removeEventListener("imosafe:scamReports", read);
  }, []);

  const rows = useMemo(
    () =>
      items.map((it) => ({
        ...it,
        status: status[it.id] ?? it.status,
      })),
    [items, status],
  );

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <Link href="/admin" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
          ← Retour admin
        </Link>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Signalements d’arnaque</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">MVP: actions mock sur le statut.</p>

        {rows.length ? (
          <div className="mt-6 grid gap-3">
            {rows.map((it) => (
              <div key={it.id} className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-extrabold">{it.reason}</div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-white/60">{it.status}</div>
                </div>
                <div className="mt-2 text-xs text-slate-600 dark:text-white/60">{new Date(it.createdAt).toLocaleString("fr-FR")}</div>
                {it.propertyId ? <div className="mt-2 text-sm text-slate-700 dark:text-white/70">Bien: {it.propertyId}</div> : null}
                {it.description ? <div className="mt-2 text-sm text-slate-700 dark:text-white/70">{it.description}</div> : null}
                {it.phoneOrContact ? <div className="mt-2 text-sm text-slate-700 dark:text-white/70">Contact: {it.phoneOrContact}</div> : null}

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white"
                    onClick={() => setStatus((s) => ({ ...s, [it.id]: "IN_REVIEW" }))}
                  >
                    En revue
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white"
                    onClick={() => setStatus((s) => ({ ...s, [it.id]: "RESOLVED" }))}
                  >
                    Résolu
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white"
                    onClick={() => setStatus((s) => ({ ...s, [it.id]: "REJECTED" }))}
                  >
                    Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            Aucun signalement.
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
