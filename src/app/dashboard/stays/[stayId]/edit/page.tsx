"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ImageUploader } from "@/components/uploads/ImageUploader";
import { useAuthMe } from "@/lib/useAuthMe";

type DocItem = { id: string; type: string; fileName: string | null; fileUrl: string; verificationStatus: string };

type StayDto = {
  id: string;
  title: string;
  description: string;
  city: string;
  neighborhood: string;
  addressApprox: string | null;
  pricePerNight: number;
  pricePerWeek: number | null;
  pricePerMonth: number | null;
  cleaningFee: number | null;
  deposit: number | null;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  checkInTime: string | null;
  checkOutTime: string | null;
  rules: string[];
  isHidden: boolean;
  verificationStatus: string;
  availabilityStatus: string;
  stayImages: Array<{ url: string; alt: string | null; sortOrder: number }>;
  documents: DocItem[];
};

export default function EditStayPage({ params }: { params: { stayId: string } }) {
  const { user: session } = useAuthMe();
  const stayId = decodeURIComponent(params.stayId).trim();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneMsg, setDoneMsg] = useState<string | null>(null);

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
  const [documents, setDocuments] = useState<Array<{ id: string; type: string; name: string; url: string }>>([]);
  const [images, setImages] = useState<Array<{ url: string; alt?: string | null }>>([]);

  const [serverDocuments, setServerDocuments] = useState<DocItem[]>([]);
  const [isHidden, setIsHidden] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [availabilityStatus, setAvailabilityStatus] = useState<string | null>(null);

  const canManage = useMemo(() => {
    return session?.role === "HOST" || session?.role === "ADMIN";
  }, [session?.role]);

  useEffect(() => {
    if (!session) return;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/dashboard/stays/${encodeURIComponent(stayId)}`, { cache: "no-store" });
        const data = (await res.json()) as
          | { ok: true; stay: StayDto }
          | { ok: false; error?: { message?: string } };

        if (!res.ok || !data.ok) {
          setError((data.ok ? undefined : data.error?.message) || "Erreur serveur.");
          return;
        }

        const s = data.stay;
        setTitle(s.title);
        setDescription(s.description);
        setCity(s.city);
        setNeighborhood(s.neighborhood);
        setAddressApprox(s.addressApprox ?? "");

        setPricePerNight(String(s.pricePerNight));
        setPricePerWeek(s.pricePerWeek == null ? "" : String(s.pricePerWeek));
        setPricePerMonth(s.pricePerMonth == null ? "" : String(s.pricePerMonth));
        setCleaningFee(s.cleaningFee == null ? "" : String(s.cleaningFee));
        setDeposit(s.deposit == null ? "" : String(s.deposit));

        setMaxGuests(String(s.maxGuests));
        setBedrooms(String(s.bedrooms));
        setBathrooms(String(s.bathrooms));

        setAmenities((s.amenities ?? []).join(", "));
        setCheckInTime(s.checkInTime ?? "14:00");
        setCheckOutTime(s.checkOutTime ?? "11:00");
        setRules((s.rules ?? []).join(", "));

        setImages((s.stayImages ?? []).map((i) => ({ url: i.url, alt: i.alt })));
        setServerDocuments(s.documents ?? []);

        setIsHidden(Boolean(s.isHidden));
        setVerificationStatus(s.verificationStatus);
        setAvailabilityStatus(s.availabilityStatus);
      } catch {
        setError("Erreur serveur.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [session, stayId]);

  const sendAction = async (action: "HIDE" | "REACTIVATE") => {
    if (!session) return;
    setSaving(true);
    setError(null);
    setDoneMsg(null);
    try {
      const res = await fetch(`/api/dashboard/stays/${encodeURIComponent(stayId)}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = (await res.json()) as { ok: boolean; error?: { message?: string } };
      if (!res.ok || !data.ok) {
        setError(data.ok ? "Erreur serveur." : data.error?.message || "Erreur serveur.");
        return;
      }
      window.location.reload();
    } catch {
      setError("Erreur serveur.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/dashboard/stays" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
          ← Retour mes séjours
        </Link>

        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Modifier un séjour</h1>

        {!session ? (
          <div className="mt-6 rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
            Connecte-toi pour gérer ton séjour.
          </div>
        ) : !canManage ? (
          <div className="mt-6 rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
            Accès réservé aux hôtes.
          </div>
        ) : error ? (
          <div className="mt-6 text-sm font-semibold text-rose-700 dark:text-rose-300">{error}</div>
        ) : loading ? (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            Chargement...
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-semibold text-slate-600 dark:text-white/60">
                {verificationStatus ? `Vérif: ${verificationStatus}` : null}
                {availabilityStatus ? ` • ${availabilityStatus}` : null}
                {isHidden ? " • Masqué" : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
                  onClick={() => void sendAction("HIDE")}
                  disabled={saving}
                >
                  Masquer
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
                  onClick={() => void sendAction("REACTIVATE")}
                  disabled={saving}
                >
                  Réactiver
                </button>
              </div>
            </div>

            {doneMsg ? <div className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">{doneMsg}</div> : null}

            <form
              className="mt-6 grid gap-3"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!session) return;

                setSaving(true);
                setError(null);
                setDoneMsg(null);

                const parsedPricePerNight = Number(pricePerNight);
                const parsedPricePerWeek = pricePerWeek ? Number(pricePerWeek) : undefined;
                const parsedPricePerMonth = pricePerMonth ? Number(pricePerMonth) : undefined;
                const parsedCleaningFee = cleaningFee ? Number(cleaningFee) : undefined;
                const parsedDeposit = deposit ? Number(deposit) : undefined;

                const parsedMaxGuests = Number(maxGuests);
                const parsedBedrooms = Number(bedrooms);
                const parsedBathrooms = Number(bathrooms);

                try {
                  const res = await fetch(`/api/dashboard/stays/${encodeURIComponent(stayId)}`, {
                    method: "PUT",
                    headers: {
                      "content-type": "application/json",
                    },
                    body: JSON.stringify({
                      title: title.trim(),
                      description: description.trim(),
                      city: city.trim(),
                      neighborhood: neighborhood.trim(),
                      addressApprox: addressApprox.trim() || undefined,
                      images: images.map((i) => ({ url: i.url, alt: i.alt ?? undefined })),
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

                  setDoneMsg(data.message ?? "Séjour mis à jour.");
                  setDocuments([]);
                  setDocName("");
                  setDocUrl("");
                } catch {
                  setError("Erreur serveur.");
                } finally {
                  setSaving(false);
                }
              }}
            >
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Titre</label>
                <input
                  className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
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
                />
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-700 dark:text-white/70">Photos</div>
                <div className="mt-2">
                  <ImageUploader bucket="stay-images" value={images.map((i) => ({ url: i.url, alt: i.alt ?? undefined }))} onChange={(next) => setImages(next.map((n) => ({ url: n.url, alt: n.alt ?? null })))} maxFiles={8} userId={session?.id} />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Prix / nuit</label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(e.target.value)}
                    inputMode="numeric"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Frais ménage</label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={cleaningFee}
                    onChange={(e) => setCleaningFee(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Prix / semaine (optionnel)</label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={pricePerWeek}
                    onChange={(e) => setPricePerWeek(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Prix / mois (optionnel)</label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={pricePerMonth}
                    onChange={(e) => setPricePerMonth(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Caution (optionnel)</label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Max voyageurs</label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(e.target.value)}
                    inputMode="numeric"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Chambres</label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    inputMode="numeric"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Salles de bain</label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    inputMode="numeric"
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
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Équipements (séparés par virgules)</label>
                <input
                  className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Règles (séparées par virgules)</label>
                <input
                  className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
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
                      setDocuments((prev) => [...prev, { id: `doc_${Math.random().toString(16).slice(2)}`, type: docType, name, url }]);
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
                          <div className="mt-0.5 truncate text-slate-600 dark:text-white/60">{d.type}</div>
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
                ) : null}

                {serverDocuments.length ? (
                  <div className="mt-6">
                    <div className="text-xs font-semibold text-slate-700 dark:text-white/70">Documents enregistrés (DB)</div>
                    <div className="mt-2 grid gap-2">
                      {serverDocuments.map((d) => (
                        <div
                          key={d.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-black/10 bg-white p-3 text-xs dark:border-white/10 dark:bg-white/5"
                        >
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 dark:text-white">{d.fileName ?? "Document"}</div>
                            <div className="mt-0.5 truncate text-slate-600 dark:text-white/60">
                              {d.type} • {d.verificationStatus}
                            </div>
                          </div>
                          <a
                            href={d.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-9 items-center justify-center rounded-xl border border-black/10 bg-white px-3 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                          >
                            Ouvrir
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-2 inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
              >
                {saving ? "Sauvegarde..." : "Enregistrer"}
              </button>
            </form>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
