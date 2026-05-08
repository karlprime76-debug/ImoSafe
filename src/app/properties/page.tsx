import { PropertiesBrowser } from "@/components/properties/PropertiesBrowser";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DEMO_PROPERTIES } from "@/lib/demoData";
import Link from "next/link";

export default function PropertiesPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Biens immobiliers</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
              Filtre par ville, quartier, type, location/vente, prix, et biens vérifiés.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Link
            href="/request-verification"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Demander une vérification
          </Link>
          <Link
            href="/guide-anti-arnaque"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            Guide anti-arnaque
          </Link>
        </div>

        <PropertiesBrowser properties={DEMO_PROPERTIES} />

        <div className="mt-10 rounded-2xl border border-black/10 bg-white p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
          <div className="font-semibold">Rappel anti-arnaque</div>
          <div className="mt-1">
            Ne payez jamais avant visite ou vérification. Signalez toute demande d’argent suspecte.
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
