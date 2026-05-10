"use client";

import { useEffect, useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuthMe } from "@/lib/useAuthMe";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "USER" | "OWNER" | "AGENCY" | "HOST" | "ADMIN";
  createdAt: string;
};

type UsersSuccess = { ok: true; users: AdminUser[] };

type UsersError = { ok: false; error?: { code?: string; message?: string } };

function roleTone(role: AdminUser["role"]) {
  if (role === "ADMIN") return "info" as const;
  if (role === "AGENCY") return "warning" as const;
  if (role === "OWNER") return "success" as const;
  if (role === "HOST") return "success" as const;
  return "neutral" as const;
}

export default function AdminUsersPage() {
  const { user: session } = useAuthMe();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canView = session?.role === "ADMIN";

  useEffect(() => {
    if (!canView) return;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/admin/users", {
          cache: "no-store",
        });

        const data = (await res.json()) as UsersSuccess | UsersError;
        if (!res.ok || !data.ok) {
          const code = data.ok ? undefined : data.error?.code;
          if (code === "FORBIDDEN" || code === "UNAUTHORIZED") {
            setError("Accès réservé à l’équipe ImoSafe.");
          } else {
            setError((data.ok ? undefined : data.error?.message) || "Erreur serveur.");
          }
          setUsers([]);
          return;
        }

        setUsers(data.users);
      } catch {
        setError("Erreur serveur.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [canView, session?.id]);

  const rows = useMemo(() => users ?? [], [users]);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Utilisateurs</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/70">Administration ImoSafe (base réelle).</p>
          </div>

          <div className="flex items-center gap-2">
            {session?.role ? <StatusBadge tone={roleTone(session.role as AdminUser["role"])}>{session.role}</StatusBadge> : null}
          </div>
        </div>

        {!canView ? (
          <div className="mt-6 rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
            <div className="font-extrabold">Accès réservé à l’équipe ImoSafe</div>
            <div className="mt-2">Connecte-toi avec un compte administrateur pour afficher les utilisateurs.</div>
          </div>
        ) : (
          <>
            {error ? <div className="mt-6 text-sm font-semibold text-rose-700 dark:text-rose-300">{error}</div> : null}

            <div className="mt-6 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="grid grid-cols-1 gap-2 border-b border-black/10 p-4 text-xs font-semibold text-slate-600 dark:border-white/10 dark:text-white/60 sm:grid-cols-12">
                <div className="sm:col-span-3">Nom</div>
                <div className="sm:col-span-3">Email</div>
                <div className="sm:col-span-2">Téléphone</div>
                <div className="sm:col-span-2">Rôle</div>
                <div className="sm:col-span-2">Inscription</div>
              </div>

              {loading ? (
                <div className="p-6 text-sm text-slate-700 dark:text-white/70">Chargement...</div>
              ) : rows.length ? (
                <div className="divide-y divide-black/10 dark:divide-white/10">
                  {rows.map((u) => (
                    <div
                      key={u.id}
                      className="grid grid-cols-1 gap-2 p-4 text-sm text-slate-900 dark:text-white sm:grid-cols-12"
                    >
                      <div className="sm:col-span-3">
                        <div className="font-semibold">{u.name}</div>
                      </div>
                      <div className="break-all text-slate-700 dark:text-white/70 sm:col-span-3">{u.email}</div>
                      <div className="text-slate-700 dark:text-white/70 sm:col-span-2">{u.phone || "—"}</div>
                      <div className="sm:col-span-2">
                        <StatusBadge tone={roleTone(u.role)}>{u.role}</StatusBadge>
                      </div>
                      <div className="text-slate-700 dark:text-white/70 sm:col-span-2">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-sm text-slate-700 dark:text-white/70">Aucun utilisateur.</div>
              )}
            </div>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
