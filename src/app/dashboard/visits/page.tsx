"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DEMO_PROPERTIES } from "@/lib/demoData";
import { getVisitRequests, updateVisitRequestStatus, type VisitRequestStoreItem } from "@/lib/mockDataStore";

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
                <div className="mt-2 text-sm text-slate-700 dark:text-white/70">
                  Demandeur: <span className="font-semibold text-slate-900 dark:text-white">{r.name}</span> • WhatsApp: {r.whatsapp}
                </div>
                <div className="mt-2 text-xs font-semibold text-slate-600 dark:text-white/60">Statut: {r.status}</div>
                {r.message ? <div className="mt-2 text-sm text-slate-700 dark:text-white/70">Message: {r.message}</div> : null}

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                    onClick={() => updateVisitRequestStatus(r.id, "ACCEPTED")}
                  >
                    Accepter
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                    onClick={() => updateVisitRequestStatus(r.id, "DECLINED")}
                  >
                    Refuser
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                    onClick={() => updateVisitRequestStatus(r.id, "IN_REVIEW")}
                  >
                    En cours
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                    onClick={() => updateVisitRequestStatus(r.id, "DONE")}
                  >
                    Terminé
                  </button>

                  {(() => {
                    const wa = (r.whatsapp ?? "").replace(/[^0-9]/g, "");
                    const href = wa ? `https://wa.me/${wa}` : "";
                    if (!href) return null;
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center rounded-2xl border border-emerald-600/20 bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-950 shadow-sm ring-1 ring-emerald-600/20 transition hover:opacity-95 dark:border-emerald-400/20 dark:text-emerald-100 dark:ring-emerald-400/20"
                      >
                        Contacter WhatsApp
                      </a>
                    );
                  })()}
                </div>
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
