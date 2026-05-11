import { NextResponse } from "next/server";

function looksLikeSupabaseUrl(url: string) {
  let parsed: URL | null = null;
  try {
    parsed = new URL(url);
  } catch {
    parsed = null;
  }
  if (!parsed) return { valid: false, host: null as string | null };
  const protocolOk = parsed.protocol === "https:" || parsed.protocol === "http:";
  const host = parsed.host || null;
  const hostLooksSupabase = typeof host === "string" ? host.includes("supabase") : false;
  return { valid: protocolOk && Boolean(host), host, hostLooksSupabase };
}

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        accept: "application/json",
      },
    });
    return { ok: true as const, res };
  } catch (e) {
    return { ok: false as const, error: e };
  } finally {
    clearTimeout(t);
  }
}

export async function GET() {
  const urlRaw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKeyRaw = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const url = typeof urlRaw === "string" ? urlRaw.trim() : "";
  const anonKey = typeof anonKeyRaw === "string" ? anonKeyRaw.trim() : "";

  const supabaseUrlConfigured = Boolean(url);
  const supabaseAnonKeyConfigured = Boolean(anonKey);

  const urlCheck = url ? looksLikeSupabaseUrl(url) : { valid: false, host: null as string | null, hostLooksSupabase: false };

  const healthUrl = urlCheck.valid ? `${url.replace(/\/+$/g, "")}/auth/v1/health` : null;

  let authEndpointReachable = false;
  let authEndpointStatus: number | null = null;
  let message = "";
  let errorName: string | null = null;

  if (!supabaseUrlConfigured || !supabaseAnonKeyConfigured) {
    message = "Supabase config missing.";
  } else if (!urlCheck.valid) {
    message = "Supabase URL invalid.";
  } else if (!healthUrl) {
    message = "Health URL unavailable.";
  } else {
    const res = await fetchWithTimeout(healthUrl, 5000);
    if (!res.ok) {
      const e = res.error as unknown;
      errorName = e instanceof Error ? e.name : "UnknownError";
      message = e instanceof Error ? e.message : "fetch failed";
    } else {
      authEndpointStatus = res.res.status;
      authEndpointReachable = res.res.ok;
      message = res.res.ok ? "Supabase Auth reachable." : "Supabase Auth returned non-OK.";
    }
  }

  return NextResponse.json(
    {
      ok: supabaseUrlConfigured && supabaseAnonKeyConfigured && urlCheck.valid && authEndpointReachable,
      supabaseUrlConfigured,
      supabaseAnonKeyConfigured,
      supabaseUrlLooksValid: Boolean(urlCheck.valid),
      supabaseHost: urlCheck.host,
      authEndpointReachable,
      authEndpointStatus,
      errorName,
      message,
    },
    { headers: { "cache-control": "no-store" } }
  );
}
