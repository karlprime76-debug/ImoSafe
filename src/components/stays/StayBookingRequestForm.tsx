"use client";

import { useMemo, useState } from "react";

import type { Stay } from "@/lib/demoData";
import { addBooking } from "@/lib/mockDataStore";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function StayBookingRequestForm({ stay }: { stay: Stay }) {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  const minGuests = 1;
  const maxGuests = Math.max(1, stay.maxGuests);

  const snapshot = useMemo(
    () => ({
      stayId: stay.id,
      stayTitleSnapshot: stay.title,
      stayNeighborhoodSnapshot: stay.neighborhood,
      stayCitySnapshot: stay.city,
      pricePerNightSnapshot: stay.pricePerNight,
    }),
    [stay.city, stay.id, stay.neighborhood, stay.pricePerNight, stay.title],
  );

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-base font-extrabold tracking-tight">Demander une réservation</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-white/70">
            MVP: la demande est enregistrée localement sur ton navigateur.
          </div>
        </div>
        {typeof stay.trustScore === "number" ? <StatusBadge tone="neutral">Score {stay.trustScore}</StatusBadge> : null}
      </div>

      {done ? (
        <div className="mt-5 rounded-2xl border border-emerald-600/20 bg-emerald-500/10 p-5 text-sm text-emerald-950 ring-1 ring-emerald-600/20 dark:border-emerald-400/20 dark:text-emerald-100 dark:ring-emerald-400/20">
          <div className="font-extrabold">Demande envoyée</div>
          <div className="mt-2 text-sm text-emerald-950/80 dark:text-emerald-100/80">
            Demande de réservation envoyée localement — branchement DB bientôt.
          </div>
        </div>
      ) : (
        <form
          className="mt-5 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            addBooking({
              ...snapshot,
              checkInDate,
              checkOutDate,
              guests,
              name,
              whatsapp,
              message: message || undefined,
            });
            setDone(true);
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Date d’arrivée</label>
              <input
                type="date"
                className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Date de départ</label>
              <input
                type="date"
                className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Voyageurs</label>
              <input
                type="number"
                min={minGuests}
                max={maxGuests}
                className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value || 1))}
                required
              />
              <div className="mt-1 text-[11px] text-slate-500 dark:text-white/50">Max: {maxGuests}</div>
            </div>
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
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Téléphone WhatsApp</label>
            <input
              className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ex: +229 ..."
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Message</label>
            <textarea
              className="mt-1 min-h-[110px] w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Détails: heure d’arrivée, besoin particulier, etc."
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Envoyer la demande
          </button>

          <div className="text-xs text-slate-500 dark:text-white/50">
            Ne versez jamais d’argent en dehors d’un canal vérifié. En cas de doute: signalez.
          </div>
        </form>
      )}
    </div>
  );
}
