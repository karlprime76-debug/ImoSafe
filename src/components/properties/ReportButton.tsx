import Link from "next/link";

export function ReportButton({ propertyId }: { propertyId: string }) {
  return (
    <Link
      href={`/report-scam?propertyId=${encodeURIComponent(propertyId)}`}
      className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
    >
      Signaler une arnaque
    </Link>
  );
}
