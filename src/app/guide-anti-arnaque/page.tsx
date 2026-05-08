import Link from "next/link";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function AntiScamGuidePage() {
  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Guide anti-arnaque immobilier</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-white/70">
          Les bons réflexes avant de visiter, payer, louer, acheter ou réserver un séjour.
        </p>

        <div className="mt-6 grid gap-4">
          <TipCard title="Ne payez jamais avant visite ou vérification" tone="danger" />
          <TipCard title="Méfiez-vous des prix trop bas" tone="warning" />
          <TipCard title="Vérifiez l’identité du propriétaire, de l’agence ou de l’hôte" tone="info" />
          <TipCard title="Demandez les documents du bien" tone="neutral" />
          <TipCard title="Évitez les pressions du type “payez vite”" tone="warning" />
          <TipCard title="Attention aux photos volées" tone="warning" />
          <TipCard title="Vérifiez que le bien ou le logement est réellement disponible" tone="info" />
          <TipCard title="Utilisez ImoSafe pour signaler une annonce douteuse" tone="danger" />

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-base font-extrabold tracking-tight">Checklist — avant de payer</div>
              <StatusBadge tone="info">Checklist</StatusBadge>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-white/70">
              {[
                "Ai-je visité ou vérifié le bien ?",
                "Ai-je vérifié l’identité ?",
                "Ai-je vu les documents ?",
                "Ai-je confirmé la disponibilité ?",
                "Ai-je évité un paiement non traçable ?",
                "Ai-je vérifié les signalements éventuels ?",
              ].map((p) => (
                <div key={p} className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-black/20">
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="text-base font-extrabold tracking-tight">Actions rapides</div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <ActionLink href="/report-scam" label="Signaler une arnaque" tone="danger" />
              <ActionLink href="/properties" label="Voir les biens vérifiés" tone="neutral" />
              <ActionLink href="/request-verification" label="Demander une vérification" tone="primary" />
              <ActionLink href="/stays" label="Voir les séjours" tone="neutral" />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function TipCard({
  title,
  tone,
}: {
  title: string;
  tone: "danger" | "warning" | "info" | "neutral";
}) {
  const badgeTone =
    tone === "danger" ? "danger" : tone === "warning" ? "warning" : tone === "info" ? "info" : "neutral";

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-base font-extrabold tracking-tight">{title}</div>
        <StatusBadge tone={badgeTone}>{badgeTone === "danger" ? "Alerte" : badgeTone === "warning" ? "Prudence" : badgeTone === "info" ? "Conseil" : "Rappel"}</StatusBadge>
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
