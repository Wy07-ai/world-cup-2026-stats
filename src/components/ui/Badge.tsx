/**
 * Badge (Server Component: murni tampilan, tanpa interaktivitas).
 *
 * Acuan PRD: Bab 5.1 (warna semantik) dan docs/design-tokens.md bagian 1:
 * status tidak boleh hanya dibawa warna, jadi setiap varian berwarna selalu
 * memuat TEKS (children wajib) dan ikon berbentuk berbeda.
 *
 * Badge tidak tahu arti sepak bola. Pemanggil yang menentukan teksnya, mis.
 * variant="success" + "Lolos", variant="warning" + "Kandidat Best 3rd",
 * variant="danger" + "Tersingkir".
 */
import { Check, Hourglass, Info, X } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info";

export interface BadgeProps
  extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  /** Varian warna semantik. Bawaan: "neutral". */
  variant?: BadgeVariant;
  /** Teks badge. Wajib: warna saja tidak boleh membawa informasi. */
  children: ReactNode;
  /** Tampilkan ikon penanda varian. Bawaan: true (varian neutral tanpa ikon). */
  showIcon?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "border-line bg-surface-muted text-fg-secondary",
  success: "border-success bg-success-bg text-success-fg",
  warning: "border-warning bg-warning-bg text-warning-fg",
  danger: "border-danger bg-danger-bg text-danger-fg",
  info: "border-info bg-info-bg text-info-fg",
};

const iconClasses = "size-3.5 shrink-0";

function VariantIcon({ variant }: { variant: BadgeVariant }) {
  switch (variant) {
    case "success":
      return <Check aria-hidden="true" className={iconClasses} />;
    case "warning":
      return <Hourglass aria-hidden="true" className={iconClasses} />;
    case "danger":
      return <X aria-hidden="true" className={iconClasses} />;
    case "info":
      return <Info aria-hidden="true" className={iconClasses} />;
    case "neutral":
      return null;
  }
}

export function Badge({
  variant = "neutral",
  showIcon = true,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-full border px-2.5 py-0.5 text-caption font-medium",
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {showIcon ? <VariantIcon variant={variant} /> : null}
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}
