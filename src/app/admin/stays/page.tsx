"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useMockSession } from "@/lib/useMockSession";

type AdminStayRow = {
  id: string;
  title: string;
  city: string;
  neighborhood: string;
  pricePerNight: number;
  availabilityStatus: string;
  verificationStatus: string;
  trustScore: number | null;
  isHidden: boolean;
  createdAt: string;
  hostName: string;
  imagesCount: number;
  documentsProvidedCount: number;
  documentsVerifiedCount: number;
  documentsPendingCount: number;
};

export default function AdminStaysPage() {
  const session = useMockSession();
  const canView = session?.role === "ADMIN";

  const [rows, setRows] = useState<AdminStayRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canView) return;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/admin/stays", {
          headers: { "x-imosafe-session-id": session.id },
          cache: "no-store",
        });

        const data = (await res.json()) as
          | { ok: true; stays: AdminStayRow[] }
          | { ok: false; error?: { code?: string; message?: string } };

        if (!res.ok || !data.ok) {
          const code = data.ok ? undefined : data.error?.code;
          if (code === "FORBIDDEN" || code === "UNAUTHORIZED") setError("Accès réservé à l’équipe ImoSafe.");
          else setError((data.ok ? undefined : data.error?.message) || "Erreur serveur.");
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
    };

    run();
  }, [canView, session?.id]);

  const countLabel = useMemo(() => `${rows.length} séjours`, [rows.length]);

  const patch = async (stayId: string, action: "VERIFY" | "REJECT" | "SUSPICIOUS" | "HIDE" | "REACTIVATE") => {
    if (!session) return;
    const res = await fetch(`/api/admin/stays/${encodeURIComponent(stayId)}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-imosafe-session-id": session.id,
        },
        body: JSON.stringify({ action }),
      }
    );

    const data = (await res.json()) as
      | { ok: true; stay: { id: string; verificationStatus: string; isHidden: boolean } }
      | { ok: false; error?: { code?: string; message?: string } };

    if (!res.ok || !data.ok) {
      setError((data.ok ? undefined : data.error?.message) || "Action impossible.");
      return;
    }

    setRows((prev) =>
      prev.map((s) =>
        s.id === data.stay.id
          ? {
              ...s,
              verificationStatus: data.stay.verificationStatus,
              isHidden: data.stay.isHidden,
            }
          : s
      )
    );
  };

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <Link href="/admin" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
          ← Retour admin
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Séjours</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/70">Modération ImoSafe (base réelle).</p>
          </div>
          <StatusBadge tone="neutral">{countLabel}</StatusBadge>
        </div>

        {!canView ? (
          <div className="mt-6 rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
            <div className="font-extrabold">Accès réservé à l’équipe ImoSafe</div>
            <div className="mt-2">Connecte-toi avec un compte administrateur pour modérer les séjours.</div>
          </div>
        ) : (
          <>
            {error ? <div className="mt-6 text-sm font-semibold text-rose-700 dark:text-rose-300">{error}</div> : null}

            <div className="mt-6 grid gap-3">
              {loading ? (
                <div className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                  Chargement...
                </div>
              ) : rows.length ? (
                rows.map((s) => (
                  <div key={s.id} className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-extrabold">{s.title}</div>
                        <div className="mt-1 text-sm text-slate-600 dark:text-white/70">
                          {s.city} • {s.neighborhood}
                        </div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-white/60">Hôte • {s.hostName}</div>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <StatusBadge tone={s.verificationStatus === "VERIFIED" ? "success" : s.verificationStatus === "SUSPICIOUS" ? "warning" : s.verificationStatus === "REJECTED" ? "danger" : "neutral"}>
                          {s.verificationStatus}
                        </StatusBadge>
                        <StatusBadge tone={s.isHidden ? "warning" : "neutral"}>{s.isHidden ? "Masqué" : "Visible"}</StatusBadge>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 text-xs text-slate-600 dark:text-white/60 sm:grid-cols-2">
                      <div>Prix: {s.pricePerNight.toLocaleString("fr-FR")} XOF / nuit</div>
                      <div>Dispo: {s.availabilityStatus}</div>
                      <div>Images: {s.imagesCount}</div>
                      <div>Docs: {s.documentsProvidedCount} (✓ {s.documentsVerifiedCount} • ⏳ {s.documentsPendingCount})</div>
                      <div>Trust: {typeof s.trustScore === "number" ? s.trustScore : "—"}</div>
                      <div>Créé: {new Date(s.createdAt).toLocaleDateString("fr-FR")}</div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white"
                        onClick={() => void patch(s.id, "VERIFY")}
                      >
                        Valider
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center rounded-2xl bg-amber-600 px-4 text-sm font-semibold text-white"
                        onClick={() => void patch(s.id, "SUSPICIOUS")}
                      >
                        Marquer suspect
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white"
                        onClick={() => void patch(s.id, "REJECT")}
                      >
                        Rejeter
                      </button>

                      {s.isHidden ? (
                        <button
                          type="button"
                          className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white"
                          onClick={() => void patch(s.id, "REACTIVATE")}
                        >
                          Réactiver
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white"
                          onClick={() => void patch(s.id, "HIDE")}
                        >
                          Masquer
                        </button>
                      )}

                      <Link
                        href={`/stays/${encodeURIComponent(s.id)}`}
                        className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      >
                        Voir détail public
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                  Aucun séjour.
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
