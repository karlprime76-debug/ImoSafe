import type { VerificationStatus } from "@/lib/demoData";

import { StatusBadge } from "@/components/ui/StatusBadge";

const LABELS: Record<VerificationStatus, string> = {
  NOT_VERIFIED: "Non vérifié",
  PENDING: "En vérification",
  VERIFIED: "Vérifié ImoSafe",
  REJECTED: "Rejeté",
  SUSPICIOUS: "Suspect",
};

export function VerificationBadge({ status, className }: { status: VerificationStatus; className?: string }) {
  if (status === "VERIFIED") return <StatusBadge className={className} tone="success">{LABELS[status]}</StatusBadge>;
  if (status === "PENDING") return <StatusBadge className={className} tone="info">{LABELS[status]}</StatusBadge>;
  if (status === "SUSPICIOUS") return <StatusBadge className={className} tone="warning">{LABELS[status]}</StatusBadge>;
  if (status === "REJECTED") return <StatusBadge className={className} tone="danger">{LABELS[status]}</StatusBadge>;
  return <StatusBadge className={className} tone="neutral">{LABELS[status]}</StatusBadge>;
}
