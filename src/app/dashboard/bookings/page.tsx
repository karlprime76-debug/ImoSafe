"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { BookingStoreItem } from "@/lib/mockDataStore";
import { getBookings, updateBookingStatus } from "@/lib/mockDataStore";
import { useAuthMe } from "@/lib/useAuthMe";

export default function DashboardBookingsPage() {
  const { user: session } = useAuthMe();
  const [bookings, setBookings] = useState<BookingStoreItem[]>([]);
  const [dbMode, setDbMode] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const readLocal = () => {
      setDbMode(false);
      setBookings(getBookings());
    };

    const readDb = async () => {
      try {
        const res = await fetch("/api/dashboard/bookings", {
          cache: "no-store",
        });

        const data = (await res.json()) as
          | { ok: true; bookings: BookingStoreItem[] }
          | { ok: false; error?: { code?: string; message?: string } };

        if (!res.ok || !data.ok) {
          readLocal();
          return;
        }

        if (cancelled) return;
        setDbMode(true);
        setBookings(data.bookings);
      } catch {
        readLocal();
      }
    };

    if (session?.id) void readDb();
    else readLocal();

    window.addEventListener("imosafe:bookings", readLocal);
    return () => {
      cancelled = true;
      window.removeEventListener("imosafe:bookings", readLocal);
    };
  }, [session?.id]);

  const rows = useMemo(() => {
    return bookings.map((b) => ({
      ...b,
      requestDate: new Date(b.createdAt),
    }));
  }, [bookings]);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
            >
              ← Retour au dashboard
            </Link>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Réservations (séjours)</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
              Mes demandes de réservation courte durée. MVP: stockées localement.
            </p>
          </div>
          <StatusBadge tone="neutral">{rows.length} demandes</StatusBadge>
        </div>

        {rows.length ? (
          <div className="mt-6 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="grid gap-0">
              {rows.map((b) => (
                <div
                  key={b.id}
                  className="grid gap-3 border-b border-black/5 p-5 last:border-b-0 dark:border-white/10 sm:grid-cols-[1.2fr_0.8fr_0.6fr_0.6fr]"
                >
                  <div className="min-w-0">
                    <div className="truncate text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {b.stayTitleSnapshot}
                    </div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-white/70">
                      {b.stayCitySnapshot}
                      {b.stayNeighborhoodSnapshot ? ` • ${b.stayNeighborhoodSnapshot}` : ""}
                    </div>
                    <div className="mt-2 text-xs text-slate-500 dark:text-white/50">
                      Prix au moment de la demande: {b.pricePerNightSnapshot.toLocaleString("fr-FR")} XOF / nuit
                    </div>
                  </div>

                  <div className="grid gap-1 text-sm text-slate-700 dark:text-white/70">
                    <div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-white/60">Dates</span>
                    </div>
                    <div>
                      {b.checkInDate} → {b.checkOutDate}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-white/60">Voyageurs:</span> {b.guests}
                    </div>
                  </div>

                  <div className="grid gap-1 text-sm text-slate-700 dark:text-white/70">
                    <div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-white/60">Contact</span>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">{b.name}</div>
                    <div className="text-xs text-slate-500 dark:text-white/50">WhatsApp: {b.whatsapp}</div>
                  </div>

                  <div className="grid content-start gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone={toneForStatus(b.status)}>{labelForStatus(b.status)}</StatusBadge>
                      <StatusBadge tone="neutral">
                        {b.requestDate.toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </StatusBadge>
                    </div>
                    {b.message ? (
                      <div className="rounded-2xl border border-black/10 bg-slate-50 p-3 text-xs text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-white/70">
                        {b.message}
                      </div>
                    ) : null}

                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      {!dbMode ? (
                        <>
                          <button
                            type="button"
                            className="inline-flex h-10 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                            onClick={() => updateBookingStatus(b.id, "CONFIRMED")}
                          >
                            Accepter
                          </button>
                          <button
                            type="button"
                            className="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                            onClick={() => updateBookingStatus(b.id, "DECLINED")}
                          >
                            Refuser
                          </button>
                        </>
                      ) : null}

                      {(() => {
                        const wa = (b.whatsapp ?? "").replace(/[^0-9]/g, "");
                        const href = wa ? `https://wa.me/${wa}` : "";
                        if (!href) return null;
                        return (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-10 items-center justify-center rounded-2xl border border-emerald-600/20 bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-950 shadow-sm ring-1 ring-emerald-600/20 transition hover:opacity-95 dark:border-emerald-400/20 dark:text-emerald-100 dark:ring-emerald-400/20"
                          >
                            Contacter WhatsApp
                          </a>
                        );
                      })()}
                    </div>

                    <Link
                      href={`/stays/${encodeURIComponent(b.stayId)}`}
                      className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
                    >
                      Ouvrir le séjour
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            Aucune demande de réservation pour le moment.
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-amber-600/20 bg-amber-500/10 p-4 text-sm text-amber-900 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
          <div className="font-semibold">Note</div>
          <div className="mt-1">
            Les infos affichées (titre, ville, prix) viennent d’un snapshot enregistré au moment de la demande.
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function labelForStatus(status: BookingStoreItem["status"]) {
  if (status === "CONFIRMED") return "Confirmée";
  if (status === "DECLINED") return "Refusée";
  return "En attente";
}

function toneForStatus(status: BookingStoreItem["status"]) {
  if (status === "CONFIRMED") return "success" as const;
  if (status === "DECLINED") return "danger" as const;
  return "info" as const;
}
