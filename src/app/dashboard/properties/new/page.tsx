"use client";

import Link from "next/link";
import { useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { addDraftProperty } from "@/lib/mockDataStore";

export default function NewPropertyPage() {
  const [done, setDone] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState<"RENT" | "SALE">("RENT");
  const [type, setType] = useState<"HOUSE" | "APARTMENT" | "LAND" | "OFFICE" | "SHOP" | "WAREHOUSE">("APARTMENT");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("Cotonou");
  const [neighborhood, setNeighborhood] = useState("");
  const [images, setImages] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/dashboard" className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
          ← Retour dashboard
        </Link>

        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Publier un bien (MVP)</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
          MVP: formulaire mock (URL photos). Ensuite: stockage + vérification admin.
        </p>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          {done ? (
            <div className="rounded-2xl border border-emerald-600/20 bg-emerald-500/10 p-4 text-sm text-emerald-950 ring-1 ring-emerald-600/20 dark:border-emerald-400/20 dark:text-emerald-100 dark:ring-emerald-400/20">
              Annonce enregistrée en brouillon localement — branchement DB bientôt.
            </div>
          ) : (
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                const parsedPrice = Number(price);
                const parsedBedrooms = bedrooms ? Number(bedrooms) : undefined;
                const parsedBathrooms = bathrooms ? Number(bathrooms) : undefined;
                const parsedArea = area ? Number(area) : undefined;

                addDraftProperty({
                  title: title.trim(),
                  description: description.trim(),
                  type,
                  transactionType,
                  price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
                  city: city.trim(),
                  neighborhood: neighborhood.trim() || undefined,
                  images: images
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  bedrooms: Number.isFinite(parsedBedrooms) ? parsedBedrooms : undefined,
                  bathrooms: Number.isFinite(parsedBathrooms) ? parsedBathrooms : undefined,
                  area: Number.isFinite(parsedArea) ? parsedArea : undefined,
                });
                setDone(true);
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
                    placeholder="250000"
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

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Chambres</label>
                  <input
                    inputMode="numeric"
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Douches</label>
                  <input
                    inputMode="numeric"
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Surface (m²)</label>
                  <input
                    inputMode="numeric"
                    className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    value={area}
                    onChange={(e) => setArea(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="90"
                  />
                </div>
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

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Photos (URLs séparées par des virgules)</label>
                <input
                  className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                  placeholder="https://... , https://..."
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Publier
              </button>

              <div className="text-xs text-slate-500 dark:text-white/50">
                Conseil: ImoSafe affichera “En vérification” jusqu’à validation.
              </div>
            </form>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
