"use client";

import { useState } from "react";

import { addVisitRequest } from "@/lib/mockDataStore";

export function VisitRequestForm({ propertyId }: { propertyId: string }) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-600/20 bg-emerald-500/10 p-4 text-sm text-emerald-900 ring-1 ring-emerald-600/20 dark:border-emerald-400/20 dark:text-emerald-100 dark:ring-emerald-400/20">
        Demande envoyée (mock). Nous te recontactons rapidement.
      </div>
    );
  }

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        addVisitRequest({
          propertyId,
          name: name.trim(),
          whatsapp: whatsapp.trim(),
          preferredDate: preferredDate || undefined,
          preferredTime: preferredTime || undefined,
          message: message || undefined,
          status: "PENDING",
        });
        setDone(true);
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Nom</label>
          <input
            className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ton nom"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-white/70">WhatsApp</label>
          <input
            className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+229..."
            required
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Date</label>
          <input
            type="date"
            className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Heure</label>
          <input
            type="time"
            className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Message</label>
        <textarea
          className="mt-1 min-h-[88px] w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ex: Je suis disponible cette semaine, merci."
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
      >
        Envoyer la demande
      </button>

      <div className="text-xs text-slate-600 dark:text-white/60">
        ImoSafe ne garantit pas automatiquement un bien non vérifié. Ne payez jamais avant d’avoir visité.
      </div>
    </form>
  );
}
