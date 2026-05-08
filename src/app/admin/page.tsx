"use client";

import Link from "next/link";
import { useMemo } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DEMO_AGENCIES, DEMO_PROPERTIES } from "@/lib/demoData";
import { getScamReports } from "@/lib/mockDataStore";

export default function AdminHomePage() {
  const reports = useMemo(() => getScamReports(), []);
  const pendingProps = DEMO_PROPERTIES.filter((p) => p.verificationStatus === "PENDING").length;
  const suspiciousProps = DEMO_PROPERTIES.filter((p) => p.verificationStatus === "SUSPICIOUS").length;
  const agenciesPending = DEMO_AGENCIES.filter((a) => a.verificationStatus === "PENDING").length;

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Admin (MVP mock)</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
          MVP: pas de DB, pas de vraie auth. Actions = mock.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat title="Annonces en vérification" value={pendingProps} />
          <Stat title="Annonces suspectes" value={suspiciousProps} />
          <Stat title="Agences à vérifier" value={agenciesPending} />
          <Stat title="Signalements" value={reports.length} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminLink href="/admin/properties" title="Vérifier annonces" />
          <AdminLink href="/admin/agencies" title="Vérifier agences" />
          <AdminLink href="/admin/reports" title="Traiter signalements" />
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
