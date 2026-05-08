import { formatXof } from "@/lib/format";

export function PriceTag({ amount }: { amount: number }) {
  return <div className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{formatXof(amount)}</div>;
}
