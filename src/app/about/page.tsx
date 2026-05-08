import Image from "next/image";

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

        <div className="mt-6 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-white/10">
            <Image src="/images/property-visit.png" alt="Visite immobilière" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
          </div>
          <div className="p-6">
            <div className="text-base font-extrabold tracking-tight">Une visite plus sûre, avec plus de transparence.</div>
            <div className="mt-2 text-sm text-slate-600 dark:text-white/70">
              Avant de payer, il faut pouvoir comprendre: qui publie, quels documents existent, et quel est le statut de vérification.
            </div>
          </div>
        </div>

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
