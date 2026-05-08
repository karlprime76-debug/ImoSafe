import type { VerificationStatus } from "@/lib/demoData";

import { StatusBadge } from "@/components/ui/StatusBadge";

export function AgencyVerificationBadge({ status }: { status: VerificationStatus }) {
  if (status === "VERIFIED") return <StatusBadge tone="success">Agence vérifiée</StatusBadge>;
  if (status === "PENDING") return <StatusBadge tone="info">En cours de vérification</StatusBadge>;
  if (status === "SUSPICIOUS") return <StatusBadge tone="warning">Agence suspecte</StatusBadge>;
  if (status === "REJECTED") return <StatusBadge tone="danger">Agence rejetée</StatusBadge>;
  return <StatusBadge tone="neutral">Agence non vérifiée</StatusBadge>;
}
