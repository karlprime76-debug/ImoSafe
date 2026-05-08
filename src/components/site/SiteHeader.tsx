"use client";

import Link from "next/link";

import { clearMockSession } from "@/lib/mockSession";
import { useMockSession } from "@/lib/useMockSession";

export function SiteHeader() {
  const session = useMockSession();

  return (
    <header className="border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/30">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B2A4A] text-sm font-extrabold text-white">
            IS
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
          <Link href="/agencies" className="hover:text-slate-900 dark:hover:text-white">
            Agences
          </Link>
          <Link href="/pricing" className="hover:text-slate-900 dark:hover:text-white">
            Premium
          </Link>
          <Link href="/report-scam" className="hover:text-slate-900 dark:hover:text-white">
            Signaler
          </Link>
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
                onClick={() => {
                  clearMockSession();
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
