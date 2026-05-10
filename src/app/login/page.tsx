"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import type { MockRole } from "@/lib/mockSession";

type LoginSuccess = {
  ok: true;
  user: { id: string; name: string; email: string; phone?: string | null; role: MockRole; createdAt: string };
};

type LoginError = {
  ok: false;
  error?: { code?: string; message?: string };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-md px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Connexion</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">MVP: connexion mock (pas de DB).</p>

        <form
          className="mt-6 grid gap-3 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);

            const normalized = email.trim().toLowerCase();
            if (!normalized.includes("@")) {
              setError("Email invalide.");
              return;
            }
            if (password.trim().length < 6) {
              setError("Mot de passe trop court (min 6).");
              return;
            }

            try {
              setLoading(true);
              const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ email: normalized, password }),
              });

              const data = (await res.json()) as LoginSuccess | LoginError;

              if (!res.ok || !data.ok) {
                const code = data.ok ? undefined : data.error?.code;
                if (code === "ACCOUNT_NOT_FOUND") {
                  setError("Aucun compte trouvé.");
                } else if (code === "INVALID_PASSWORD") {
                  setError("Mot de passe incorrect.");
                } else if (code === "INVALID_PAYLOAD") {
                  setError("Informations invalides.");
                } else {
                  setError((data.ok ? undefined : data.error?.message) || "Erreur serveur.");
                }
                return;
              }

              void data.user;
              router.push("/dashboard");
            } catch {
              setError("Erreur serveur.");
            } finally {
              setLoading(false);
            }
          }}
        >
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Email</label>
            <input
              type="email"
              className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: nom@gmail.com"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Mot de passe</label>
            <input
              type="password"
              className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error ? <div className="text-sm font-semibold text-rose-700 dark:text-rose-300">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <div className="text-sm text-slate-600 dark:text-white/70">
            Pas de compte ?{" "}
            <Link href="/register" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
              Créer un compte
            </Link>
          </div>
        </form>
      </main>

      <SiteFooter />
    </div>
  );
}
