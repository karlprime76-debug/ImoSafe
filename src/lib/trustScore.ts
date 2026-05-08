export type TrustScoreLevel = "VERY_RELIABLE" | "TO_CHECK" | "CAUTION" | "HIGH_RISK";

export function clampTrustScore(score: number) {
  if (Number.isNaN(score)) return 0;
  if (score < 0) return 0;
  if (score > 100) return 100;
  return score;
}

export function trustScoreLevel(score: number): TrustScoreLevel {
  const s = clampTrustScore(score);
  if (s >= 80) return "VERY_RELIABLE";
  if (s >= 60) return "TO_CHECK";
  if (s >= 40) return "CAUTION";
  return "HIGH_RISK";
}

export function trustScoreLabel(score: number) {
  const level = trustScoreLevel(score);
  if (level === "VERY_RELIABLE") return "Très fiable";
  if (level === "TO_CHECK") return "À vérifier";
  if (level === "CAUTION") return "Prudence";
  return "Risque élevé";
}
