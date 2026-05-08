import { PropertiesBrowser } from "@/components/properties/PropertiesBrowser";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DEMO_PROPERTIES } from "@/lib/demoData";

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

        <PropertiesBrowser properties={DEMO_PROPERTIES} />

        <div className="mt-10 rounded-2xl border border-black/10 bg-white p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
          <div className="font-semibold">Rappel anti-arnaque</div>
          <div className="mt-1">
            Ne payez jamais avant d’avoir visité et vérifié. Signalez toute demande d’argent suspecte.
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
