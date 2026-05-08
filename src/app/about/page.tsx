import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function AboutPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">À propos</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-white/70">
          ImoSafe est une plateforme immobilière orientée confiance: annonces vérifiées, agences/propriétaires fiables, et signalement d’arnaques.
        </p>
        <div className="mt-6 grid gap-4 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
          <div>
            <div className="font-semibold">Notre mission</div>
            <div className="mt-1">Réduire les arnaques et rendre la recherche immobilière plus transparente.</div>
          </div>
          <div>
            <div className="font-semibold">Notre promesse</div>
            <div className="mt-1">Badges de vérification + conseils sécurité + traçabilité des demandes.</div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
