"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DEMO_AGENCIES, DEMO_PROPERTIES } from "@/lib/demoData";
import { getScamReports } from "@/lib/mockDataStore";
import { useMockSession } from "@/lib/useMockSession";

export default function AdminHomePage() {
  const session = useMockSession();
  const [userStats, setUserStats] = useState<{
    total: number;
    USER: number;
    OWNER: number;
    AGENCY: number;
    HOST: number;
    ADMIN: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reports = useMemo(() => getScamReports(), []);
  const pendingProps = DEMO_PROPERTIES.filter((p) => p.verificationStatus === "PENDING").length;
  const suspiciousProps = DEMO_PROPERTIES.filter((p) => p.verificationStatus === "SUSPICIOUS").length;
  const agenciesPending = DEMO_AGENCIES.filter((a) => a.verificationStatus === "PENDING").length;

  const canView = session?.role === "ADMIN";

  useEffect(() => {
    if (!canView) return;

    const run = async () => {
      try {
        setError(null);
        const res = await fetch("/api/admin/stats", {
          headers: { "x-imosafe-session-id": session.id },
        });

        const data = (await res.json()) as
          | {
              ok: true;
              stats: { total: number; USER: number; OWNER: number; AGENCY: number; HOST: number; ADMIN: number };
            }
          | { ok: false; error?: { code?: string; message?: string } };

        if (!res.ok || !data.ok) {
          const code = data.ok ? undefined : data.error?.code;
          if (code === "FORBIDDEN" || code === "UNAUTHORIZED") {
            setError("Accès réservé à l’équipe ImoSafe.");
          } else {
            setError((data.ok ? undefined : data.error?.message) || "Erreur serveur.");
          }
          setUserStats(null);
          return;
        }

        setUserStats(data.stats);
      } catch {
        setError("Erreur serveur.");
        setUserStats(null);
      }
    };

    run();
  }, [canView, session?.id]);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Admin (MVP mock)</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
          MVP: pas de DB, pas de vraie auth. Actions = mock.
        </p>

        {!canView ? (
          <div className="mt-6 rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
            <div className="font-extrabold">Accès réservé à l’équipe ImoSafe</div>
            <div className="mt-2">Connecte-toi avec un compte administrateur pour afficher les données sensibles.</div>
          </div>
        ) : (
          <>
            {error ? <div className="mt-6 text-sm font-semibold text-rose-700 dark:text-rose-300">{error}</div> : null}

            {userStats ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                <Stat title="Utilisateurs (total)" value={userStats.total} />
                <Stat title="Utilisateurs" value={userStats.USER} />
                <Stat title="Propriétaires" value={userStats.OWNER} />
                <Stat title="Agences" value={userStats.AGENCY} />
                <Stat title="Hôtes" value={userStats.HOST} />
                <Stat title="Admins" value={userStats.ADMIN} />
              </div>
            ) : null}

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <AdminLink href="/admin/users" title="Gérer utilisateurs" />
              <AdminLink href="/admin/properties" title="Vérifier annonces" />
              <AdminLink href="/admin/stays" title="Vérifier séjours" />
              <AdminLink href="/admin/agencies" title="Vérifier agences" />
              <AdminLink href="/admin/reports" title="Traiter signalements" />
              <AdminLink href="/admin/manual-payments" title="Paiements manuels" />
            </div>
          </>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat title="Annonces en vérification" value={pendingProps} />
          <Stat title="Annonces suspectes" value={suspiciousProps} />
          <Stat title="Agences à vérifier" value={agenciesPending} />
          <Stat title="Signalements" value={reports.length} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminLink href="/properties" title="Voir site public" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="text-xs font-semibold text-slate-600 dark:text-white/60">{title}</div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}

function AdminLink({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-black/10 bg-white p-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-white"
    >
      {title}
      <div className="mt-2 text-xs text-slate-600 dark:text-white/70">Ouvrir</div>
    </Link>
  );
}
