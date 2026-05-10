"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { ManualPaymentRequestStoreItem } from "@/lib/mockDataStore";
import { getManualPaymentRequests, updateManualPaymentRequestStatus } from "@/lib/mockDataStore";
import { useMockSession } from "@/lib/useMockSession";

export default function AdminManualPaymentsPage() {
  const session = useMockSession();
  const canView = session?.role === "ADMIN";

  const [items, setItems] = useState<ManualPaymentRequestStoreItem[]>([]);

  useEffect(() => {
    if (!canView) return;
    const read = () => setItems(getManualPaymentRequests());
    read();
    window.addEventListener("imosafe:manualPaymentRequests", read);
    return () => window.removeEventListener("imosafe:manualPaymentRequests", read);
  }, [canView]);

  const rows = useMemo(() => {
    return items.map((it) => ({
      ...it,
      createdDate: new Date(it.createdAt),
    }));
  }, [items]);

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/admin" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
              ← Retour admin
            </Link>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Paiements manuels</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/70">MVP mock: demandes stockées localement sur le navigateur.</p>
          </div>
          <StatusBadge tone="neutral">{rows.length} demandes</StatusBadge>
        </div>

        {!canView ? (
          <div className="mt-6 rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
            <div className="font-extrabold">Accès réservé à l’équipe ImoSafe</div>
            <div className="mt-2">Connecte-toi avec un compte administrateur pour gérer les demandes de paiement.</div>
          </div>
        ) : rows.length ? (
          <div className="mt-6 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="grid gap-0">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className="grid gap-3 border-b border-black/5 p-5 last:border-b-0 dark:border-white/10 sm:grid-cols-[1.1fr_0.9fr_0.9fr]"
                >
                  <div className="min-w-0">
                    <div className="truncate text-base font-extrabold tracking-tight text-slate-900 dark:text-white">{r.fullName}</div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-white/70">Offre: {labelForOffer(r.offer)}</div>
                    <div className="mt-2 text-xs text-slate-500 dark:text-white/50">Tel: {r.whatsAppPhone}</div>
                    {r.email ? <div className="mt-1 text-xs text-slate-500 dark:text-white/50">Email: {r.email}</div> : null}
                  </div>

                  <div className="grid gap-2 content-start">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone={toneForStatus(r.status)}>{labelForStatus(r.status)}</StatusBadge>
                      <StatusBadge tone="neutral">
                        {r.createdDate.toLocaleDateString("fr-FR", {
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

                    {r.proofHint ? (
                      <div className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-white/70">
                        Preuve/indice: {r.proofHint}
                      </div>
                    ) : null}
                  </div>

                  <div className="grid content-start gap-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                        onClick={() => updateManualPaymentRequestStatus(r.id, "IN_REVIEW")}
                      >
                        Marquer reçu
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                        onClick={() => updateManualPaymentRequestStatus(r.id, "ACTIVATED")}
                      >
                        Activer manuellement
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                        onClick={() => updateManualPaymentRequestStatus(r.id, "REJECTED")}
                      >
                        Rejeter
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
            Aucune demande pour le moment. Test: envoie une demande depuis “/payment-manual”.
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function labelForOffer(offer: ManualPaymentRequestStoreItem["offer"]) {
  if (offer === "AGENCE_PRO") return "Agence Pro";
  if (offer === "HOST_STAYS_PRO") return "Hôte Séjours Pro";
  if (offer === "PREMIUM_USER") return "Premium utilisateur";
  if (offer === "VERIFICATION") return "Vérification ImoSafe";
  if (offer === "BOOST_LISTING") return "Mise en avant annonce";
  return offer;
}

function labelForStatus(status: ManualPaymentRequestStoreItem["status"]) {
  if (status === "ACTIVATED") return "Activée";
  if (status === "REJECTED") return "Rejetée";
  if (status === "IN_REVIEW") return "Reçue / en cours";
  return "En attente";
}

function toneForStatus(status: ManualPaymentRequestStoreItem["status"]) {
  if (status === "ACTIVATED") return "success" as const;
  if (status === "REJECTED") return "danger" as const;
  if (status === "IN_REVIEW") return "info" as const;
  return "warning" as const;
}
