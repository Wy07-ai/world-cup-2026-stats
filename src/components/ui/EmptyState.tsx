/**
 * EmptyState (Server Component: murni tampilan; aksi disuplai pemanggil).
 *
 * Acuan PRD: Bab 5.4 (Empty State): ilustrasi ikonik (peluit) dan pesan ramah
 * agar aplikasi tidak terkesan rusak. Lucide memiliki ikon `Whistle`, jadi
 * tidak perlu SVG inline.
 *
 * Komponen ini generik: teks (mis. "Pemain tidak ditemukan di daftar skuad
 * 2026.") berasal dari microcopy di pemanggil, bukan ditulis di sini.
 */
import { Whistle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  /** Judul pesan. Wajib. */
  title: string;
  /** Pesan pendukung (mis. saran tindakan). */
  message?: string;
  /** Ikon pengganti. Bawaan: peluit. Dekoratif (aria-hidden). */
  icon?: ReactNode;
  /** Aksi opsional, mis. `<Button>Atur ulang filter</Button>`. */
  action?: ReactNode;
  /** Tingkat heading untuk judul. Bawaan: "h3". */
  headingAs?: "h2" | "h3" | "h4";
  className?: string;
}

export function EmptyState({
  title,
  message,
  icon,
  action,
  headingAs: Heading = "h3",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col items-center justify-center rounded-xl border border-dashed border-line-strong bg-surface px-4 py-10 text-center md:py-12",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-full bg-surface-muted text-accent-cyan-ink"
      >
        {icon ?? <Whistle className="size-8" strokeWidth={1.75} />}
      </div>
      <Heading className="mt-4 text-h3 font-semibold text-fg">{title}</Heading>
      {message ? (
        <p className="mt-1 max-w-prose text-body-sm text-fg-secondary">{message}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
