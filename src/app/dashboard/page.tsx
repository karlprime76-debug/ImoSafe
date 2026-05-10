"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { PropertyCard } from "@/components/properties/PropertyCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DEMO_PROPERTIES } from "@/lib/demoData";
import type { MockRole } from "@/lib/mockSession";
import { useAuthMe } from "@/lib/useAuthMe";
import {
  getBookings,
  getDraftProperties,
  getFavorites,
  getRecent,
  getScamReports,
  getVerificationRequests,
  getVisitRequests,
} from "@/lib/mockDataStore";

export default function DashboardPage() {
  const { user: session } = useAuthMe();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [visitsCount, setVisitsCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [verificationRequestsCount, setVerificationRequestsCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [draftsCount, setDraftsCount] = useState(0);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    const read = () => {
      setFavoritesCount(getFavorites().propertyIds.length);
      setVisitsCount(getVisitRequests().length);
      setBookingsCount(getBookings().length);
      setVerificationRequestsCount(getVerificationRequests().length);
      setReportsCount(getScamReports().length);
      setDraftsCount(getDraftProperties().length);
      setRecentIds(getRecent().propertyIds);
    };

    read();
    window.addEventListener("imosafe:favorites", read);
    window.addEventListener("imosafe:visitRequests", read);
    window.addEventListener("imosafe:bookings", read);
    window.addEventListener("imosafe:verificationRequests", read);
    window.addEventListener("imosafe:scamReports", read);
    window.addEventListener("imosafe:draftProperties", read);
    window.addEventListener("imosafe:recent", read);
    return () => {
      window.removeEventListener("imosafe:favorites", read);
      window.removeEventListener("imosafe:visitRequests", read);
      window.removeEventListener("imosafe:bookings", read);
      window.removeEventListener("imosafe:verificationRequests", read);
      window.removeEventListener("imosafe:scamReports", read);
      window.removeEventListener("imosafe:draftProperties", read);
      window.removeEventListener("imosafe:recent", read);
    };
  }, []);

  const roleLabel = (role: MockRole | undefined) => {
    if (!role) return "Invité";
    if (role === "USER") return "Utilisateur";
    if (role === "OWNER") return "Propriétaire";
    if (role === "AGENCY") return "Agence";
    if (role === "HOST") return "Hôte séjour";
    if (role === "ADMIN") return "Admin";
    return role;
  };

  const recents = useMemo(() => DEMO_PROPERTIES.filter((p) => recentIds.includes(p.id)), [recentIds]);
  const alerts = useMemo(() => DEMO_PROPERTIES.filter((p) => p.verificationStatus === "VERIFIED").slice(0, 3), []);

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
              {session ? (
                <>
                  Connecté: <span className="font-semibold">{session.name}</span> • {roleLabel(session.role)}
                  <span className="mx-2">•</span>
                  <span className="font-semibold">{session.email}</span>
                  {session.phone ? (
                    <>
                      <span className="mx-2">•</span>
                      <span className="font-semibold">{session.phone}</span>
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  Tu es en mode invité. <Link className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300" href="/login">Connexion</Link>
                </>
              )}
            </p>
          </div>

          {session ? (
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              onClick={async () => {
                try {
                  await fetch("/api/auth/logout", { method: "POST" });
                } catch {
                  // ignore
                }
                window.location.href = "/";
              }}
            >
              Se déconnecter
            </button>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
          <StatCard title="Favoris" value={favoritesCount} href="/dashboard/favorites" />
          <StatCard title="Demandes de visite" value={visitsCount} href="/dashboard/visits" />
          <StatCard title="Réservations" value={bookingsCount} href="/dashboard/bookings" />
          <StatCard title="Vérifications" value={verificationRequestsCount} href="/dashboard/verification-requests" />
          <StatCard title="Signalements" value={reportsCount} href="/dashboard/reports" />
          <StatCard title="Récents" value={recentIds.length} href="/properties" />
          <StatCard title="Annonces (brouillons)" value={draftsCount} href="/dashboard/properties" />
        </div>

        {session?.role === "OWNER" || session?.role === "AGENCY" ? (
          <div className="mt-8 rounded-3xl border border-emerald-600/20 bg-emerald-500/10 p-6 ring-1 ring-emerald-600/20 dark:border-emerald-400/20 dark:ring-emerald-400/20">
            <div className="text-sm font-extrabold text-emerald-950 dark:text-emerald-100">Espace annonceur</div>
            <div className="mt-1 text-sm text-emerald-950/80 dark:text-emerald-100/80">
              Publie tes biens, consulte les demandes de visite et gère les signalements liés à tes annonces (mock).
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/dashboard/properties"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Mes annonces
              </Link>
              <Link
                href="/dashboard/properties/new"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Ajouter un bien
              </Link>
            </div>
          </div>
        ) : null}

        {session?.role === "HOST" ? (
          <div className="mt-8 rounded-3xl border border-emerald-600/20 bg-emerald-500/10 p-6 ring-1 ring-emerald-600/20 dark:border-emerald-400/20 dark:ring-emerald-400/20">
            <div className="text-sm font-extrabold text-emerald-950 dark:text-emerald-100">Espace hôte</div>
            <div className="mt-1 text-sm text-emerald-950/80 dark:text-emerald-100/80">
              Publie tes séjours, gère les demandes de réservation et mets à jour tes annonces.
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/dashboard/stays"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Mes séjours
              </Link>
              <Link
                href="/dashboard/stays/new"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Ajouter un séjour
              </Link>
            </div>
          </div>
        ) : null}

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Alertes — biens vérifiés</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-white/70">MVP: suggestions (pas de push temps réel).</p>
            </div>
            <Link href="/properties" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
              Voir tous les biens
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {alerts.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">Biens récemment consultés</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-white/70">MVP: stockés localement.</p>
          </div>
          {recents.length ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recents.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
              Aucun bien consulté récemment.
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function StatCard({ title, value, href }: { title: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5"
    >
      <div className="text-xs font-semibold text-slate-600 dark:text-white/60">{title}</div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{value}</div>
      <div className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">Ouvrir</div>
    </Link>
  );
}
