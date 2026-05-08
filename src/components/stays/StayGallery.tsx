export function StayGallery({ images, title }: { images: string[]; title: string }) {
  const primary = images[0] ?? "";
  const rest = images.slice(1, 5);

  return (
    <div className="grid gap-3">
      <div className="overflow-hidden rounded-3xl border border-black/10 bg-slate-100 shadow-sm dark:border-white/10 dark:bg-white/10">
        {primary ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={primary} alt={title} className="h-[260px] w-full object-cover sm:h-[360px]" />
        ) : null}
      </div>

      {rest.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {rest.map((src) => (
            <div
              key={src}
              className="overflow-hidden rounded-2xl border border-black/10 bg-slate-100 dark:border-white/10 dark:bg-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={title} className="h-24 w-full object-cover sm:h-28" loading="lazy" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
