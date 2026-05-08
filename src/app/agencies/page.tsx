import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DEMO_AGENCIES } from "@/lib/demoData";

export default function AgenciesPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Agences</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
          Annuaire (démo) des agences et leur statut de vérification.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_AGENCIES.map((a) => (
            <div key={a.id} className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-base font-extrabold tracking-tight">{a.name}</div>
                <div className="text-xs font-semibold text-slate-600 dark:text-white/60">{a.verificationStatus}</div>
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-white/70">{a.city}</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-white/70">{a.address}</div>
              <div className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{a.phone}</div>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
