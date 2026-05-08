"use client";

import { useEffect, useState } from "react";

import { getFavorites, toggleFavorite } from "@/lib/mockDataStore";

export function FavoriteButton({ propertyId }: { propertyId: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const read = () => {
      const favs = getFavorites();
      setOn(favs.propertyIds.includes(propertyId));
    };
    read();
    window.addEventListener("imosafe:favorites", read);
    return () => window.removeEventListener("imosafe:favorites", read);
  }, [propertyId]);

  return (
    <button
      type="button"
      className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
      onClick={() => {
        const next = toggleFavorite(propertyId);
        setOn(next.propertyIds.includes(propertyId));
      }}
    >
      {on ? "★ Ajouté aux favoris" : "☆ Ajouter aux favoris"}
      <span className="sr-only">{propertyId}</span>
    </button>
  );
}
