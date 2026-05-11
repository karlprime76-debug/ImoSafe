"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { createClient } from "@supabase/supabase-js";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

function getHashParam(name: string) {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
  const params = new URLSearchParams(hash);
  return params.get(name);
}

export default function ResetPasswordPage() {
  const router = useRouter();

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return null;
    return createClient(url, anonKey);
  }, []);

  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        if (!supabase) {
          setHasSession(false);
          return;
        }

        const accessToken = getHashParam("access_token");
        const refreshToken = getHashParam("refresh_token");

        if (accessToken && refreshToken) {
          await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        }

        const { data } = await supabase.auth.getSession();
        if (cancelled) return;

        setHasSession(Boolean(data.session));
      } catch {
        if (cancelled) return;
        setHasSession(false);
      } finally {
        if (cancelled) return;
        setReady(true);
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-md px-4 py-10 pb-24 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Réinitialiser le mot de passe</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
          Choisis un nouveau mot de passe. Pour des raisons de sécurité, tu devras peut-être te reconnecter après.
        </p>

        {!ready ? (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            Chargement...
          </div>
        ) : !supabase ? (
          <div className="mt-6 rounded-3xl border border-rose-600/20 bg-rose-500/10 p-6 text-sm text-rose-950 ring-1 ring-rose-600/20 dark:border-rose-400/20 dark:text-rose-100 dark:ring-rose-400/20">
            <div className="font-extrabold">Configuration manquante</div>
            <div className="mt-2">
              La configuration Supabase n’est pas définie. Contacte l’équipe ImoSafe ou réessaie plus tard.
            </div>
          </div>
        ) : !hasSession ? (
          <div className="mt-6 rounded-3xl border border-amber-600/20 bg-amber-500/10 p-6 text-sm text-amber-950 ring-1 ring-amber-600/20 dark:border-amber-400/20 dark:text-amber-100 dark:ring-amber-400/20">
            <div className="font-extrabold">Lien invalide ou expiré</div>
            <div className="mt-2">
              Retourne à la page{" "}
              <Link href="/forgot-password" className="font-semibold underline">
                Mot de passe oublié
              </Link>
              {" "}pour demander un nouveau lien.
            </div>
          </div>
        ) : (
          <form
            className="mt-6 grid gap-3 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setSuccess(null);

              if (!supabase) {
                setError("Configuration manquante.");
                return;
              }

              if (password.trim().length < 6) {
                setError("Mot de passe trop court (min 6).");
                return;
              }
              if (password !== confirmPassword) {
                setError("Les mots de passe ne correspondent pas.");
                return;
              }

              try {
                setLoading(true);
                const { error: updateError } = await supabase.auth.updateUser({ password });
                if (updateError) {
                  setError("Impossible de mettre à jour le mot de passe.");
                  return;
                }

                setSuccess("Mot de passe mis à jour. Tu peux maintenant te connecter.");
                router.push("/login");
              } catch {
                setError("Erreur serveur.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Nouveau mot de passe</label>
              <input
                type="password"
                className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Confirmer le mot de passe</label>
              <input
                type="password"
                className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error ? <div className="text-sm font-semibold text-rose-700 dark:text-rose-300">{error}</div> : null}
            {success ? <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{success}</div> : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </button>
          </form>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
