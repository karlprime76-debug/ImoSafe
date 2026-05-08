import { cn } from "@/lib/utils";

export type StatusBadgeTone = "neutral" | "info" | "success" | "warning" | "danger";

const TONES: Record<StatusBadgeTone, string> = {
  neutral: "bg-slate-500/10 text-slate-700 ring-slate-500/20 dark:bg-white/5 dark:text-white/70 dark:ring-white/10",
  info: "bg-blue-600/10 text-blue-800 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-200 dark:ring-blue-400/20",
  success: "bg-emerald-600/10 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:ring-emerald-400/20",
  warning: "bg-amber-600/10 text-amber-900 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-100 dark:ring-amber-400/20",
  danger: "bg-rose-600/10 text-rose-800 ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-200 dark:ring-rose-400/20",
};

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: StatusBadgeTone;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1", TONES[tone], className)}>
      {children}
    </span>
  );
}
