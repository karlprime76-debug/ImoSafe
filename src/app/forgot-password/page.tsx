"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { IMOSAFE_CONTACT } from "@/lib/imosafeContact";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const whatsappHref = useMemo(() => IMOSAFE_CONTACT.whatsappUrl, []);

  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-md px-4 py-10 pb-24 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Mot de passe oublié</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
          Entrez votre email ou contactez ImoSafe pour récupérer votre accès.
        </p>

        <form
          className="mt-6 grid gap-3 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
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

          {submitted ? (
            <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Demande reçue. L’équipe ImoSafe vous contactera pour la réinitialisation.
            </div>
          ) : null}

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#0B2A4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Envoyer la demande
          </button>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Contacter ImoSafe sur WhatsApp
          </a>

          <div className="text-sm text-slate-600 dark:text-white/70">
            Retour à la{" "}
            <Link href="/login" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
              connexion
            </Link>
            .
          </div>
        </form>
      </main>

      <SiteFooter />
    </div>
  );
}
