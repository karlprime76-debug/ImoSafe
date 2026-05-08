import Link from "next/link";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";

const RULES = [
  "Ne payez jamais avant visite ou vérification",
  "Vérifiez l’identité du propriétaire, de l’agence ou de l’hôte",
  "Demandez les documents (titre, bail, convention, quittance, etc.)",
  "Méfiez-vous des prix trop bas et des urgences artificielles",
  "Signalez tout comportement suspect",
  "Utilisez les demandes de vérification ImoSafe",
];

export default function SafetyRulesPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Règles de sécurité</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-white/70">
          Les règles simples qui réduisent le risque d’arnaque avant une visite, une réservation ou un paiement.
        </p>

        <div className="mt-6 grid gap-4">
          <div className="rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-extrabold">Rappel</div>
              <StatusBadge tone="warning">Anti-arnaque</StatusBadge>
            </div>
            <div className="mt-2">Ne payez jamais avant d’avoir visité et vérifié.</div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="text-base font-extrabold tracking-tight">À appliquer systématiquement</div>
            <div className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-white/70">
              {RULES.map((r) => (
                <div key={r} className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-black/20">
                  {r}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="text-base font-extrabold tracking-tight">Actions rapides</div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <ActionLink href="/request-verification" label="Demander une vérification" tone="primary" />
              <ActionLink href="/report-scam" label="Signaler une arnaque" tone="danger" />
              <ActionLink href="/guide-anti-arnaque" label="Voir le guide" tone="neutral" />
              <ActionLink href="/stays" label="Voir les séjours" tone="neutral" />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
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
