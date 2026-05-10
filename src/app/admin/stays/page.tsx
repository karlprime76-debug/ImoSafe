"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DEMO_STAYS, type Stay, type VerificationStatus } from "@/lib/demoData";
import { getDraftStays, updateDraftStayDocumentStatus } from "@/lib/mockDataStore";

type Row = Stay & { actionStatus?: VerificationStatus };

export default function AdminStaysPage() {
  const [overrides, setOverrides] = useState<Record<string, VerificationStatus>>({});
  const [draftDocsTick, setDraftDocsTick] = useState(0);

  const rows: Row[] = useMemo(
    () =>
      DEMO_STAYS.map((s) => ({
        ...s,
        actionStatus: overrides[s.id] ?? s.verificationStatus,
      })),
    [overrides]
  );

  const draftDocsById = useMemo(() => {
    void draftDocsTick;
    const drafts = getDraftStays();
    const map = new Map(drafts.map((d) => [d.id, d.documents ?? []] as const));
    return map;
  }, [draftDocsTick]);

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <Link href="/admin" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
          ← Retour admin
        </Link>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Séjours à vérifier</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">MVP: actions mock (statut non persisté pour DEMO_STAYS).</p>

        <div className="mt-6 grid gap-3">
          {rows.map((s) => (
            <div key={s.id} className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-extrabold">{s.title}</div>
                <div className="text-xs font-semibold text-slate-600 dark:text-white/60">{s.actionStatus}</div>
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-white/70">
                {s.city}
                {s.neighborhood ? ` • ${s.neighborhood}` : ""} • {s.availabilityStatus}
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white"
                  onClick={() => setOverrides((o) => ({ ...o, [s.id]: "VERIFIED" }))}
                >
                  Valider
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-amber-600 px-4 text-sm font-semibold text-white"
                  onClick={() => setOverrides((o) => ({ ...o, [s.id]: "SUSPICIOUS" }))}
                >
                  Marquer suspect
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white"
                  onClick={() => setOverrides((o) => ({ ...o, [s.id]: "REJECTED" }))}
                >
                  Rejeter
                </button>
                <Link
                  href={`/stays/${encodeURIComponent(s.id)}`}
                  className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  Voir détail
                </Link>
              </div>

              {draftDocsById.get(s.id)?.length ? (
                <div className="mt-4 rounded-2xl border border-black/10 bg-slate-50 p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-white/70">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white">Documents (admin)</div>
                  <div className="mt-3 grid gap-2">
                    {draftDocsById.get(s.id)?.map((d) => (
                      <div
                        key={d.id}
                        className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white p-3 text-xs dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 dark:text-white">{d.name}</div>
                          <div className="mt-0.5 truncate text-slate-600 dark:text-white/60">
                            {d.type} • {d.status}
                          </div>
                          <div className="mt-1 truncate text-slate-600 dark:text-white/60">{d.url}</div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <DocAction
                            label="Vérifier"
                            tone="success"
                            onClick={() => {
                              updateDraftStayDocumentStatus(s.id, d.id, "VERIFIED");
                              setDraftDocsTick((t) => t + 1);
                            }}
                          />
                          <DocAction
                            label="Rejeter"
                            tone="danger"
                            onClick={() => {
                              updateDraftStayDocumentStatus(s.id, d.id, "REJECTED");
                              setDraftDocsTick((t) => t + 1);
                            }}
                          />
                          <DocAction
                            label="À revoir"
                            tone="warning"
                            onClick={() => {
                              updateDraftStayDocumentStatus(s.id, d.id, "SUSPICIOUS");
                              setDraftDocsTick((t) => t + 1);
                            }}
                          />
                          <DocAction
                            label="Remettre en vérification"
                            tone="neutral"
                            onClick={() => {
                              updateDraftStayDocumentStatus(s.id, d.id, "PENDING");
                              setDraftDocsTick((t) => t + 1);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function DocAction({
  label,
  tone,
  onClick,
}: {
  label: string;
  tone: "success" | "warning" | "danger" | "neutral";
  onClick: () => void;
}) {
  const className =
    tone === "success"
      ? "bg-emerald-600"
      : tone === "warning"
        ? "bg-amber-600"
        : tone === "danger"
          ? "bg-rose-600"
          : "border border-black/10 bg-white text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white";

  return (
    <button
      type="button"
      className={
        "inline-flex h-9 items-center justify-center rounded-xl px-3 text-xs font-semibold shadow-sm transition hover:opacity-95 " +
        (tone === "neutral" ? className : className + " text-white")
      }
      onClick={onClick}
    >
      {label}
    </button>
  );
}
