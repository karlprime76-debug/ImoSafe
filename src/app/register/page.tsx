"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { setMockSession, type MockRole } from "@/lib/mockSession";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<MockRole>("USER");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-md px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Créer un compte</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">MVP: inscription mock (pas de DB).</p>

        <form
          className="mt-6 grid gap-3 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);

            const normalized = email.trim().toLowerCase();
            if (!name.trim()) {
              setError("Nom requis.");
              return;
            }
            if (!normalized.includes("@")) {
              setError("Email invalide.");
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

            setMockSession({
              name: name.trim(),
              email: normalized,
              phone: phone.trim() || undefined,
              role,
              createdAt: new Date().toISOString(),
            });

            router.push("/dashboard");
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

          {error ? <div className="text-sm font-semibold text-rose-700 dark:text-rose-300">{error}</div> : null}

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Créer mon compte
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
