import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function ContactPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Contact</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-white/70">
          Pour les agences/propriétaires (vérification, badge), ou assistance premium.
        </p>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
          <div className="font-semibold">Email</div>
          <div className="mt-1">support@imosafe.example</div>
          <div className="mt-4 text-xs text-slate-500 dark:text-white/50">
            (MVP: contact mock. On branchera un formulaire + email plus tard.)
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
