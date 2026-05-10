"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { buildStoragePath, uploadImageToSupabaseStorage } from "@/lib/supabaseClient";

type ImageItem = {
  url: string;
  alt?: string;
};

export function ImageUploader({
  bucket,
  value,
  onChange,
  maxFiles = 8,
  folderPrefix,
  userId,
}: {
  bucket: string;
  value: ImageItem[];
  onChange: (next: ImageItem[]) => void;
  maxFiles?: number;
  folderPrefix?: string;
  userId?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canAddMore = value.length < maxFiles;

  const previews = useMemo(() => {
    return value.map((v) => ({
      url: v.url,
      alt: v.alt,
    }));
  }, [value]);

  const removeAt = useCallback(
    (idx: number) => {
      onChange(value.filter((_, i) => i !== idx));
    },
    [onChange, value]
  );

  const makePrimary = useCallback(
    (idx: number) => {
      onChange([value[idx]!, ...value.filter((_, i) => i !== idx)]);
    },
    [onChange, value]
  );

  const onPickFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      setError(null);

      if (!userId) {
        setError("Utilisateur introuvable. Reconnecte-toi puis réessaie.");
        return;
      }

      const existingCount = value.length;
      const remaining = Math.max(0, maxFiles - existingCount);
      const picked = Array.from(files).slice(0, remaining);
      if (!picked.length) return;

      const invalid = picked.find((f) => !f.type.startsWith("image/"));
      if (invalid) {
        setError("Seules les images sont autorisées.");
        return;
      }

      const tooBig = picked.find((f) => f.size > 5 * 1024 * 1024);
      if (tooBig) {
        setError("Image trop lourde (max 5 MB).");
        return;
      }

      setUploading(true);
      try {
        const next = [...value];
        for (const file of picked) {
          const path = buildStoragePath({ userId, fileName: file.name, folderPrefix });
          const { publicUrl } = await uploadImageToSupabaseStorage({
            bucket,
            path,
            file,
            upsert: false,
          });
          next.push({ url: publicUrl });
        }
        onChange(next);

        if (inputRef.current) inputRef.current.value = "";
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Upload impossible.";
        setError(msg || "Upload impossible.");
      } finally {
        setUploading(false);
      }
    },
    [bucket, folderPrefix, maxFiles, onChange, userId, value]
  );

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => void onPickFiles(e.target.files)}
          disabled={!canAddMore || uploading}
        />

        <button
          type="button"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
          onClick={() => inputRef.current?.click()}
          disabled={!canAddMore || uploading}
        >
          {uploading ? "Upload..." : "Ajouter des photos"}
        </button>

        <div className="text-xs text-slate-600 dark:text-white/60">
          {value.length}/{maxFiles} • max 5MB • images uniquement
        </div>
      </div>

      {error ? <div className="text-sm font-semibold text-rose-700 dark:text-rose-300">{error}</div> : null}

      {previews.length ? (
        <div className="grid gap-3">
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-slate-100 shadow-sm dark:border-white/10 dark:bg-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previews[0]!.url} alt={previews[0]!.alt ?? "Photo"} className="h-[220px] w-full object-cover sm:h-[320px]" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {previews.map((img, idx) => (
              <div key={img.url} className="rounded-2xl border border-black/10 bg-white p-2 dark:border-white/10 dark:bg-white/5">
                <button
                  type="button"
                  className="block w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-white/10"
                  onClick={() => makePrimary(idx)}
                  aria-label={idx === 0 ? "Image principale" : "Définir comme principale"}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt ?? "Photo"} className="h-20 w-full object-cover" loading="lazy" />
                </button>

                <button
                  type="button"
                  className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-xl bg-rose-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:opacity-95"
                  onClick={() => removeAt(idx)}
                  disabled={uploading}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>

          <div className="text-xs text-slate-600 dark:text-white/60">La première image est l’image principale.</div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-black/15 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/15 dark:bg-black/20 dark:text-white/60">
          Aucune image.
        </div>
      )}
    </div>
  );
}
