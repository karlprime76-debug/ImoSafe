import Link from "next/link";

import { IMOSAFE_CONTACT } from "@/lib/imosafeContact";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/30">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 text-sm text-slate-700 dark:text-white/70 sm:grid-cols-3 sm:px-6">
        <div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">{IMOSAFE_CONTACT.brandName}</div>
          <div className="mt-2 text-xs">
            Plateforme d’annonces immobilières orientée confiance : annonces vérifiées, agences fiables et signalements.
          </div>
          <div className="mt-3 text-xs">
            Contact: <span className="font-semibold">{IMOSAFE_CONTACT.email}</span>
          </div>
        </div>

        <div className="grid gap-2">
          <div className="text-xs font-bold text-slate-900 dark:text-white">Découvrir</div>
          <Link className="hover:underline" href="/properties">
            Biens
          </Link>
          <Link className="hover:underline" href="/partners">
            Partenaires
          </Link>
          <Link className="hover:underline" href="/agencies">
            Agences
          </Link>
          <Link className="hover:underline" href="/pricing">
            Premium
          </Link>
        </div>

        <div className="grid gap-2">
          <div className="text-xs font-bold text-slate-900 dark:text-white">Sécurité</div>
          <Link className="hover:underline" href="/report-scam">
            Signaler une arnaque
          </Link>
          <Link className="hover:underline" href="/safety-rules">
            Règles de sécurité
          </Link>
          <Link className="hover:underline" href="/about">
            À propos
          </Link>
          <Link className="hover:underline" href="/contact">
            Contact
          </Link>
          <Link className="hover:underline" href="/payment-manual">
            Activation manuelle
          </Link>
          <Link className="hover:underline" href="/terms">
            Conditions
          </Link>
          <Link className="hover:underline" href="/privacy">
            Confidentialité
          </Link>
        </div>

        <div className="text-xs text-slate-500 dark:text-white/50 sm:col-span-3">
          © {new Date().getFullYear()} ImoSafe. Ne payez jamais avant d’avoir visité et vérifié.
        </div>
      </div>
    </footer>
  );
}
