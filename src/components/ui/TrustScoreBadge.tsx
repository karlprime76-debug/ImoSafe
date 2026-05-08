import { cn } from "@/lib/utils";
import { clampTrustScore, trustScoreLabel, trustScoreLevel } from "@/lib/trustScore";

export function TrustScoreBadge({ score, className }: { score: number; className?: string }) {
  const safeScore = clampTrustScore(score);
  const level = trustScoreLevel(safeScore);

  const toneClass =
    level === "VERY_RELIABLE"
      ? "bg-emerald-600/10 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:ring-emerald-400/20"
      : level === "TO_CHECK"
        ? "bg-blue-600/10 text-blue-800 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-200 dark:ring-blue-400/20"
        : level === "CAUTION"
          ? "bg-amber-600/10 text-amber-900 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-100 dark:ring-amber-400/20"
          : "bg-rose-600/10 text-rose-800 ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-200 dark:ring-rose-400/20";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1",
        toneClass,
        className,
      )}
      title="Ce score est un indicateur d’aide à la décision, pas une garantie."
    >
      <span className="font-extrabold">{safeScore}</span>
      <span className="opacity-80">•</span>
      <span>{trustScoreLabel(safeScore)}</span>
    </span>
  );
}
