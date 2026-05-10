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

    const user = await prisma.user.findUnique({
      where: { id: data.user.id },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, user }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR" } },
      { status: 500, headers: { "cache-control": "no-store" } }
    );
  }
}
