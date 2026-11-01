/**
 * Kelas bersama untuk elemen yang bisa diklik di layout.
 *
 * - Fokus keyboard: outline `accent-cyan-ink` (lulus 3:1 di kedua tema),
 *   sesuai docs/design-tokens.md bagian 5.
 * - Area sentuh minimum 44 px lewat `min-h-11` / `size-11`.
 */
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan-ink";

/**
 * Transisi hover:scale-105 (PRD 5.4). HANYA untuk elemen kecil yang tidak
 * selebar layar: elemen selebar penuh memakai `hoverRow` agar tidak melewati
 * tepi layar 320 px. `motion-reduce` mematikan gerak sesuai preferensi pengguna.
 */
export const hoverScale =
  "hover:scale-105 transition-transform duration-200 motion-reduce:hover:scale-100 motion-reduce:transition-none active:opacity-80";

/** Pengganti hoverScale untuk elemen selebar penuh (tanpa skala). */
export const hoverRow =
  "hover:bg-surface-muted transition-colors duration-200 motion-reduce:transition-none active:opacity-80";
