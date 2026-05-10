"use client";

import Link from "next/link";
import { useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ImageUploader } from "@/components/uploads/ImageUploader";
import { useMockSession } from "@/lib/useMockSession";

export default function NewStayPage() {
  const session = useMockSession();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("Cotonou");
  const [neighborhood, setNeighborhood] = useState("");
  const [addressApprox, setAddressApprox] = useState("");

  const [pricePerNight, setPricePerNight] = useState("");
  const [pricePerWeek, setPricePerWeek] = useState("");
  const [pricePerMonth, setPricePerMonth] = useState("");
  const [cleaningFee, setCleaningFee] = useState("");
  const [deposit, setDeposit] = useState("");

  const [maxGuests, setMaxGuests] = useState("2");
  const [bedrooms, setBedrooms] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");

  const [amenities, setAmenities] = useState("Wi-Fi, Climatisation");
  const [checkInTime, setCheckInTime] = useState("14:00");
  const [checkOutTime, setCheckOutTime] = useState("11:00");
  const [rules, setRules] = useState("Non fumeur, Pas de fêtes");

  const [docType, setDocType] = useState<"RENTAL_AUTH" | "ID" | "OTHER">("RENTAL_AUTH");
  const [docName, setDocName] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [documents, setDocuments] = useState<Array<{ id: string; type: string; name: string; url: string; status: "PENDING" }>>([]);
  const [images, setImages] = useState<Array<{ url: string; alt?: string }>>([]);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/dashboard" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
          ← Retour dashboard
        </Link>

        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Publier un séjour (MVP)</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">MVP: URLs (photos + documents). Publication réelle en DB + vérification admin.</p>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          {done ? (
            <div className="rounded-2xl border border-emerald-600/20 bg-emerald-500/10 p-4 text-sm text-emerald-950 ring-1 ring-emerald-600/20 dark:border-emerald-400/20 dark:text-emerald-100 dark:ring-emerald-400/20">
              Annonce envoyée pour vérification ImoSafe.
            </div>
          ) : (
            <form
              className="grid gap-3"
              onSubmit={async (e) => {
                e.preventDefault();

                if (!session) {
                  setError("Connecte-toi pour publier.");
                  return;
                }

                setSaving(true);
                setError(null);

                const parsedPricePerNight = Number(pricePerNight);
                const parsedPricePerWeek = pricePerWeek ? Number(pricePerWeek) : undefined;
                const parsedPricePerMonth = pricePerMonth ? Number(pricePerMonth) : undefined;
                const parsedCleaningFee = cleaningFee ? Number(cleaningFee) : undefined;
                const parsedDeposit = deposit ? Number(deposit) : undefined;

                const parsedMaxGuests = Number(maxGuests);
                const parsedBedrooms = Number(bedrooms);
                const parsedBathrooms = Number(bathrooms);

                try {
                  const res = await fetch("/api/dashboard/stays", {
                    method: "POST",
                    headers: {
                      "content-type": "application/json",
                      "x-imosafe-session-id": session.id,
                    },
                    body: JSON.stringify({
                      title: title.trim(),
                      description: description.trim(),
                      city: city.trim(),
                      neighborhood: neighborhood.trim(),
                      addressApprox: addressApprox.trim() || undefined,
                      images: images.map((i) => ({ url: i.url, alt: i.alt })),
                      documents: documents.map((d) => ({ type: d.type, name: d.name, url: d.url })),
                      pricePerNight: Number.isFinite(parsedPricePerNight) ? parsedPricePerNight : 0,
                      pricePerWeek: Number.isFinite(parsedPricePerWeek) ? parsedPricePerWeek : undefined,
                      pricePerMonth: Number.isFinite(parsedPricePerMonth) ? parsedPricePerMonth : undefined,
                      cleaningFee: Number.isFinite(parsedCleaningFee) ? parsedCleaningFee : undefined,
                      deposit: Number.isFinite(parsedDeposit) ? parsedDeposit : undefined,
                      maxGuests: Number.isFinite(parsedMaxGuests) ? parsedMaxGuests : 1,
                      bedrooms: Number.isFinite(parsedBedrooms) ? parsedBedrooms : 0,
                      bathrooms: Number.isFinite(parsedBathrooms) ? parsedBathrooms : 0,
                      amenities: amenities
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                      checkInTime: checkInTime.trim() || undefined,
                      checkOutTime: checkOutTime.trim() || undefined,
                      rules: rules
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    }),
                  });

                  const data = (await res.json()) as
                    | { ok: true; message?: string }
                    | { ok: false; error?: { message?: string; code?: string } };

                  if (!res.ok || !data.ok) {
                    const msg = data.ok ? "Erreur serveur." : data.error?.message;
                    setError(msg || "Erreur serveur.");
                    return;
                  }

                  setDone(true);
                } catch {
                  setError("Erreur serveur.");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {error ? <div className="text-sm font-semibold text-rose-700 dark:text-rose-300">{error}</div> : null}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Titre</label>
                <input
                  className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mt-2">
                <div className="text-xs font-semibold text-slate-700 dark:text-white/70">Documents optionnels (URLs)</div>
                <div className="mt-2 grid gap-2 sm:grid-cols-[220px_1fr]">
                  <select
                    className="h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as typeof docType)}
                  >
                    <option value="RENTAL_AUTH">Autorisation de location</option>
                    <option value="ID">Preuve d’identité hôte</option>
                    <option value="OTHER">Autre document</option>
                  </select>
                  <input
                    className="h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="Nom du document"
                  />
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_160px]">
                  <input
                    className="h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                    placeholder="URL du document (PDF/image)"
                  />
                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                    onClick={() => {
                      const name = docName.trim();
                      const url = docUrl.trim();
                      if (!name || !url) return;
                      setDocuments((prev) => [
                        ...prev,
                        { id: `doc_${Math.random().toString(16).slice(2)}`, type: docType, name, url, status: "PENDING" },
                      ]);
                      setDocName("");
                      setDocUrl("");
                    }}
                  >
                    Ajouter
                  </button>
                </div>

                {documents.length ? (
                  <div className="mt-3 grid gap-2">
                    {documents.map((d) => (
                      <div
                        key={d.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-black/10 bg-white p-3 text-xs dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 dark:text-white">{d.name}</div>
                          <div className="mt-0.5 truncate text-slate-600 dark:text-white/60">
                            {d.type} • {d.status}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="inline-flex h-9 items-center justify-center rounded-xl bg-rose-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:opacity-95"
                          onClick={() => setDocuments((prev) => prev.filter((x) => x.id !== d.id))}
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 rounded-2xl border border-dashed border-black/15 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/15 dark:bg-black/20 dark:text-white/60">
                    Aucun document.
                  </div>
                )}

                <div className="mt-2 text-xs text-slate-600 dark:text-white/60">
                  Sécurité: les URLs de documents ne sont pas affichées publiquement.
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Description</label>
                <textarea
                  className="mt-1 min-h-[120px] w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Ville</label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Quartier</label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Adresse approximative</label>
                <input
                  className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  value={addressApprox}
                  onChange={(e) => setAddressApprox(e.target.value)}
                  placeholder="Ex: Proche de la plage"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Prix / nuit (FCFA)</label>
                  <input
                    inputMode="numeric"
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="25000"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Prix / semaine (FCFA)</label>
                  <input
                    inputMode="numeric"
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={pricePerWeek}
                    onChange={(e) => setPricePerWeek(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="150000"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Prix / mois (FCFA)</label>
                  <input
                    inputMode="numeric"
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={pricePerMonth}
                    onChange={(e) => setPricePerMonth(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="450000"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Frais ménage</label>
                  <input
                    inputMode="numeric"
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={cleaningFee}
                    onChange={(e) => setCleaningFee(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Caution</label>
                  <input
                    inputMode="numeric"
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="30000"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Voyageurs</label>
                  <input
                    inputMode="numeric"
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(e.target.value.replace(/[^0-9]/g, ""))}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Chambres</label>
                  <input
                    inputMode="numeric"
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value.replace(/[^0-9]/g, ""))}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Sdb</label>
                  <input
                    inputMode="numeric"
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value.replace(/[^0-9]/g, ""))}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Check-in</label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Check-out</label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Équipements (séparés par des virgules)</label>
                <input
                  className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Règles (séparées par des virgules)</label>
                <input
                  className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Photos</label>
                <div className="mt-1">
                  <ImageUploader
                    bucket="stay-images"
                    value={images}
                    onChange={setImages}
                    maxFiles={8}
                    folderPrefix={undefined}
                    userId={session?.id}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "Envoi..." : "Publier"}
              </button>

              <div className="text-xs text-slate-500 dark:text-white/50">Conseil: ImoSafe affichera “En vérification” jusqu’à validation.</div>
            </form>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
