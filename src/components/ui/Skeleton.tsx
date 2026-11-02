/**
 * Skeleton (Server Component: murni tampilan).
 *
 * Acuan PRD: Bab 5.4 (Loading State): skeleton shimmer, BUKAN spinner.
 * Animasi `animate-shimmer` didefinisikan pada globals.css; saat
 * `prefers-reduced-motion` aktif animasi dimatikan dan tersisa latar diam
 * `bg-surface-muted`.
 *
 * Aksesibilitas: blok skeleton bersifat dekoratif (aria-hidden). Bila prop
 * `label` diberikan (mis. "Memuat data"), pembungkus menjadi region
 * `role="status"` dengan teks sr-only agar pembaca layar tahu ada pemuatan.
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /** Tambah `rounded-full` (untuk avatar/lingkaran). Bawaan: false (`rounded-lg`). */
  circle?: boolean;
}

/** Blok dasar shimmer. Atur ukuran lewat className, mis. "h-4 w-32". */
export function Skeleton({ circle = false, className, ...rest }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-surface-muted bg-linear-to-r from-surface-muted via-line to-surface-muted bg-size-[200%_100%] animate-shimmer motion-reduce:animate-none",
        circle ? "rounded-full" : "rounded-lg",
        className,
      )}
      {...rest}
    />
  );
}

interface SkeletonGroupProps {
  /** Teks pembaca layar (mis. "Memuat data"). Tanpa label: seluruhnya aria-hidden. */
  label?: string;
  className?: string;
  children: ReactNode;
}

function SkeletonGroup({ label, className, children }: SkeletonGroupProps) {
  if (label) {
    return (
      <div role="status" aria-live="polite" className={className}>
        <span className="sr-only">{label}</span>
        {children}
      </div>
    );
  }
  return (
    <div aria-hidden="true" className={className}>
      {children}
    </div>
  );
}

export interface SkeletonTextProps {
  /** Jumlah baris. Bawaan: 3. Baris terakhir dibuat lebih pendek. */
  lines?: number;
  /** Label pembaca layar (lihat SkeletonGroup). */
  label?: string;
  className?: string;
}

/** Varian baris teks. */
export function SkeletonText({ lines = 3, label, className }: SkeletonTextProps) {
  const count = Math.max(1, Math.floor(lines));
  return (
    <SkeletonGroup label={label} className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton
          key={index}
          className={cn("h-4", index === count - 1 && count > 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </SkeletonGroup>
  );
}

export interface SkeletonCardProps {
  /** Jumlah baris teks di isi kartu. Bawaan: 3. */
  lines?: number;
  /** Tampilkan lingkaran avatar di header. Bawaan: true. */
  avatar?: boolean;
  label?: string;
  className?: string;
}

/** Varian kartu (header + isi), meniru bentuk `Card`. */
export function SkeletonCard({
  lines = 3,
  avatar = true,
  label,
  className,
}: SkeletonCardProps) {
  return (
    <SkeletonGroup
      label={label}
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border border-line bg-surface p-4 shadow-card md:p-6",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {avatar ? <Skeleton circle className="size-12 shrink-0" /> : null}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <SkeletonText lines={lines} className="mt-4" />
    </SkeletonGroup>
  );
}

export interface SkeletonTableRowsProps {
  /** Jumlah baris. Bawaan: 5. */
  rows?: number;
  /** Jumlah kolom per baris. Bawaan: 4. */
  columns?: number;
  label?: string;
  className?: string;
}

/**
 * Varian baris tabel. Dirender sebagai `div` grid (bukan `<tr>`), cocok untuk
 * tata letak berbasis div; untuk `<table>` sungguhan, bungkus dalam wadah
 * pengganti saat loading.
 */
export function SkeletonTableRows({
  rows = 5,
  columns = 4,
  label,
  className,
}: SkeletonTableRowsProps) {
  const rowCount = Math.max(1, Math.floor(rows));
  const colCount = Math.max(1, Math.floor(columns));
  return (
    <SkeletonGroup label={label} className={cn("divide-y divide-line", className)}>
      {Array.from({ length: rowCount }, (_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid items-center gap-3 py-3"
          style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: colCount }, (_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn("h-4", colIndex === 0 ? "w-3/4" : "w-full")}
            />
          ))}
        </div>
      ))}
    </SkeletonGroup>
  );
}
