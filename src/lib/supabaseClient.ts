export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase public config missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return { url, anonKey };
}

function sanitizeFilename(name: string) {
  const trimmed = name.trim();
  const parts = trimmed.split(/[/\\]+/g);
  const base = parts[parts.length - 1] ?? "file";
  return base
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

function encodePath(path: string) {
  return path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

export function buildStoragePath(params: {
  userId: string;
  fileName: string;
  folderPrefix?: string;
  now?: Date;
}) {
  const now = params.now ?? new Date();
  const ts = now.getTime();
  const safeName = sanitizeFilename(params.fileName || "image");
  const prefix = params.folderPrefix ? params.folderPrefix.replace(/^\/+|\/+$/g, "") + "/" : "";
  return `${prefix}${params.userId}/${ts}-${safeName}`;
}

export async function uploadImageToSupabaseStorage(params: {
  bucket: string;
  path: string;
  file: File;
  upsert?: boolean;
}) {
  const { url, anonKey } = getSupabasePublicConfig();

  const endpoint = `${url.replace(/\/+$/g, "")}/storage/v1/object/${encodeURIComponent(params.bucket)}/${encodePath(
    params.path
  )}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
      "Content-Type": params.file.type || "application/octet-stream",
      "x-upsert": params.upsert ? "true" : "false",
    },
    body: params.file,
  });

  if (!res.ok) {
    let message = "Upload failed";
    try {
      const data = (await res.json()) as { message?: string; error?: string };
      message = data?.message || data?.error || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const publicUrl = `${url.replace(/\/+$/g, "")}/storage/v1/object/public/${encodeURIComponent(
    params.bucket
  )}/${params.path}`;

  return {
    path: params.path,
    publicUrl,
  };
}
