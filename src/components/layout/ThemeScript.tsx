import { THEME_STORAGE_KEY } from "@/store/themeStorage";

/**
 * Skrip inline untuk <head>: menentukan tema SEBELUM render pertama sehingga
 * halaman tidak berkedip dari terang ke gelap.
 *
 * Urutan: tema tersimpan (format `persist` Zustand: {"state":{"theme":...}})
 * -> prefers-color-scheme -> terang. Setiap langkah dibungkus try/catch
 * sendiri supaya localStorage yang diblokir tidak membatalkan langkah berikut.
 *
 * Server Component: tidak butuh "use client". Skrip berjalan sinkron saat HTML
 * di-parse, sebelum body digambar.
 */
const script = `(function(){var t=null;try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(s){var p=JSON.parse(s);var v=p&&p.state&&p.state.theme;if(v==="dark"||v==="light")t=v}}catch(e){}if(!t){try{t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){t="light"}}if(t==="dark")document.documentElement.classList.add("dark")})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
