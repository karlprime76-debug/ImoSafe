"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { useMockSession } from "@/lib/useMockSession";

type Row = {
  id: string;
  title: string;
  city: string;
  neighborhood: string;
  availabilityStatus: string;
  verificationStatus: string;
  isHidden: boolean;
  createdAt: string;
};

export default function DashboardStaysPage() {
  const session = useMockSession();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!session) return;
    const canView = session.role === "HOST" || session.role === "ADMIN";
    if (!canView) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/dashboard/stays", {
        headers: {
          "x-imosafe-session-id": session.id,
        },
      });

      const data = (await res.json()) as
        | { ok: true; stays: Row[] }
        | { ok: false; error?: { message?: string; code?: string } };

      if (!res.ok || !data.ok) {
        const msg = data.ok ? "Erreur serveur." : data.error?.message;
        setError(msg || "Erreur serveur.");
        setRows([]);
        return;
      }

      setRows(data.stays);
    } catch {
      setError("Erreur serveur.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!session) return;
    const canView = session.role === "HOST" || session.role === "ADMIN";
    if (!canView) return;
    const t = window.setTimeout(() => {
      void refresh();
    }, 0);
    return () => window.clearTimeout(t);
  }, [refresh, session]);

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Mes séjours</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/70">Publication réelle (DB) + statut de vérification.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/stays/new"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              Ajouter un séjour
            </Link>
          </div>
        </div>

        {!session ? (
          <div className="mt-6 rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
            Connecte-toi pour accéder à l’espace hôte.
          </div>
        ) : session.role !== "HOST" && session.role !== "ADMIN" ? (
          <div className="mt-6 rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
            Accès réservé aux hôtes.
          </div>
        ) : error ? (
          <div className="mt-6 text-sm font-semibold text-rose-700 dark:text-rose-300">{error}</div>
        ) : loading ? (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            Chargement...
          </div>
        ) : rows.length ? (
          <div className="mt-6 grid gap-3">
            {rows.map((s) => (
              <div key={s.id} className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-extrabold">{s.title}</div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-white/60">
                    {s.verificationStatus} • {s.availabilityStatus}
                  </div>
                </div>
                <div className="mt-2 text-sm text-slate-700 dark:text-white/70">
                  {s.city} • {s.neighborhood}
                </div>
                <div className="mt-2 text-xs text-slate-600 dark:text-white/60">Créé: {new Date(s.createdAt).toLocaleString("fr-FR")}</div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={`/dashboard/stays/${encodeURIComponent(s.id)}/edit`}
                    className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    Modifier
                  </Link>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                    onClick={async () => {
                      if (!session) return;
                      await fetch(`/api/dashboard/stays/${encodeURIComponent(s.id)}`, {
                        method: "PUT",
                        headers: {
                          "content-type": "application/json",
                          "x-imosafe-session-id": session.id,
                        },
                        body: JSON.stringify({ action: "HIDE" }),
                      });
                      refresh();
                    }}
                  >
                    Masquer
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                    onClick={async () => {
                      if (!session) return;
                      await fetch(`/api/dashboard/stays/${encodeURIComponent(s.id)}`, {
                        method: "PUT",
                        headers: {
                          "content-type": "application/json",
                          "x-imosafe-session-id": session.id,
                        },
                        body: JSON.stringify({ action: "REACTIVATE" }),
                      });
                      refresh();
                    }}
                  >
                    Réactiver
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            Aucun séjour. Clique sur “Ajouter un séjour”.
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
