/**
 * Kelas bersama komponen UI generik (docs/design-tokens.md bagian 5).
 *
 * Nilainya sengaja sama dengan `src/components/layout/styles.ts`; salinan ini
 * dibuat agar `components/ui` tidak bergantung pada `components/layout`.
 */

/** Fokus keyboard: outline `accent-cyan-ink` (lulus 3:1 di kedua tema). */
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan-ink";

/**
 * Sama dengan `focusRing`, tetapi outline digambar ke DALAM elemen. Dipakai di
 * wadah ber-overflow (mis. Tabs) agar outline tidak terpotong.
 */
export const focusRingInset =
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-cyan-ink";

/**
 * hover:scale-105 (PRD 5.4) untuk elemen klik berukuran kecil. `motion-reduce`
 * mematikan gerak sesuai preferensi pengguna. Jangan dipakai pada elemen
 * selebar penuh karena tepinya melewati layar 320 px.
 */
export const hoverScale =
  "hover:scale-105 transition-transform duration-200 motion-reduce:hover:scale-100 motion-reduce:transition-none active:opacity-80";

/** Pengganti hoverScale untuk elemen klik selebar penuh (tanpa skala). */
export const hoverRow =
  "hover:brightness-95 transition-[filter] duration-200 motion-reduce:transition-none active:opacity-80";
