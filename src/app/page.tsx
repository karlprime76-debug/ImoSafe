import Link from "next/link";
import Image from "next/image";

import { PropertyCard } from "@/components/properties/PropertyCard";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DEMO_PROPERTIES } from "@/lib/demoData";

export default function Home() {
  const featured = DEMO_PROPERTIES.filter((p) => p.verificationStatus === "VERIFIED").slice(0, 3);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <section className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="absolute inset-0">
            <Image src="/images/hero-property.png" alt="Bien immobilier" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/25" />
          </div>

          <div className="relative grid gap-6 p-6 sm:p-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-50 ring-1 ring-emerald-200/20">
                Immobilier sécurisé • Annonces vérifiées
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Trouvez un bien immobilier en toute sécurité.
              </h1>
              <p className="mt-3 text-base text-white/80 sm:text-lg">
                Badges de confiance, conseils anti-arnaque et transparence sur la vérification.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/properties"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                Voir les biens
              </Link>
              <Link
                href="/stays"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-white/15"
              >
                Voir les séjours
              </Link>
              <Link
                href="/report-scam"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-rose-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Signaler une arnaque
              </Link>
              <Link
                href="/request-verification"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Demander une vérification
              </Link>
              <Link
                href="/dashboard/properties/new"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#0B2A4A] px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Publier un bien
              </Link>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/verification"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-4 text-sm font-semibold text-white/90 shadow-sm transition hover:bg-white/10"
              >
                Comment on vérifie
              </Link>
              <Link
                href="/guide-anti-arnaque"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-4 text-sm font-semibold text-white/90 shadow-sm transition hover:bg-white/10"
              >
                Guide anti-arnaque
              </Link>
            </div>

            <div className="grid gap-3 rounded-2xl bg-white/10 p-4 text-sm text-white/80 ring-1 ring-white/15 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2">
                  <StatusBadge tone="success">Annonce vérifiée</StatusBadge>
                  <div className="font-semibold">Dossier contrôlé</div>
                </div>
                <div className="mt-1 text-xs">Identité/coordonnées, cohérence annonce, photos, pièces (selon cas).</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2">
                  <StatusBadge tone="info">En cours</StatusBadge>
                  <div className="font-semibold">Vérification en cours</div>
                </div>
                <div className="mt-1 text-xs">Transparence: le statut indique exactement où en est l’annonce.</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2">
                  <StatusBadge tone="warning">Signalement</StatusBadge>
                  <div className="font-semibold">Anti-arnaque</div>
                </div>
                <div className="mt-1 text-xs">Signalements + conseils: ne payez jamais avant visite et vérifications.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h2 className="text-xl font-extrabold tracking-tight">Pourquoi faire confiance à ImoSafe ?</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
              Nous sommes obsédés par la réduction des arnaques: transparence, badges, et rappels avant paiement.
            </p>
            <div className="mt-4 grid gap-3 text-sm text-slate-700 dark:text-white/70">
              <div className="rounded-2xl border border-black/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20">
                <div className="font-semibold">Badges clairs</div>
                <div className="mt-1 text-xs">Annonce vérifiée, en cours, suspecte — lisible en 1 seconde.</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20">
                <div className="font-semibold">Traçabilité & historique</div>
                <div className="mt-1 text-xs">Signaux de confiance (agence, infos, cohérence). MVP: démo.</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20">
                <div className="font-semibold">Signalement rapide</div>
                <div className="mt-1 text-xs">Un bouton pour remonter une arnaque (même sans compte).</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 shadow-sm ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:ring-amber-400/20">
            <h2 className="text-xl font-extrabold tracking-tight text-amber-950 dark:text-amber-100">Message anti-arnaque</h2>
            <p className="mt-2 text-sm text-amber-950/80 dark:text-amber-100/80">
              Règle d’or: <span className="font-semibold">zéro avance</span> avant visite + vérification. Une demande d’argent urgente = alerte.
            </p>
            <div className="mt-4 grid gap-2 text-sm text-amber-950/90 dark:text-amber-100/90">
              <div>1) Visite physique + voisinage + accès</div>
              <div>2) Vérifier identité + documents (cohérence, signatures, dates)</div>
              <div>3) Éviter transferts “rapides” (mobile money) avant validation</div>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/report-scam"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Signaler une arnaque
              </Link>
              <Link
                href="/properties"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-amber-900/20 bg-white/50 px-4 text-sm font-semibold text-amber-950 shadow-sm transition hover:bg-white/70 dark:border-amber-200/20 dark:bg-black/20 dark:text-amber-100 dark:hover:bg-black/30"
              >
                Voir les annonces
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Comment nous vérifions les annonces</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-white/70">Process simple, compréhensible, et transparent.</p>
            </div>
            <Link href="/pricing" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
              Voir Premium
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StepCard n="01" title="Collecte" desc="Infos annonce + identité + preuves (selon le cas)." />
            <StepCard n="02" title="Contrôles" desc="Cohérence des documents, contacts, localisation, photos." />
            <StepCard n="03" title="Statut" desc="Badge clair: vérifié / en cours / suspect / rejeté." />
            <StepCard n="04" title="Suivi" desc="Signalements & re-contrôles si de nouveaux éléments apparaissent." />
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="text-xl font-extrabold tracking-tight">Pour locataires, propriétaires et agences</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-white/70">Trois parcours, un seul objectif: réduire les risques.</p>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            <AudienceCard
              title="Locataires / Acheteurs"
              points={["Trouver des annonces plus fiables", "Alerte anti-escroquerie", "Favoris + demandes de visite"]}
              ctaHref="/properties"
              ctaLabel="Rechercher un bien"
            />
            <AudienceCard
              title="Propriétaires"
              points={["Publier avec statut de vérification", "Centraliser les demandes de visite", "Améliorer la confiance"]}
              ctaHref="/dashboard/properties/new"
              ctaLabel="Publier une annonce"
            />
            <AudienceCard
              title="Agences"
              points={["Badge agence vérifiée", "Plus de visibilité", "Dashboard pour gérer annonces/visites"]}
              ctaHref="/pricing"
              ctaLabel="Voir Agence Pro"
            />
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Biens vérifiés à la une</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-white/70">
                Sélection de biens avec badge “Vérifié ImoSafe”.
              </p>
            </div>
            <Link href="/properties" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
              Tout voir
            </Link>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            <div className="font-semibold">Conseil sécurité</div>
            <div className="mt-1">Ne payez jamais avant d’avoir visité et vérifié. En cas de pression ou d’urgence: signalez.</div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function StepCard({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20">
      <div className="text-xs font-extrabold text-slate-600 dark:text-white/60">{n}</div>
      <div className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">{title}</div>
      <div className="mt-1 text-xs text-slate-600 dark:text-white/70">{desc}</div>
    </div>
  );
}

function AudienceCard({
  title,
  points,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  points: string[];
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="text-sm font-extrabold tracking-tight">{title}</div>
      <div className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-white/70">
        {points.map((p) => (
          <div key={p} className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-black/20">
            {p}
          </div>
        ))}
      </div>
      <div className="mt-5">
        <Link href={ctaHref} className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white">
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
