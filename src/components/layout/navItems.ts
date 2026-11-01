import type { MicrocopyKey } from "@/content/microcopy";

/** Satu tautan navigasi utama. Label diambil dari microcopy lewat `labelKey`. */
export interface NavItem {
  href: string;
  labelKey: MicrocopyKey;
}

/**
 * Menu utama. Halaman Grup, Bracket, dan Pemain dibuat pada prompt 15–17;
 * tautannya sudah mengarah ke rute final (/groups, /bracket, /players).
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/groups", labelKey: "nav.groups" },
  { href: "/bracket", labelKey: "nav.bracket" },
  { href: "/players", labelKey: "nav.players" },
];
