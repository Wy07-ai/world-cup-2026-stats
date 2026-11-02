/**
 * Skeleton halaman Grup: meniru tata letak asli (judul, tab sticky, tabel
 * klasemen, daftar laga, tabel Best 3rd). Acuan PRD Bab 5.4 (Skeleton Loading,
 * bukan spinner).
 */
import { Skeleton, SkeletonTableRows } from "@/components/ui/Skeleton";
import { t } from "@/content/microcopy";

export default function GroupsLoading() {
  return (
    <div role="status" aria-label={t("aria.loading")} className="flex min-w-0 flex-col gap-8">
      <span className="sr-only">{t("aria.loading")}</span>

      <div aria-hidden="true" className="flex flex-col gap-3">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      {/* Tab Grup A-L */}
      <div aria-hidden="true" className="flex gap-1 overflow-hidden border-b border-line pb-2">
        {Array.from({ length: 12 }, (_, i) => (
          <Skeleton key={i} className="h-9 w-16 shrink-0" />
        ))}
      </div>

      {/* Tabel klasemen + laga */}
      <div aria-hidden="true" className="flex flex-col gap-6">
        <div className="rounded-xl border border-line bg-surface p-3">
          <Skeleton className="mb-2 h-8 w-full" />
          <SkeletonTableRows rows={4} columns={8} />
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>

      {/* Best 3rd */}
      <div aria-hidden="true" className="flex flex-col gap-3">
        <Skeleton className="h-7 w-48" />
        <div className="rounded-xl border border-line bg-surface p-3">
          <SkeletonTableRows rows={6} columns={6} />
        </div>
      </div>
    </div>
  );
}
