"use client";

import Image from "next/image";
import Link from "next/link";

import { useAuthMe } from "@/lib/useAuthMe";

export function SiteHeader() {
  const { user: session } = useAuthMe();

  return (
    <header className="border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/30">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/10 dark:bg-white/5 dark:ring-white/10">
            <Image src="/images/imosafe-logo.png" alt="ImoSafe" fill className="object-contain p-1" priority />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">ImoSafe</div>
            <div className="text-[11px] font-semibold text-slate-600 dark:text-white/60">Immobilier sécurisé</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-700 dark:text-white/70 sm:flex">
          <Link href="/properties" className="hover:text-slate-900 dark:hover:text-white">
            Biens
          </Link>
          <Link href="/stays" className="hover:text-slate-900 dark:hover:text-white">
            Séjours
          </Link>
          <Link href="/verification" className="hover:text-slate-900 dark:hover:text-white">
            Vérification
          </Link>
          <Link href="/guide-anti-arnaque" className="hover:text-slate-900 dark:hover:text-white">
            Guide
          </Link>
          <Link href="/report-scam" className="hover:text-slate-900 dark:hover:text-white">
            Signaler
          </Link>
          {session?.role === "ADMIN" ? (
            <Link href="/admin" className="hover:text-slate-900 dark:hover:text-white">
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                Dashboard
              </Link>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                onClick={async () => {
                  try {
                    await fetch("/api/auth/logout", { method: "POST" });
                  } catch {
                    // ignore
                  }
                  window.location.href = "/";
                }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
