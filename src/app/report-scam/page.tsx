"use client";

import { useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ScamReportBadge } from "@/components/ui/ScamReportBadge";
import { addScamReport } from "@/lib/mockDataStore";

export default function ReportScamPage({
  searchParams,
}: {
  searchParams: { propertyId?: string };
}) {
  const propertyId = searchParams.propertyId ?? "";
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [phoneOrContact, setPhoneOrContact] = useState("");
  const [done, setDone] = useState(false);

  const suggestions = [
    "Faux logement courte durée",
    "Photos volées",
    "Hôte suspect",
    "Paiement demandé hors canal",
    "Logement différent des photos",
    "Caution suspecte",
    "Indisponible après paiement",
    "Faux propriétaire",
    "Fausse agence",
    "Terrain litigieux",
    "Bien déjà loué/vendu",
    "Prix mensonger",
  ];

  const hint = useMemo(() => {
    if (!propertyId) return "";
    return `Signalement lié au bien: ${propertyId}`;
  }, [propertyId]);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Signaler une arnaque</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-white/70">
          Signalez toute demande d’argent suspecte, faux propriétaire, fausse annonce ou documents incohérents.
        </p>

        <div className="mt-6 rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
          <div className="font-extrabold">Rappel</div>
          <div className="mt-1">Ne payez jamais avant d’avoir visité et vérifié. Une urgence + demande d’avance = alerte.</div>
          <div className="mt-3 grid gap-1 text-xs">
            <div>Conservez les preuves: captures, numéros, messages WhatsApp, IBAN / Mobile Money.</div>
            <div>Si possible, partagez l’URL / ID du bien pour accélérer l’analyse.</div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          {done ? (
            <div className="rounded-2xl border border-emerald-600/20 bg-emerald-500/10 p-5 text-sm text-emerald-950 ring-1 ring-emerald-600/20 dark:border-emerald-400/20 dark:text-emerald-100 dark:ring-emerald-400/20">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-extrabold">Merci. Ton signalement a bien été reçu.</div>
                <ScamReportBadge />
              </div>
              <div className="mt-2 text-sm text-emerald-950/80 dark:text-emerald-100/80">
                MVP: le signalement est enregistré localement sur ton navigateur. L’analyse admin sera branchée ensuite.
              </div>
            </div>
          ) : (
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                addScamReport({
                  propertyId: propertyId || undefined,
                  reason,
                  description: description || undefined,
                  phoneOrContact: phoneOrContact || undefined,
                });
                setDone(true);
              }}
            >
              {hint ? <div className="text-sm font-semibold text-slate-700 dark:text-white/70">{hint}</div> : null}

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Raison</label>
                <input
                  className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: paiement demandé hors canal / photos volées / faux propriétaire"
                  required
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="rounded-full border border-black/10 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
                    onClick={() => setReason(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Description</label>
                <textarea
                  className="mt-1 min-h-[110px] w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Détails: message reçu, numéro, compte bancaire, etc."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Téléphone / contact</label>
                <input
                  className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  value={phoneOrContact}
                  onChange={(e) => setPhoneOrContact(e.target.value)}
                  placeholder="Ex: +229 ... / WhatsApp / email"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Envoyer le signalement
              </button>

              <div className="text-xs text-slate-500 dark:text-white/50">
                MVP: signalements stockés localement (pas de DB). On branchera la vérification admin ensuite.
              </div>
            </form>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
