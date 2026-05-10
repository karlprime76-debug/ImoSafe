"use client";

import { useMemo, useState } from "react";

type GalleryImage = { url: string; alt?: string };

export function PropertyGallery({ images, title }: { images: Array<string | GalleryImage>; title: string }) {
  const list = useMemo<GalleryImage[]>(
    () =>
      images
        .map((img) => (typeof img === "string" ? { url: img } : img))
        .filter((img) => Boolean(img.url)),
    [images]
  );

  const [activeUrl, setActiveUrl] = useState<string>(() => list[0]?.url ?? "");
  const active = list.find((i) => i.url === activeUrl) ?? list[0];

  return (
    <div className="grid gap-3">
      <div className="overflow-hidden rounded-3xl border border-black/10 bg-slate-100 shadow-sm dark:border-white/10 dark:bg-white/10">
        {active?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={active.url} alt={active.alt ?? title} className="h-[260px] w-full object-cover sm:h-[360px]" />
        ) : (
          <div className="flex h-[260px] items-center justify-center text-sm font-semibold text-slate-500 dark:text-white/60 sm:h-[360px]">
            Aucune image
          </div>
        )}
      </div>

      {list.length > 1 ? (
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
          {list.map((img) => (
            <button
              key={img.url}
              type="button"
              className={
                "overflow-hidden rounded-2xl border bg-slate-100 dark:bg-white/10 " +
                (img.url === active?.url ? "border-emerald-500/60" : "border-black/10 dark:border-white/10")
              }
              onClick={() => setActiveUrl(img.url)}
              aria-label="Voir l'image"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt ?? title} className="h-24 w-40 object-cover sm:h-28 sm:w-full" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
