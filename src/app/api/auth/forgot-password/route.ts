import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseRouteClient } from "@/lib/supabaseServer";

const ForgotPasswordSchema = z.object({
  email: z.string().trim().email(),
});

function getBaseUrl(req: Request) {
  const host = req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  if (!host) return null;
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  try {
    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: { code: "INVALID_PAYLOAD", message: "Payload invalide." } },
        { status: 400, headers: { "cache-control": "no-store" } }
      );
    }

    const parsed = ForgotPasswordSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "INVALID_PAYLOAD",
            message: "Payload invalide.",
            issues: parsed.error.flatten(),
          },
        },
        { status: 400, headers: { "cache-control": "no-store" } }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();

    const { supabase, getSetCookieHeaders } = createSupabaseRouteClient(req);

    const baseUrl = getBaseUrl(req);
    const redirectTo = baseUrl ? `${baseUrl}/reset-password` : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(email, redirectTo ? { redirectTo } : undefined);

    // Security: do not reveal whether an account exists.
    // If Supabase errors, we still return a generic message unless config is missing.
    if (error) {
      const msg = (error.message ?? "").toLowerCase();
      if (msg.includes("missing") && msg.includes("redirect")) {
        return NextResponse.json(
          { ok: false, error: { code: "SERVER_ERROR", message: "Configuration invalide." } },
          { status: 500, headers: { "cache-control": "no-store" } }
        );
      }
    }

    const headers = new Headers({ "cache-control": "no-store" });
    for (const c of getSetCookieHeaders()) headers.append("set-cookie", c);

    return NextResponse.json(
      {
        ok: true,
        message: "Si un compte existe pour cet email, un lien de réinitialisation sera envoyé.",
      },
      { headers }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Erreur serveur." } },
      { status: 500, headers: { "cache-control": "no-store" } }
    );
  }
}
