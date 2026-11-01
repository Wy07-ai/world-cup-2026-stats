"use client"; // Alasan: usePathname (hook) untuk menandai tautan aktif.

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { focusRing } from "./styles";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  /** Kelas tambahan dari pemanggil (tata letak, hover). */
  className?: string;
  /** Dipanggil saat tautan diklik (mis. menutup panel menu). */
  onClick?: () => void;
}

/** Tautan aktif: "/" hanya cocok persis; rute lain juga cocok untuk anak rutenya. */
function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ href, children, className, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center rounded-lg px-3 text-body-sm font-medium",
        focusRing,
        // Penanda aktif tidak hanya warna: ada garis bawah dan berat huruf.
        active
          ? "font-semibold text-accent-cyan-ink underline decoration-2 underline-offset-4"
          : "text-fg-secondary hover:text-fg",
        className,
      )}
    >
      {children}
    </Link>
  );
}
