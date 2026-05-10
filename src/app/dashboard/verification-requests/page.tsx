"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { VerificationRequestStoreItem } from "@/lib/mockDataStore";
import { getVerificationRequests, updateVerificationRequestStatus } from "@/lib/mockDataStore";

export default function DashboardVerificationRequestsPage() {
  const [requests, setRequests] = useState<VerificationRequestStoreItem[]>([]);

  useEffect(() => {
    const read = () => setRequests(getVerificationRequests());

    read();
    window.addEventListener("imosafe:verificationRequests", read);
    return () => window.removeEventListener("imosafe:verificationRequests", read);
  }, []);

  const rows = useMemo(() => {
    return requests.map((r) => ({
      ...r,
      requestDate: new Date(r.createdAt),
    }));
  }, [requests]);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
            >
              ← Retour au dashboard
            </Link>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Demandes de vérification</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
              Historique de tes demandes (mock). MVP: stockées localement.
            </p>
          </div>
          <StatusBadge tone="neutral">{rows.length} demandes</StatusBadge>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/request-verification"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Nouvelle demande
          </Link>
          <Link
            href="/verification"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            Comment ImoSafe vérifie
          </Link>
        </div>

        {rows.length ? (
          <div className="mt-6 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="grid gap-0">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className="grid gap-3 border-b border-black/5 p-5 last:border-b-0 dark:border-white/10 sm:grid-cols-[1.1fr_0.9fr_0.8fr]"
                >
                  <div className="min-w-0">
                    <div className="truncate text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {labelForKind(r.kind)}
                    </div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-white/70">
                      {r.city ? r.city : ""}
                      {r.neighborhood ? ` • ${r.neighborhood}` : ""}
                    </div>
                    {r.listingRefOrUrl ? (
                      <div className="mt-2 text-xs text-slate-500 dark:text-white/50">Réf: {r.listingRefOrUrl}</div>
                    ) : null}
                  </div>

                  <div className="grid gap-1 text-sm text-slate-700 dark:text-white/70">
                    <div className="text-xs font-semibold text-slate-600 dark:text-white/60">Contact</div>
                    <div className="font-semibold text-slate-900 dark:text-white">{r.fullName}</div>
                    <div className="text-xs text-slate-500 dark:text-white/50">WhatsApp: {r.whatsAppPhone}</div>
                    {r.email ? <div className="text-xs text-slate-500 dark:text-white/50">Email: {r.email}</div> : null}
                  </div>

                  <div className="grid content-start gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone={toneForStatus(r.status)}>{labelForStatus(r.status)}</StatusBadge>
                      <StatusBadge tone="neutral">
                        {r.requestDate.toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </StatusBadge>
                    </div>
                    {r.message ? (
                      <div className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-white/70">
                        {r.message}
                      </div>
                    ) : null}

                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                        onClick={() => updateVerificationRequestStatus(r.id, "IN_REVIEW")}
                      >
                        Marquer en cours
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                        onClick={() => updateVerificationRequestStatus(r.id, "DONE")}
                      >
                        Terminé
                      </button>

                      {(() => {
                        const wa = (r.whatsAppPhone ?? "").replace(/[^0-9]/g, "");
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
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            Aucune demande de vérification pour le moment.
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function labelForKind(kind: string) {
  if (kind === "VERIFY_LISTING") return "Vérifier une annonce";
  if (kind === "VERIFY_OWNER") return "Vérifier un propriétaire";
  if (kind === "VERIFY_AGENCY") return "Vérifier une agence";
  if (kind === "VERIFY_STAY") return "Vérifier un logement courte durée";
  if (kind === "VERIFY_DOCUMENTS") return "Vérifier des documents";
  return kind;
}

function labelForStatus(status: VerificationRequestStoreItem["status"]) {
  if (status === "DONE") return "Terminé";
  if (status === "IN_REVIEW") return "En analyse";
  return "En attente";
}

function toneForStatus(status: VerificationRequestStoreItem["status"]) {
  if (status === "DONE") return "success" as const;
  if (status === "IN_REVIEW") return "info" as const;
  return "warning" as const;
}
