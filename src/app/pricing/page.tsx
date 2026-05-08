import Link from "next/link";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function PricingPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">Gratuit vs Premium</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-white/70 sm:text-base">
            Choisis l’offre qui réduit tes risques: biens vérifiés, traçabilité et assistance avant paiement.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-extrabold">Gratuit</div>
            <div className="mt-2 text-sm text-slate-600 dark:text-white/70">Pour découvrir ImoSafe.</div>
            <div className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-white/70">
              <div>Consulter les annonces</div>
              <div>Sauvegarder des favoris</div>
              <div>Signaler des annonces</div>
              <div>Demandes de visite limitées</div>
            </div>
            <div className="mt-6">
              <Link
                href="/register"
                className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-600/20 bg-emerald-500/10 p-6 shadow-sm ring-1 ring-emerald-600/20 dark:border-emerald-400/20 dark:ring-emerald-400/20">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-extrabold">Premium utilisateur</div>
              <div className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">Recommandé</div>
            </div>
            <div className="mt-2 text-sm text-emerald-900 dark:text-emerald-100">Pour réduire les risques et gagner du temps.</div>
            <div className="mt-4 grid gap-2 text-sm text-emerald-950 dark:text-emerald-100">
              <div>Alertes nouveaux biens</div>
              <div>Accès prioritaire aux annonces vérifiées</div>
              <div>Rapport de vérification</div>
              <div>Assistance avant paiement</div>
              <div>Historique de recherches</div>
            </div>
            <div className="mt-6">
              <Link
                href="/register"
                className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white"
              >
                Passer Premium (bientôt)
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-extrabold">Agence Pro</div>
            <div className="mt-2 text-sm text-slate-600 dark:text-white/70">Pour agences et pros de l’immobilier.</div>
            <div className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-white/70">
              <div>Publier plus d’annonces</div>
              <div>Badge agence vérifiée</div>
              <div>Meilleure visibilité</div>
              <div>Dashboard demandes de visite</div>
              <div>Statistiques annonces</div>
            </div>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                Devenir agence Pro
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
          <div className="font-extrabold">Conseil sécurité</div>
          <div className="mt-1">Ne payez jamais avant d’avoir visité et vérifié. Signalez toute demande d’argent suspecte.</div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
