import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createSupabaseRouteClient } from "@/lib/supabaseServer";

export function jsonError(status: number, code: string) {
  return NextResponse.json({ ok: false, error: { code } }, { status, headers: { "cache-control": "no-store" } });
}

export async function requireSessionId(request: Request) {
  const { supabase } = createSupabaseRouteClient(request);
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.id) return { ok: false as const, res: jsonError(401, "UNAUTHORIZED") };
  return { ok: true as const, sessionId: data.user.id };
}

export async function requireAdmin(request: Request) {
  const auth = await requireSessionId(request);
  if (!auth.ok) return auth;

  const user = await prisma.user.findUnique({ where: { id: auth.sessionId }, select: { id: true, role: true } });
  if (!user) return { ok: false as const, res: jsonError(401, "UNAUTHORIZED") };
  if (user.role !== "ADMIN") return { ok: false as const, res: jsonError(403, "FORBIDDEN") };

  return { ok: true as const, adminId: user.id };
}

export async function getOptionalUser(request: Request) {
  const { supabase } = createSupabaseRouteClient(request);
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.id) return null;
  return prisma.user.findUnique({ where: { id: data.user.id }, select: { id: true, role: true } });
}
