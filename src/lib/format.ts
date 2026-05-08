export function formatXof(amount: number): string {
  try {
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
  } catch {
    return `${amount} FCFA`;
  }
}
