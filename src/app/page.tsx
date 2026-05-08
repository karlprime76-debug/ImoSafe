import Link from "next/link";

import { PropertyCard } from "@/components/properties/PropertyCard";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { DEMO_PROPERTIES } from "@/lib/demoData";

export default function Home() {
  const featured = DEMO_PROPERTIES.filter((p) => p.verificationStatus === "VERIFIED").slice(0, 3);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <section className="grid gap-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:ring-emerald-400/20">
              Immobilier sécurisé • Annonces vérifiées
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Trouvez un bien immobilier en toute sécurité.
            </h1>
            <p className="mt-3 text-base text-slate-600 dark:text-white/70 sm:text-lg">
              ImoSafe vous aide à éviter les fausses annonces, les faux propriétaires et les mauvaises surprises.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/properties"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#0B2A4A] px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              Voir les biens
            </Link>
            <Link
              href="/dashboard/properties/new"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              Publier un bien
            </Link>
            <Link
              href="/report-scam"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Signaler une arnaque
            </Link>
          </div>

          <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-black/20 dark:text-white/70 sm:grid-cols-3">
            <div className="rounded-xl border border-black/5 bg-white p-3 dark:border-white/10 dark:bg-white/5">
              <div className="font-semibold">Annonces vérifiées</div>
              <div className="mt-1 text-xs">Badges + vérification manuelle.</div>
            </div>
            <div className="rounded-xl border border-black/5 bg-white p-3 dark:border-white/10 dark:bg-white/5">
              <div className="font-semibold">Agences fiables</div>
              <div className="mt-1 text-xs">Validation + historique de confiance.</div>
            </div>
            <div className="rounded-xl border border-black/5 bg-white p-3 dark:border-white/10 dark:bg-white/5">
              <div className="font-semibold">Signalement d’arnaques</div>
              <div className="mt-1 text-xs">Aide la communauté à rester safe.</div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Biens vérifiés à la une</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-white/70">
                Sélection de biens avec badge “Vérifié ImoSafe”.
              </p>
            </div>
            <Link href="/properties" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
              Tout voir
            </Link>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            <div className="font-semibold">Conseil sécurité</div>
            <div className="mt-1">
              Ne payez jamais avant d’avoir visité et vérifié. ImoSafe ne garantit pas automatiquement un bien non vérifié.
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
