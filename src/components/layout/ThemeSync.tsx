"use client"; // Alasan: useEffect untuk membaca <html> dan menerapkan class tema (API browser).

import { useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";

/**
 * Menyinkronkan store dengan class `dark` pada <html>.
 *
 * 1. Saat mount: skrip inline (ThemeScript) sudah memutuskan tema sebelum
 *    render pertama, jadi class <html> adalah sumber kebenaran. Nilainya
 *    disalin ke store.
 * 2. Setelahnya: setiap perubahan `theme` di store diterapkan ke <html>.
 *    Langganan baru dipasang SETELAH langkah 1, sehingga nilai awal store
 *    ("light") tidak pernah menimpa class <html> dan tidak menyebabkan kedip.
 *
 * Catatan: bila pengguna belum pernah memilih tema dan perangkatnya memakai
 * tema gelap, langkah 1 mengubah store sehingga `persist` ikut menyimpan
 * "dark". Sejak itu preferensi sistem tidak lagi diikuti.
 */
export function ThemeSync() {
  useEffect(() => {
    const root = document.documentElement;
    const domTheme = root.classList.contains("dark") ? "dark" : "light";
    if (useUIStore.getState().theme !== domTheme) {
      useUIStore.setState({ theme: domTheme });
    }

    return useUIStore.subscribe((state, previous) => {
      if (state.theme === previous.theme) return;
      root.classList.toggle("dark", state.theme === "dark");
    });
  }, []);

  return null;
}
