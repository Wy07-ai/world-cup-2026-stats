"use client"; // Alasan: onClick dan langganan store Zustand (hook).

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/content/microcopy";
import { selectTheme, selectToggleTheme, useUIStore } from "@/store/useUIStore";
import { focusRing, hoverScale } from "./styles";

/**
 * Tombol ganti tema. Ikon dipilih lewat CSS (`dark:`), bukan lewat state,
 * sehingga ikon yang tampil selalu cocok dengan class <html> yang diputuskan
 * skrip inline sebelum render pertama.
 */
export function ThemeToggle() {
  const theme = useUIStore(selectTheme);
  const toggleTheme = useUIStore(selectToggleTheme);
  const label =
    theme === "dark" ? t("aria.toggleTheme.toLight") : t("aria.toggleTheme.toDark");

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-lg text-fg",
        focusRing,
        hoverScale,
      )}
    >
      <Sun className="hidden size-6 dark:block" aria-hidden="true" />
      <Moon className="size-6 dark:hidden" aria-hidden="true" />
    </button>
  );
}
