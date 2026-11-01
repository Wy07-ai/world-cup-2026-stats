/**
 * Konstanta tema yang dipakai bersama oleh store (src/store/useUIStore.ts) dan
 * skrip inline anti-kedip (src/components/layout/ThemeScript.tsx).
 *
 * Berkas ini sengaja kecil dan tanpa impor, supaya Server Component boleh
 * mengimpornya tanpa ikut membawa Zustand ke bundel server.
 */

/** Kunci localStorage; format isinya dibuat oleh `persist` Zustand. */
export const THEME_STORAGE_KEY = "wc2026-ui";

/** Nilai tema yang sah. */
export type Theme = "light" | "dark";
