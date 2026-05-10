import { createServerClient } from "@supabase/ssr";

type CookieToSet = {
  name: string;
  value: string;
  options?: {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: boolean | "lax" | "strict" | "none";
    secure?: boolean;
  };
};

function parseCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) return [] as Array<{ name: string; value: string }>;
  return cookieHeader
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((part) => {
      const idx = part.indexOf("=");
      if (idx < 0) return { name: part, value: "" };
      return { name: part.slice(0, idx), value: part.slice(idx + 1) };
    });
}

function serializeCookie(c: CookieToSet) {
  const parts: string[] = [];
  parts.push(`${c.name}=${c.value}`);
  const o = c.options;
  if (o?.maxAge != null) parts.push(`Max-Age=${o.maxAge}`);
  if (o?.domain) parts.push(`Domain=${o.domain}`);
  if (o?.path) parts.push(`Path=${o.path}`);
  if (o?.expires) parts.push(`Expires=${o.expires.toUTCString()}`);
  if (o?.httpOnly) parts.push("HttpOnly");
  if (o?.secure) parts.push("Secure");
  if (o?.sameSite) parts.push(`SameSite=${o.sameSite}`);
  return parts.join("; ");
}

export function createSupabaseRouteClient(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase public config missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  const cookieHeader = request.headers.get("cookie");
  const existing = parseCookieHeader(cookieHeader);
  const existingMap = new Map(existing.map((c) => [c.name, c.value] as const));
  const pendingCookies: CookieToSet[] = [];

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        const value = existingMap.get(name);
        if (typeof value !== "string") return null;
        return value;
      },
      set(name: string, value: string, options: CookieToSet["options"]) {
        pendingCookies.push({ name, value, options });
      },
      remove(name: string, options: CookieToSet["options"]) {
        pendingCookies.push({ name, value: "", options: { ...options, maxAge: 0 } });
      },
    },
  });

  return {
    supabase,
    getSetCookieHeaders() {
      return pendingCookies.map(serializeCookie);
    },
  };
}
