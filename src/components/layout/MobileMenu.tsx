"use client"; // Alasan: useState/useEffect/useRef, onClick, keydown Escape, dan usePathname untuk panel buka-tutup.

import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";
import { focusRing, hoverRow, hoverScale } from "./styles";

interface MobileMenuProps {
  items: readonly { href: string; label: string }[];
  openLabel: string;
  closeLabel: string;
  navLabel: string;
}

/**
 * Menu panel untuk layar < 768 px. Panel melekat pada <header> sticky
 * (posisi absolut terhadap header), jadi tetap terlihat saat halaman digulir.
 *
 * Menutup saat berpindah rute tanpa effect: yang disimpan adalah rute tempat
 * panel dibuka, dan panel dianggap terbuka hanya bila rute itu masih aktif.
 */
export function MobileMenu({
  items,
  openLabel,
  closeLabel,
  navLabel,
}: MobileMenuProps) {
  const pathname = usePathname();
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const isOpen = openedAt === pathname;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const label = isOpen ? closeLabel : openLabel;

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenedAt(null);
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={label}
        title={label}
        onClick={() => setOpenedAt(isOpen ? null : pathname)}
        className={cn(
          "inline-flex size-11 items-center justify-center rounded-lg text-fg md:hidden",
          focusRing,
          hoverScale,
        )}
      >
        {isOpen ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <Menu className="size-6" aria-hidden="true" />
        )}
      </button>

      <nav
        id={panelId}
        aria-label={navLabel}
        hidden={!isOpen}
        className="absolute inset-x-0 top-full border-b border-line bg-surface shadow-pop md:hidden"
      >
        <ul className="flex flex-col p-2">
          {items.map((item) => (
            <li key={item.href}>
              {/* Selebar penuh: tanpa hover:scale agar tidak melewati tepi 320 px. */}
              <NavLink
                href={item.href}
                onClick={() => setOpenedAt(null)}
                className={cn("w-full", hoverRow)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
