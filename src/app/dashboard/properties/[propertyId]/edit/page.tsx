"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { useMockSession } from "@/lib/useMockSession";

type ImageItem = { url: string; alt?: string | null };

type DocItem = { id: string; type: string; fileName: string | null; fileUrl: string; verificationStatus: string };

type PropertyDto = {
  id: string;
  title: string;
  description: string;
  type: string;
  transactionType: string;
  price: number;
  city: string;
  neighborhood: string | null;
  address: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  contactWhatsApp: string | null;
  notes: string | null;
  status: string;
  verificationStatus: string;
  isHidden: boolean;
  propertyImages: Array<{ url: string; alt: string | null; sortOrder: number }>;
  documents: DocItem[];
};

export default function EditPropertyPage({ params }: { params: { propertyId: string } }) {
  const session = useMockSession();
  const propertyId = decodeURIComponent(params.propertyId).trim();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneMsg, setDoneMsg] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState<"RENT" | "SALE">("RENT");
  const [type, setType] = useState<"HOUSE" | "APARTMENT" | "LAND" | "OFFICE" | "SHOP" | "WAREHOUSE">("APARTMENT");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [contactWhatsApp, setContactWhatsApp] = useState("");
  const [notes, setNotes] = useState("");

  const [images, setImages] = useState<ImageItem[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const [docType, setDocType] = useState<
    "TITLE_DEED" | "SALE_CONVENTION" | "LEASE" | "RECEIPT" | "RENTAL_AUTH" | "OWNER_ID" | "OTHER"
  >("TITLE_DEED");
  const [docName, setDocName] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [documents, setDocuments] = useState<Array<{ type: string; name: string; url: string }>>([]);

  const addImages = (raw: string, alt?: string) => {
    const urls = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!urls.length) return;

    setImages((prev) => {
      const existing = new Set(prev.map((i) => i.url));
      const next = [...prev];
      for (const url of urls) {
        if (existing.has(url)) continue;
        next.push({ url, alt: alt?.trim() || null });
        existing.add(url);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!session) return;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/dashboard/properties/${encodeURIComponent(propertyId)}`, {
          headers: { "x-imosafe-session-id": session.id },
        });
        const data = (await res.json()) as
          | { ok: true; property: PropertyDto }
          | { ok: false; error?: { message?: string } };

        if (!res.ok || !data.ok) {
          setError((data.ok ? undefined : data.error?.message) || "Erreur serveur.");
          return;
        }

        const p = data.property;
        setTitle(p.title);
        setDescription(p.description);
        setTransactionType(p.transactionType as "RENT" | "SALE");
        setType(p.type as typeof type);
        setPrice(String(p.price));
        setCity(p.city);
        setNeighborhood(p.neighborhood ?? "");
        setAddress(p.address ?? "");
        setBedrooms(p.bedrooms == null ? "" : String(p.bedrooms));
        setBathrooms(p.bathrooms == null ? "" : String(p.bathrooms));
        setArea(p.area == null ? "" : String(p.area));
        setContactWhatsApp(p.contactWhatsApp ?? "");
        setNotes(p.notes ?? "");
        setImages(
          p.propertyImages.length
            ? p.propertyImages.sort((a, b) => a.sortOrder - b.sortOrder).map((i) => ({ url: i.url, alt: i.alt }))
            : []
        );
        setDocuments(p.documents.map((d) => ({ type: d.type, name: d.fileName ?? d.type, url: d.fileUrl })));
      } catch {
        setError("Erreur serveur.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [propertyId, session]);

  const canManage = useMemo(() => {
    return session?.role === "OWNER" || session?.role === "AGENCY" || session?.role === "ADMIN";
  }, [session?.role]);

  const sendAction = async (action: "HIDE" | "REACTIVATE") => {
    if (!session) return;
    setSaving(true);
    setError(null);
    setDoneMsg(null);
    try {
      const res = await fetch(`/api/dashboard/properties/${encodeURIComponent(propertyId)}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "x-imosafe-session-id": session.id,
        },
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

  if (!session) {
    return (
      <div className="min-h-full">
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
          <div className="rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
            Connecte-toi pour modifier cette annonce.
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="min-h-full">
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
          <div className="rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
            Accès réservé aux annonceurs.
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/dashboard/properties" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
          ← Retour à mes annonces
        </Link>

        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Modifier l’annonce</h1>

        {error ? <div className="mt-4 text-sm font-semibold text-rose-700 dark:text-rose-300">{error}</div> : null}
        {doneMsg ? <div className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300">{doneMsg}</div> : null}

        {loading ? (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            Chargement...
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <form
              className="grid gap-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setSaving(true);
                setError(null);
                setDoneMsg(null);

                const parsedPrice = Number(price);
                const parsedBedrooms = bedrooms ? Number(bedrooms) : undefined;
                const parsedBathrooms = bathrooms ? Number(bathrooms) : undefined;
                const parsedArea = area ? Number(area) : undefined;

                try {
                  const res = await fetch(`/api/dashboard/properties/${encodeURIComponent(propertyId)}`, {
                    method: "PUT",
                    headers: {
                      "content-type": "application/json",
                      "x-imosafe-session-id": session.id,
                    },
                    body: JSON.stringify({
                      title: title.trim(),
                      description: description.trim(),
                      type,
                      transactionType,
                      price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
                      city: city.trim(),
                      neighborhood: neighborhood.trim() || "",
                      address: address.trim() || "",
                      bedrooms: Number.isFinite(parsedBedrooms) ? parsedBedrooms : undefined,
                      bathrooms: Number.isFinite(parsedBathrooms) ? parsedBathrooms : undefined,
                      area: Number.isFinite(parsedArea) ? parsedArea : undefined,
                      images: images.map((i) => ({ url: i.url, alt: i.alt ?? undefined })),
                      documents,
                      contactWhatsApp: contactWhatsApp.trim() || "",
                      notes: notes.trim() || "",
                    }),
                  });

                  const data = (await res.json()) as
                    | { ok: true; message?: string }
                    | { ok: false; error?: { message?: string } };

                  if (!res.ok || !data.ok) {
                    setError((data.ok ? undefined : data.error?.message) || "Erreur serveur.");
                    return;
                  }

                  setDoneMsg(data.ok ? (data.message || "Modifications enregistrées.") : "Modifications enregistrées.");
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
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Type</label>
                  <select
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={type}
                    onChange={(e) => setType(e.target.value as typeof type)}
                  >
                    <option value="HOUSE">Maison</option>
                    <option value="APARTMENT">Appartement</option>
                    <option value="LAND">Terrain</option>
                    <option value="OFFICE">Bureau</option>
                    <option value="SHOP">Boutique</option>
                    <option value="WAREHOUSE">Entrepôt</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Transaction</label>
                  <select
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value as typeof transactionType)}
                  >
                    <option value="RENT">Location</option>
                    <option value="SALE">Vente</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Prix (FCFA)</label>
                  <input
                    inputMode="numeric"
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Ville</label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Quartier</label>
                <input
                  className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Adresse approximative</label>
                <input
                  className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Chambres</label>
                  <input
                    inputMode="numeric"
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value.replace(/[^0-9]/g, ""))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Douches</label>
                  <input
                    inputMode="numeric"
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value.replace(/[^0-9]/g, ""))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Surface (m²)</label>
                  <input
                    inputMode="numeric"
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={area}
                    onChange={(e) => setArea(e.target.value.replace(/[^0-9]/g, ""))}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Contact WhatsApp</label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={contactWhatsApp}
                    onChange={(e) => setContactWhatsApp(e.target.value)}
                    placeholder="+229..."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Notes (privées)</label>
                  <input
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Photos (URLs)</label>
                <div className="mt-1 grid gap-2 sm:grid-cols-[1fr_200px]">
                  <input
                    className="h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Colle une URL (ou plusieurs séparées par des virgules)"
                  />
                  <input
                    className="h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Alt (optionnel)"
                  />
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                    onClick={() => {
                      addImages(imageUrl, imageAlt);
                      setImageUrl("");
                      setImageAlt("");
                    }}
                  >
                    Ajouter à la galerie
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                    onClick={() => setImages([])}
                    disabled={!images.length}
                  >
                    Vider
                  </button>
                </div>

                {images.length ? (
                  <div className="mt-3 grid gap-3">
                    <div className="overflow-hidden rounded-3xl border border-black/10 bg-slate-100 shadow-sm dark:border-white/10 dark:bg-white/10">
                      <img src={images[0]?.url} alt={images[0]?.alt ?? title} className="h-[220px] w-full object-cover sm:h-[320px]" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {images.map((img, idx) => (
                        <div key={img.url} className="rounded-2xl border border-black/10 bg-white p-2 dark:border-white/10 dark:bg-white/5">
                          <button
                            type="button"
                            className="block w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-white/10"
                            onClick={() => {
                              setImages((prev) => {
                                const next = [...prev];
                                const [picked] = next.splice(idx, 1);
                                next.unshift(picked);
                                return next;
                              });
                            }}
                            aria-label={idx === 0 ? "Image principale" : "Définir comme principale"}
                          >
                            <img src={img.url} alt={img.alt ?? title} className="h-20 w-full object-cover" loading="lazy" />
                          </button>

                          <input
                            className="mt-2 h-9 w-full rounded-xl border border-black/10 bg-white px-2 text-xs text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                            value={img.alt ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              setImages((prev) => prev.map((p) => (p.url === img.url ? { ...p, alt: value.trim() || null } : p)));
                            }}
                            placeholder="Alt (optionnel)"
                          />

                          <button
                            type="button"
                            className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-xl bg-rose-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:opacity-95"
                            onClick={() => setImages((prev) => prev.filter((p) => p.url !== img.url))}
                          >
                            Supprimer
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-2">
                <div className="text-xs font-semibold text-slate-700 dark:text-white/70">Documents optionnels (URLs)</div>
                <div className="mt-2 grid gap-2 sm:grid-cols-[220px_1fr]">
                  <select
                    className="h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as typeof docType)}
                  >
                    <option value="TITLE_DEED">Titre foncier</option>
                    <option value="SALE_CONVENTION">Convention de vente</option>
                    <option value="LEASE">Bail</option>
                    <option value="RECEIPT">Quittance</option>
                    <option value="RENTAL_AUTH">Autorisation de location</option>
                    <option value="OWNER_ID">Pièce propriétaire</option>
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
                      setDocuments((prev) => [...prev, { type: docType, name, url }]);
                      setDocName("");
                      setDocUrl("");
                    }}
                  >
                    Ajouter
                  </button>
                </div>

                {documents.length ? (
                  <div className="mt-3 grid gap-2">
                    {documents.map((d, idx) => (
                      <div
                        key={`${d.type}-${d.url}-${idx}`}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-black/10 bg-white p-3 text-xs dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 dark:text-white">{d.name}</div>
                          <div className="mt-0.5 truncate text-slate-600 dark:text-white/60">{d.type}</div>
                        </div>
                        <button
                          type="button"
                          className="inline-flex h-9 items-center justify-center rounded-xl bg-rose-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:opacity-95"
                          onClick={() => setDocuments((prev) => prev.filter((_, i) => i !== idx))}
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>

                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
                  disabled={saving}
                  onClick={() => sendAction("HIDE")}
                >
                  Masquer
                </button>

                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
                  disabled={saving}
                  onClick={() => sendAction("REACTIVATE")}
                >
                  Réactiver
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
