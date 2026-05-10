import { NextResponse } from "next/server";

import { createSupabaseRouteClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { supabase, getSetCookieHeaders } = createSupabaseRouteClient(req);

    await supabase.auth.signOut();

    const headers = new Headers({ "cache-control": "no-store" });
    for (const c of getSetCookieHeaders()) headers.append("set-cookie", c);

    return NextResponse.json({ ok: true }, { headers });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR" } }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
