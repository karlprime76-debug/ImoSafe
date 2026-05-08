"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IMOSAFE_CONTACT } from "@/lib/imosafeContact";
import { addManualPaymentRequest } from "@/lib/mockDataStore";

const OFFERS = [
  { value: "AGENCE_PRO", label: "Agence Pro" },
  { value: "HOST_STAYS_PRO", label: "Hôte Séjours Pro" },
  { value: "PREMIUM_USER", label: "Premium utilisateur" },
  { value: "VERIFICATION", label: "Vérification ImoSafe" },
  { value: "BOOST_LISTING", label: "Mise en avant annonce" },
] as const;

export default function ManualPaymentPage() {
  const [fullName, setFullName] = useState("");
  const [whatsAppPhone, setWhatsAppPhone] = useState("");
  const [email, setEmail] = useState("");
  const [offer, setOffer] = useState<(typeof OFFERS)[number]["value"]>(OFFERS[0].value);
  const [message, setMessage] = useState("");
  const [proofHint, setProofHint] = useState("");
  const [done, setDone] = useState(false);

  const offerLabel = useMemo(() => OFFERS.find((o) => o.value === offer)?.label ?? offer, [offer]);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Activation manuelle d’une offre</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-white/70">
          MVP mock: cette page prépare l’activation d’offres (sans PayDunya). La demande est enregistrée localement.
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
                  Demande d’activation envoyée localement — branchement DB bientôt.
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <a
                    href={IMOSAFE_CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  >
                    Contacter sur WhatsApp
                  </a>
                  <Link
                    href="/pricing"
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    Voir les offres
                  </Link>
                </div>
                <div className="mt-4 text-xs text-slate-500 dark:text-white/50">
                  Offre choisie: <span className="font-semibold">{offerLabel}</span>
                </div>
              </div>
            ) : (
              <form
                className="mt-5 grid gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  addManualPaymentRequest({
                    fullName,
                    whatsAppPhone,
                    email: email || undefined,
                    offer,
                    message: message || undefined,
                    proofHint: proofHint || undefined,
                  });
                  setDone(true);
                }}
              >
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
                      placeholder={IMOSAFE_CONTACT.whatsapp}
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
                    placeholder={IMOSAFE_CONTACT.email}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Offre choisie</label>
                  <select
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value as (typeof OFFERS)[number]["value"])}
                    required
                  >
                    {OFFERS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Message</label>
                  <textarea
                    className="mt-1 min-h-[110px] w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Précise le contexte: durée, référence, besoin urgent, etc."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">
                    Preuve de paiement (bientôt) / optionnel
                  </label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={proofHint}
                    onChange={(e) => setProofHint(e.target.value)}
                    placeholder="Ex: référence transaction / capture / Mobile Money..."
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                >
                  Envoyer la demande d’activation
                </button>

                <div className="text-xs text-slate-500 dark:text-white/50">
                  MVP: demande stockée localement (pas de DB). On branchera le traitement admin ensuite.
                </div>
              </form>
            )}
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-extrabold">Contact ImoSafe</div>
                <StatusBadge tone="neutral">Support</StatusBadge>
              </div>
              <div className="mt-3 grid gap-1 text-sm">
                <div>
                  WhatsApp: <span className="font-semibold">{IMOSAFE_CONTACT.whatsapp}</span>
                </div>
                <div>
                  Email: <span className="font-semibold">{IMOSAFE_CONTACT.email}</span>
                </div>
                <div>
                  Horaires: <span className="font-semibold">{IMOSAFE_CONTACT.workingHours}</span>
                </div>
              </div>
              <a
                href={IMOSAFE_CONTACT.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Contacter sur WhatsApp
              </a>
            </div>

            <div className="rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
              <div className="font-extrabold">Rappel sécurité</div>
              <div className="mt-2">Ne payez jamais avant visite ou vérification. Évitez les paiements hors canal vérifié.</div>
              <div className="mt-3">
                <Link href="/safety-rules" className="text-sm font-semibold text-amber-900 hover:underline dark:text-amber-100">
                  Voir les règles de sécurité
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
              <div className="font-extrabold">Liens utiles</div>
              <div className="mt-3 grid gap-2">
                <Link href="/partners" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
                  Devenir partenaire
                </Link>
                <Link href="/terms" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
                  Conditions d’utilisation
                </Link>
                <Link href="/privacy" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
                  Politique de confidentialité
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
