"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useMockSession } from "@/lib/useMockSession";

function itemClass(active: boolean) {
  return active
    ? "text-emerald-700 dark:text-emerald-300"
    : "text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white";
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const session = useMockSession();

  const accountHref = session ? "/dashboard" : "/login";

  const items = [
    { href: "/", label: "Accueil" },
    { href: "/properties", label: "Biens" },
    { href: "/stays", label: "Séjours" },
    { href: "/report-scam", label: "Signaler" },
    { href: accountHref, label: "Compte" },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/40 sm:hidden">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {items.map((it) => {
          const active = pathname === it.href || (it.href !== "/" && pathname.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex w-full flex-col items-center justify-center gap-1 py-1 text-[11px] font-semibold ${itemClass(active)}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" style={{ opacity: active ? 1 : 0.15 }} />
              <span className="truncate">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
