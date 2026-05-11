import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
  const hasSupabaseCo = typeof host === "string" ? host.includes(".supabase.co") : false;
  const sanitizedHost =
    typeof host === "string" && host.includes(".supabase.co")
      ? host.slice(0, host.indexOf(".supabase.co") + ".supabase.co".length)
      : host;
  return {
    valid: protocolOk && Boolean(host) && hasSupabaseCo,
    host: sanitizedHost,
    hostLooksSupabase: hasSupabaseCo,
  };
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
  let supabaseClientCreatable = false;

  if (!supabaseUrlConfigured || !supabaseAnonKeyConfigured) {
    message = "Supabase config missing.";
  } else if (!urlCheck.valid) {
    message = "Supabase URL invalid.";
  } else if (!healthUrl) {
    message = "Health URL unavailable.";
  } else {
    try {
      createClient(url, anonKey);
      supabaseClientCreatable = true;
    } catch {
      supabaseClientCreatable = false;
    }

    const res = await fetchWithTimeout(healthUrl, 5000);
    if (!res.ok) {
      const e = res.error as unknown;
      errorName = e instanceof Error ? e.name : "UnknownError";
      message = e instanceof Error ? e.message : "fetch failed";
    } else {
      authEndpointStatus = res.res.status;
      authEndpointReachable = true;
      if (res.res.status === 401) {
        message = "Supabase Auth endpoint reachable; status 401 indicates it requires auth or headers.";
      } else if (res.res.ok) {
        message = "Supabase Auth reachable.";
      } else {
        message = "Supabase Auth endpoint reachable but returned non-OK.";
      }
    }
  }

  return NextResponse.json(
    {
      ok: supabaseUrlConfigured && supabaseAnonKeyConfigured && urlCheck.valid && authEndpointReachable,
      supabaseUrlConfigured,
      supabaseAnonKeyConfigured,
      supabaseUrlLooksValid: Boolean(urlCheck.valid),
      supabaseHost: urlCheck.host,
      supabaseClientCreatable,
      authEndpointReachable,
      authEndpointStatus,
      errorName,
      message,
    },
    { headers: { "cache-control": "no-store" } }
  );
}
