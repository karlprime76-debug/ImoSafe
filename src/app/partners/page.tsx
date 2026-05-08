import Link from "next/link";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IMOSAFE_CONTACT } from "@/lib/imosafeContact";

export default function PartnersPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">Devenir partenaire ImoSafe</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-white/70 sm:text-base">
            Rejoignez un réseau orienté confiance: badges vérifiés, demandes traçables et rappels anti-arnaque.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge tone="info">Mock MVP</StatusBadge>
            <StatusBadge tone="success">Vérification</StatusBadge>
            <StatusBadge tone="warning">Anti-arnaque</StatusBadge>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <SectionCard
            title="Devenir agence vérifiée"
            desc="Badge agence + visibilité + rassurer les clients."
            points={["Profil agence (bientôt)", "Preuves et documents (selon cas)", "Traitement manuel au lancement"]}
          />
          <SectionCard
            title="Devenir hôte vérifié"
            desc="Pour la courte durée: hôte + photos + process clair."
            points={["Vérification identité (selon cas)", "Validation photos (selon cas)", "Rappels anti-arnaque intégrés"]}
          />
          <SectionCard
            title="Publier des annonces"
            desc="Publier des biens (MVP mock) et recevoir des demandes."
            points={["Ajout d’annonces (mock)", "Demandes de visite (mock)", "Statistiques (bientôt)"]}
          />
          <SectionCard
            title="Publier des séjours"
            desc="Publier des logements courte durée et recevoir des demandes de réservation."
            points={["Séjours (démo)", "Demandes de réservation (mock)", "Badges / TrustScore (démo)"]}
          />
        </div>

        <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-extrabold">Demander une vérification ImoSafe</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-white/70">
                Envoyez une annonce, un séjour, une agence ou un hôte à vérifier.
              </div>
            </div>
            <StatusBadge tone="neutral">Support</StatusBadge>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <a
              href={IMOSAFE_CONTACT.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              Contacter sur WhatsApp
            </a>
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              Créer un compte pro
            </Link>
            <Link
              href="/request-verification"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Demander une vérification
            </Link>
          </div>

          <div className="mt-4 text-xs text-slate-500 dark:text-white/50">Email: {IMOSAFE_CONTACT.email}</div>
        </div>

        <div className="mt-10 rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
          <div className="font-extrabold">Rappel sécurité</div>
          <div className="mt-2">Ne payez jamais avant visite ou vérification. Évitez les paiements hors canal vérifié.</div>
          <div className="mt-3">
            <Link href="/safety-rules" className="text-sm font-semibold text-amber-900 hover:underline dark:text-amber-100">
              Voir les règles de sécurité
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function SectionCard({
  title,
  desc,
  points,
}: {
  title: string;
  desc: string;
  points: string[];
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="text-base font-extrabold tracking-tight">{title}</div>
      <div className="mt-2 text-sm text-slate-600 dark:text-white/70">{desc}</div>
      <div className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-white/70">
        {points.map((p) => (
          <div key={p} className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-black/20">
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}
