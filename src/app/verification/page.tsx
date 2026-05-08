import Link from "next/link";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function VerificationPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Comment ImoSafe vérifie les annonces</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-white/70">
          Comprenez les étapes qui permettent de réduire les risques avant une visite, une réservation ou un paiement.
        </p>

        <div className="mt-6 grid gap-4">
          <SectionCard
            n="01"
            title="Vérification de l’annonce"
            points={["Cohérence des photos", "Prix réaliste", "Localisation", "Disponibilité"]}
          />
          <SectionCard
            n="02"
            title="Vérification du propriétaire / agence / hôte"
            points={["Identité", "Contact", "Historique", "Signalements éventuels"]}
          />
          <SectionCard
            n="03"
            title="Vérification des documents si disponibles"
            points={[
              "Titre foncier",
              "Convention",
              "Bail",
              "Quittance",
              "Autorisation de location",
              "Preuve de disponibilité",
            ]}
          />
          <SectionCard
            n="04"
            title="Vérification terrain ou visite"
            points={["Confirmation sur place", "Photos récentes", "Disponibilité réelle", "État du bien"]}
          />

          <div className="rounded-3xl border border-emerald-600/20 bg-emerald-500/10 p-6 text-sm text-emerald-950 ring-1 ring-emerald-600/20 dark:border-emerald-400/20 dark:text-emerald-100 dark:ring-emerald-400/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-base font-extrabold tracking-tight">Ce que signifie “Vérifié ImoSafe”</div>
              <StatusBadge tone="success">Vérifié</StatusBadge>
            </div>
            <div className="mt-3 grid gap-2 text-sm text-emerald-950/80 dark:text-emerald-100/80">
              <div>Annonce mieux contrôlée</div>
              <div>Risques réduits</div>
              <div>Informations plus fiables</div>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
            <div className="text-base font-extrabold tracking-tight">Ce que ImoSafe ne garantit pas encore</div>
            <div className="mt-3 grid gap-2 text-sm text-amber-950/85 dark:text-amber-100/85">
              <div>Ne remplace pas un notaire</div>
              <div>Ne remplace pas une vérification administrative complète</div>
              <div>Ne garantit pas un paiement fait hors canal sécurisé</div>
              <div>L’utilisateur doit rester prudent</div>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="text-base font-extrabold tracking-tight">Actions rapides</div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <ActionLink href="/request-verification" label="Demander une vérification" tone="primary" />
              <ActionLink href="/report-scam" label="Signaler une annonce suspecte" tone="danger" />
              <ActionLink href="/properties" label="Voir les annonces" tone="neutral" />
              <ActionLink href="/stays" label="Voir les séjours" tone="neutral" />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function SectionCard({ n, title, points }: { n: string; title: string; points: string[] }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-slate-900 px-2 py-1 text-xs font-extrabold text-white dark:bg-white dark:text-slate-900">
          {n}
        </div>
        <div className="min-w-0">
          <div className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">{title}</div>
          <div className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-white/70">
            {points.map((p) => (
              <div key={p} className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-black/20">
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionLink({
  href,
  label,
  tone,
}: {
  href: string;
  label: string;
  tone: "primary" | "danger" | "neutral";
}) {
  const klass =
    tone === "primary"
      ? "bg-emerald-600 text-white"
      : tone === "danger"
        ? "bg-rose-600 text-white"
        : "border border-black/10 bg-white text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white";

  return (
    <Link
      href={href}
      className={`inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold shadow-sm transition hover:opacity-95 ${klass}`}
    >
      {label}
    </Link>
  );
}
