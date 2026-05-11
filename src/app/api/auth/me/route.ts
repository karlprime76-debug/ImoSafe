import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createSupabaseRouteClient } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  try {
    const { supabase } = createSupabaseRouteClient(req);
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user?.id) {
      return NextResponse.json({ ok: true, user: null }, { headers: { "cache-control": "no-store" } });
    }

    const supaUser = data.user;
    const normalizedEmail = (supaUser.email ?? "").trim().toLowerCase();
    const name =
      (typeof supaUser.user_metadata?.name === "string" && supaUser.user_metadata.name.trim()) ||
      normalizedEmail ||
      "Utilisateur";
    const phone = typeof supaUser.user_metadata?.phone === "string" ? supaUser.user_metadata.phone.trim() : null;
    const role =
      typeof supaUser.user_metadata?.accountType === "string" &&
      ["USER", "OWNER", "AGENCY", "HOST", "ADMIN"].includes(supaUser.user_metadata.accountType)
        ? (supaUser.user_metadata.accountType as "USER" | "OWNER" | "AGENCY" | "HOST" | "ADMIN")
        : "USER";

    try {
      const user = await prisma.user.upsert({
        where: { id: supaUser.id },
        create: {
          id: supaUser.id,
          name,
          email: normalizedEmail || supaUser.id,
          phone,
          role,
          passwordHash: "SUPABASE_AUTH",
        },
        update: {
          name,
          email: normalizedEmail || supaUser.id,
          phone,
          role,
        },
        select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      });

      return NextResponse.json({ ok: true, user }, { headers: { "cache-control": "no-store" } });
    } catch (e) {
      console.error("[auth/me] prisma unavailable", {
        name: e instanceof Error ? e.name : undefined,
        message: e instanceof Error ? e.message : String(e),
      });

      return NextResponse.json(
        {
          ok: true,
          user: {
            id: supaUser.id,
            name,
            email: normalizedEmail,
            phone,
            role,
            createdAt: supaUser.created_at ?? new Date().toISOString(),
          },
        },
        { headers: { "cache-control": "no-store" } }
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR" } },
      { status: 500, headers: { "cache-control": "no-store" } }
    );
  }
}
