/**
 * Card (Server Component: kontainer statis tanpa state).
 *
 * Acuan PRD: Bab 5.1 (tema Light/Dark lewat token) dan Bab 5.2 (sudut
 * `rounded-xl`). Kartu statis TIDAK diberi hover:scale-105 (docs/design-tokens
 * bagian 5: hanya untuk elemen yang bisa diklik). Untuk kartu yang bisa
 * diklik, bungkus Card dengan tautan/tombol di komponen pemanggil.
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CardElement = "div" | "section" | "article";

export interface CardProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children" | "title"> {
  /** Elemen HTML pembungkus. Bawaan: "div". */
  as?: CardElement;
  /** Slot header opsional (judul, aksi). Diberi pemisah di bawahnya. */
  header?: ReactNode;
  /** Slot footer opsional. Diberi pemisah di atasnya. */
  footer?: ReactNode;
  /** Isi utama kartu. */
  children?: ReactNode;
  /** Kelas tambahan untuk area isi. */
  contentClassName?: string;
}

const sectionPadding = "px-4 py-3 md:px-6 md:py-4";

export function Card({
  as: Component = "div",
  header,
  footer,
  children,
  className,
  contentClassName,
  ...rest
}: CardProps) {
  return (
    <Component
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border border-line bg-surface text-fg shadow-card",
        className,
      )}
      {...rest}
    >
      {header ? (
        <div className={cn("border-b border-line", sectionPadding)}>{header}</div>
      ) : null}
      {children !== undefined && children !== null ? (
        <div className={cn("p-4 md:p-6", contentClassName)}>{children}</div>
      ) : null}
      {footer ? (
        <div
          className={cn(
            "border-t border-line bg-surface-muted",
            sectionPadding,
          )}
        >
          {footer}
        </div>
      ) : null}
    </Component>
  );
}
