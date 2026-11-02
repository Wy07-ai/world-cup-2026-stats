"use client";
// "use client": SafeImage memakai onError (fungsi) dan state untuk berpindah ke
// avatar placeholder saat gambar gagal dimuat. Handler dan state hanya bisa
// hidup di Client Component (docs Next.js: `onError` pada next/image).
//
// Acuan PRD: Bab 9 (kasus tepi: foto pemain gagal dimuat harus menampilkan
// avatar placeholder, bukan ikon rusak bawaan browser) dan Bab 3.3 (gambar
// memakai next/image).

import Image from "next/image";
import { Flag, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type SafeImageFallbackType = "player" | "flag";

export interface SafeImageProps {
  /** Alamat gambar (path lokal di /public atau URL yang sudah diizinkan Next). */
  src: string;
  /** Teks alternatif. Wajib; dipakai juga sebagai nama avatar placeholder. */
  alt: string;
  /** Lebar intrinsik (px). */
  width: number;
  /** Tinggi intrinsik (px). */
  height: number;
  /** Atribut `sizes` untuk srcset responsif. */
  sizes?: string;
  /** Prioritaskan pemuatan (gambar di atas lipatan / LCP). */
  priority?: boolean;
  /** Jenis placeholder saat gagal. Bawaan: "player" (siluet); "flag" (ikon bendera). */
  fallbackType?: SafeImageFallbackType;
  /**
   * Inisial untuk placeholder "player" (mis. "LM"). Bila kosong, tampil siluet.
   * Disuplai pemanggil agar komponen ini tidak mengurai nama.
   */
  fallbackInitials?: string;
  /** Kelas tambahan, berlaku untuk gambar maupun placeholder. */
  className?: string;
}

/** True bila path (tanpa query/hash) berakhiran .svg: dilewatkan tanpa optimasi. */
export function isSvgSrc(src: string): boolean {
  const path = src.split(/[?#]/)[0] ?? "";
  return path.toLowerCase().endsWith(".svg");
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority,
  fallbackType = "player",
  fallbackInitials,
  className,
}: SafeImageProps) {
  // Simpan src yang gagal (bukan boolean) agar placeholder otomatis hilang
  // bila `src` berganti, tanpa efek tambahan.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = src.trim() === "" || failedSrc === src;

  if (failed) {
    const isFlag = fallbackType === "flag";
    const initials = fallbackInitials?.trim();
    return (
      <span
        role="img"
        aria-label={alt}
        data-fallback={fallbackType}
        style={{ width, height }}
        className={cn(
          "inline-flex shrink-0 items-center justify-center overflow-hidden bg-surface-muted text-fg-muted",
          isFlag ? "rounded-sm border border-line" : "rounded-full",
          className,
        )}
      >
        {isFlag ? (
          <Flag aria-hidden="true" className="size-1/2" />
        ) : initials ? (
          <span aria-hidden="true" className="text-body-sm font-semibold uppercase">
            {initials}
          </span>
        ) : (
          <User aria-hidden="true" className="size-1/2" />
        )}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      // SVG (bendera) tidak perlu dioptimasi oleh Next.
      unoptimized={isSvgSrc(src)}
      onError={() => setFailedSrc(src)}
      className={className}
    />
  );
}
