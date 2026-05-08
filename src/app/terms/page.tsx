import Link from "next/link";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function TermsPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Conditions d’utilisation</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-white/70">
          Version MVP (mock). Ces conditions seront détaillées et validées juridiquement avant lancement officiel.
        </p>

        <div className="mt-6 grid gap-4 text-sm text-slate-700 dark:text-white/70">
          <Section title="1. Objet">
            ImoSafe est une plateforme de mise en relation (annonces, séjours) et d’aide à la vérification (process, badges,
            signalements). L’objectif est de réduire les risques d’arnaque et d’améliorer la transparence.
          </Section>

          <Section title="2. Rôle et limites">
            ImoSafe réduit les risques mais ne remplace pas un notaire, une étude juridique, ou une vérification
            administrative complète. L’utilisateur reste responsable de ses décisions, de ses visites et de ses paiements.
          </Section>

          <Section title="3. Paiements et sécurité">
            Évitez tout paiement hors canal vérifié. Ne payez jamais avant visite ou vérification. En cas de doute, utilisez
            les fonctionnalités de signalement et de demande de vérification.
          </Section>

          <Section title="4. Contenu et signalements">
            Les annonces et informations affichées peuvent provenir de tiers. Les signalements et demandes de vérification
            servent à améliorer la fiabilité, sans garantie absolue.
          </Section>

          <Section title="5. MVP mock / stockage local">
            En MVP, certaines actions sont stockées localement dans votre navigateur (localStorage). Aucun traitement
            serveur complet n’est garanti à ce stade.
          </Section>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="text-base font-extrabold tracking-tight">Liens utiles</div>
            <div className="mt-4 grid gap-2">
              <Link href="/safety-rules" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
                Règles de sécurité
              </Link>
              <Link href="/privacy" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
                Politique de confidentialité
              </Link>
              <Link href="/report-scam" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
                Signaler une arnaque
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="text-base font-extrabold tracking-tight">{title}</div>
      <div className="mt-3 leading-relaxed">{children}</div>
    </div>
  );
}
