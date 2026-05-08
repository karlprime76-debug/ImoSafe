import Link from "next/link";
import Image from "next/image";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function PricingPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/10 dark:bg-white/5 dark:ring-white/10">
              <Image src="/images/imosafe-logo.png" alt="ImoSafe" fill className="object-contain p-1" priority />
            </div>
            <div className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">ImoSafe</div>
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-4xl">Offres ImoSafe</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-white/70 sm:text-base">
            MVP mock: badges, séjours, vérification et demandes traçables. Les tarifs définitifs arrivent bientôt.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge tone="success">Badges de confiance</StatusBadge>
            <StatusBadge tone="info">Vérification transparente</StatusBadge>
            <StatusBadge tone="warning">Anti-arnaque</StatusBadge>
            <StatusBadge tone="neutral">Mock MVP</StatusBadge>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-emerald-600/20 bg-emerald-500/10 p-6 text-sm text-emerald-950 ring-1 ring-emerald-600/20 dark:border-emerald-400/20 dark:text-emerald-100 dark:ring-emerald-400/20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="font-extrabold">Promesse ImoSafe</div>
            <StatusBadge tone="success">Anti-arnaque</StatusBadge>
          </div>
          <div className="mt-2 text-sm text-emerald-950/80 dark:text-emerald-100/80">
            Des badges clairs + un process de vérification. Et surtout: des rappels avant paiement.
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-extrabold">Gratuit</div>
            <div className="mt-2 text-sm text-slate-600 dark:text-white/70">Pour découvrir ImoSafe.</div>
            <div className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-white/70">
              <div>Consulter les annonces</div>
              <div>Consulter les séjours</div>
              <div>Sauvegarder des favoris</div>
              <div>Signaler des annonces</div>
              <div>Demandes de visite limitées</div>
              <div>Demandes (réservation/vérification) limitées (mock)</div>
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
              <div>Alertes biens vérifiés (bientôt)</div>
              <div>Accès prioritaire aux annonces vérifiées (bientôt)</div>
              <div>Assistance avant paiement (sur demande)</div>
              <div>Rapport de vérification (sur demande)</div>
              <div>Demandes de réservation suivies (mock)</div>
              <div>Historique de recherches (bientôt)</div>
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-extrabold">Hôte / Agence Pro</div>
              <StatusBadge tone="warning">Bientôt</StatusBadge>
            </div>
            <div className="mt-2 text-sm text-slate-600 dark:text-white/70">Pour pros de l’immobilier et courte durée.</div>
            <div className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-white/70">
              <div>Publier biens et séjours (mock)</div>
              <div>Badge hôte/agence vérifié (bientôt)</div>
              <div>Meilleure visibilité (bientôt)</div>
              <div>Demandes de réservation (mock)</div>
              <div>Statistiques (bientôt)</div>
              <div>Accès vérification ImoSafe (sur demande)</div>
              <div>Profil professionnel (bientôt)</div>
            </div>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                Contacter ImoSafe
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-extrabold">Services à la demande</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-white/70">
                Pour les cas sensibles. MVP: demande via formulaire, traitement à brancher.
              </div>
            </div>
            <StatusBadge tone="info">Sur demande</StatusBadge>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ServiceCard title="Vérification annonce" desc="Cohérence annonce + contacts + statut." />
            <ServiceCard title="Vérification documents" desc="Lecture/cohérence des pièces disponibles." />
            <ServiceCard title="Accompagnement visite" desc="Checklist + points de contrôle sur place." />
            <ServiceCard title="Vérification logement courte durée" desc="Disponibilité, photos, hôte (selon cas)." />
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/request-verification"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              Demander une vérification
            </Link>
            <Link
              href="/verification"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Voir le process
            </Link>
            <Link
              href="/stays"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Découvrir Séjours
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-extrabold">Ce que tu obtiens</div>
            <div className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-white/70">
              <div className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-black/20">Badges de confiance visibles sur les annonces</div>
              <div className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-black/20">Rappels anti-arnaque avant paiement</div>
              <div className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-black/20">Signalement simple et traçable (MVP: local)</div>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-extrabold">Quand choisir Premium ?</div>
            <div className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-white/70">
              <div className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-black/20">Si tu veux être alerté dès qu’un bien vérifié sort</div>
              <div className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-black/20">Si tu veux une assistance avant paiement</div>
              <div className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-black/20">Si tu fais plusieurs visites / recherches</div>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-extrabold">Pour agences</div>
            <div className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-white/70">
              <div className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-black/20">Badge agence vérifiée pour rassurer</div>
              <div className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-black/20">Centralisation des demandes de visite</div>
              <div className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-black/20">Meilleure visibilité (à venir)</div>
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

function ServiceCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-slate-50 p-4 text-xs dark:border-white/10 dark:bg-black/20">
      <div className="font-extrabold text-slate-900 dark:text-white">{title}</div>
      <div className="mt-1 text-slate-600 dark:text-white/70">{desc}</div>
      <div className="mt-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">Tarif à définir</div>
    </div>
  );
}
