import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan nama kelas: clsx menangani nilai kondisional (false, null,
 * undefined, objek, array), lalu twMerge menyelesaikan konflik kelas Tailwind
 * (kelas yang muncul belakangan menang, mis. "px-2 px-4" menjadi "px-4").
 *
 * @example cn("px-2", isActive && "px-4") // "px-4" bila isActive true
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
