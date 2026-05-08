import Link from "next/link";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function PrivacyPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Politique de confidentialité</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-white/70">
          Version MVP (mock). Cette politique sera consolidée avant lancement officiel.
        </p>

        <div className="mt-6 grid gap-4 text-sm text-slate-700 dark:text-white/70">
          <Section title="Données collectées">
            Selon les pages et formulaires, ImoSafe peut collecter: nom, email, téléphone WhatsApp, informations d’annonces,
            signalements, demandes de vérification, demandes de réservation.
          </Section>

          <Section title="Données liées aux fonctionnalités">
            Les annonces, signalements, demandes de vérification et réservations peuvent contenir des informations saisies
            par l’utilisateur (ex: message, référence, contexte).
          </Section>

          <Section title="Stockage en MVP mock">
            En MVP, certaines données sont stockées localement dans le navigateur (localStorage), pour simuler l’expérience
            produit sans base de données.
          </Section>

          <Section title="Évolution vers une base de données">
            Plus tard, ImoSafe utilisera une base de données sécurisée, avec contrôle d’accès, journalisation, et politiques de
            conservation.
          </Section>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="text-base font-extrabold tracking-tight">Liens utiles</div>
            <div className="mt-4 grid gap-2">
              <Link href="/terms" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
                Conditions d’utilisation
              </Link>
              <Link href="/safety-rules" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
                Règles de sécurité
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
