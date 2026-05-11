"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import type { MockRole } from "@/lib/mockSession";

type RegisterSuccess = {
  ok: true;
  user: { id: string; name: string; email: string; phone?: string | null; role: MockRole; createdAt: string };
};

type RegisterError = {
  ok: false;
  error?: { code?: string; message?: string };
};

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<MockRole>("USER");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-md px-4 py-10 pb-24 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Créer un compte</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">MVP: inscription mock (pas de DB).</p>

        <form
          className="mt-6 grid gap-3 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setErrorCode(null);

            const normalized = email.trim().toLowerCase();
            if (!name.trim()) {
              setError("Nom requis.");
              return;
            }
            if (!normalized.includes("@")) {
              setError("Email invalide.");
              return;
            }
            if (!phone.trim()) {
              setError("Téléphone requis.");
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
              const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  name,
                  email: normalized,
                  phone,
                  accountType: role,
                  password,
                  confirmPassword,
                }),
              });

              let data: RegisterSuccess | RegisterError | null = null;
              try {
                data = (await res.json()) as RegisterSuccess | RegisterError;
              } catch {
                data = null;
              }

              if (!res.ok || !data || !data.ok) {
                const code = data && !data.ok ? data.error?.code : undefined;
                setErrorCode(code ?? null);
                if (code === "EMAIL_IN_USE") {
                  setError("Email déjà utilisé.");
                } else if (code === "INVALID_PAYLOAD") {
                  setError("Informations invalides.");
                } else {
                  setError((data && !data.ok ? data.error?.message : undefined) || "Erreur serveur.");
                }
                return;
              }

              void data.user;
              router.push("/dashboard");
            } catch {
              setErrorCode("SERVER_ERROR");
              setError("Erreur serveur.");
            } finally {
              setLoading(false);
            }
          }}
        >
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Nom</label>
            <input
              className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Karim Dossou"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Email</label>
            <input
              type="email"
              className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pro@entreprise.com"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Téléphone</label>
            <input
              className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+229 ..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-white/70">Type de compte</label>
            <select
              className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-black/20 dark:text-white"
              value={role}
              onChange={(e) => setRole(e.target.value as MockRole)}
            >
              <option value="USER">Utilisateur</option>
              <option value="OWNER">Propriétaire</option>
              <option value="AGENCY">Agence</option>
              <option value="HOST">Hôte séjour</option>
            </select>
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

          {error ? (
            <div className="text-sm font-semibold text-rose-700 dark:text-rose-300">
              {errorCode ? <span className="mr-2 inline-flex rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-extrabold">{errorCode}</span> : null}
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>

          <div className="text-sm text-slate-600 dark:text-white/70">
            Déjà un compte ?{" "}
            <Link href="/login" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
              Se connecter
            </Link>
          </div>
        </form>
      </main>

      <SiteFooter />
    </div>
  );
}
