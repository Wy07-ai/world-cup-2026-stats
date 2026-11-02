/**
 * Button (Server Component, tanpa "use client": tidak ada state atau efek;
 * handler `onClick` dari pemanggil tetap bekerja bila pemanggilnya Client
 * Component).
 *
 * Acuan PRD: Bab 5.4 (Interaktivitas: hover:scale-105 transition-transform
 * duration-200) dan Bab 5.1 (aksen Cyan = interaktif; teks `on-accent` di atas
 * latar aksen).
 */
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { focusRing, hoverRow, hoverScale } from "./styles";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  /** Gaya tombol. Bawaan: "primary". */
  variant?: ButtonVariant;
  /** Ukuran tombol. Semua ukuran memiliki tinggi sentuh minimal 44 px. */
  size?: ButtonSize;
  /** Nonaktifkan tombol (tidak bisa diklik atau difokus). */
  disabled?: boolean;
  /** Lebar penuh. Efek skala dimatikan agar tidak melewati tepi layar. */
  fullWidth?: boolean;
  /** Ikon opsional sebelum teks. Dekoratif (aria-hidden oleh pemanggil). */
  iconStart?: ReactNode;
  /** Ikon opsional setelah teks. */
  iconEnd?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Tombol biasa (`<button>`). */
export type ButtonAsButtonProps = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps> & {
    href?: undefined;
  };

/** Tombol bertautan: dirender sebagai `next/link`. */
export type ButtonAsLinkProps = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonBaseProps | "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent-cyan text-on-accent font-semibold",
  secondary:
    "border border-line-strong bg-surface text-fg font-semibold hover:bg-surface-muted",
  ghost:
    "bg-transparent text-accent-cyan-ink font-semibold hover:bg-surface-muted",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-11 px-3 text-body-sm gap-1.5",
  md: "min-h-11 px-4 text-body-sm gap-2",
  lg: "min-h-14 px-6 text-body gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  iconStart,
  iconEnd,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex select-none items-center justify-center rounded-lg text-center",
    variantClasses[variant],
    sizeClasses[size],
    focusRing,
    fullWidth && "w-full",
    disabled
      ? "cursor-not-allowed opacity-50"
      : fullWidth
        ? hoverRow
        : hoverScale,
    className,
  );

  const content = (
    <>
      {iconStart}
      <span className="min-w-0">{children}</span>
      {iconEnd}
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...linkRest } = rest;
    // Tautan nonaktif tidak boleh dapat diklik atau difokus: dirender sebagai
    // <span> ber-aria-disabled, bukan <a> tanpa href.
    if (disabled) {
      return (
        <span role="link" aria-disabled="true" className={classes}>
          {content}
        </span>
      );
    }
    return (
      <Link href={href} className={classes} {...linkRest}>
        {content}
      </Link>
    );
  }

  const { href: _href, type = "button", ...buttonRest } = rest;
  void _href;
  return (
    <button type={type} disabled={disabled} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
