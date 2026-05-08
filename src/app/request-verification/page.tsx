"use client";

import Link from "next/link";
import { useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { addVerificationRequest } from "@/lib/mockDataStore";

const KINDS = [
  { value: "VERIFY_LISTING", label: "Vérifier une annonce" },
  { value: "VERIFY_OWNER", label: "Vérifier un propriétaire" },
  { value: "VERIFY_AGENCY", label: "Vérifier une agence" },
  { value: "VERIFY_STAY", label: "Vérifier un logement courte durée" },
  { value: "VERIFY_DOCUMENTS", label: "Vérifier des documents" },
];

export default function RequestVerificationPage() {
  const [kind, setKind] = useState(KINDS[0]?.value ?? "VERIFY_LISTING");
  const [fullName, setFullName] = useState("");
  const [whatsAppPhone, setWhatsAppPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [listingRefOrUrl, setListingRefOrUrl] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Demander une vérification ImoSafe</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-white/70">
          Envoyez les informations d’un bien, d’un propriétaire, d’une agence ou d’un logement courte durée à vérifier.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-base font-extrabold tracking-tight">Formulaire</div>
              <StatusBadge tone="info">Mock</StatusBadge>
            </div>

            {done ? (
              <div className="mt-5 rounded-2xl border border-emerald-600/20 bg-emerald-500/10 p-5 text-sm text-emerald-950 ring-1 ring-emerald-600/20 dark:border-emerald-400/20 dark:text-emerald-100 dark:ring-emerald-400/20">
                <div className="font-extrabold">Demande envoyée</div>
                <div className="mt-2 text-sm text-emerald-950/80 dark:text-emerald-100/80">
                  Demande de vérification envoyée localement — branchement DB bientôt.
                </div>
                <div className="mt-4">
                  <Link href="/dashboard" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
                    Aller au dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <form
                className="mt-5 grid gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  addVerificationRequest({
                    kind,
                    fullName,
                    whatsAppPhone,
                    email: email || undefined,
                    city: city || undefined,
                    neighborhood: neighborhood || undefined,
                    listingRefOrUrl: listingRefOrUrl || undefined,
                    message: message || undefined,
                  });
                  setDone(true);
                }}
              >
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Type de vérification</label>
                  <select
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={kind}
                    onChange={(e) => setKind(e.target.value)}
                    required
                  >
                    {KINDS.map((k) => (
                      <option key={k.value} value={k.value}>
                        {k.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Nom</label>
                    <input
                      className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Téléphone WhatsApp</label>
                    <input
                      className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                      value={whatsAppPhone}
                      onChange={(e) => setWhatsAppPhone(e.target.value)}
                      placeholder="Ex: +229 ..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Email (optionnel)</label>
                  <input
                    type="email"
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemple.com"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Ville</label>
                    <input
                      className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex: Cotonou"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Quartier</label>
                    <input
                      className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Ex: Fidjrossè"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Lien ou référence annonce</label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={listingRefOrUrl}
                    onChange={(e) => setListingRefOrUrl(e.target.value)}
                    placeholder="URL ou ID (ex: apt-haie-vive-2ch / stay-fidjrosse...)"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Message</label>
                  <textarea
                    className="mt-1 min-h-[110px] w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Contexte, documents disponibles, urgence, etc."
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                >
                  Envoyer la demande
                </button>

                <div className="text-xs text-slate-500 dark:text-white/50">
                  MVP: demande stockée localement (pas de DB). On branchera le suivi admin ensuite.
                </div>
              </form>
            )}
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-base font-extrabold tracking-tight">Services de vérification</div>
                <StatusBadge tone="warning">Bientôt</StatusBadge>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-white/70">
                <ServiceCard title="Vérification simple" desc="Contrôles de cohérence + statut." />
                <ServiceCard title="Vérification documents" desc="Lecture et cohérence des pièces disponibles." />
                <ServiceCard title="Vérification terrain" desc="Confirmation sur place si possible." />
                <ServiceCard title="Assistance visite" desc="Conseils/checklist avant et pendant visite." />
                <ServiceCard title="Vérification logement courte durée" desc="Disponibilité, photos, hôte (selon cas)." />
              </div>
              <div className="mt-4 text-xs text-slate-500 dark:text-white/50">Tarif à définir • Bientôt.</div>
            </div>

            <div className="rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
              <div className="font-extrabold">Rappel</div>
              <div className="mt-2">Ne payez jamais avant visite ou vérification. Si un vendeur met la pression: prudence.</div>
            </div>
          </div>
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
