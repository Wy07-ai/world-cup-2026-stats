/**
 * Teks tampilan untuk layout (Navbar, Footer, metadata).
 *
 * Bagian "Dari docs/microcopy-id.md" menyalin teks dan kunci persis dari
 * dokumen itu (pemilik: Claude #5). Hanya kunci yang dipakai layout yang
 * disalin; tambahkan kunci lain bila komponen berikutnya membutuhkannya, dan
 * jangan mengubah teksnya di sini (ubah di docs/microcopy-id.md lebih dulu).
 *
 * Bagian "USULAN" berisi teks yang BELUM ada di microcopy dan dibuat oleh
 * Claude #2 supaya layout lengkap. Teks ini perlu disetujui atau diganti oleh
 * Claude #5 / pengguna.
 */
export const microcopy = {
  // --- Dari docs/microcopy-id.md ---------------------------------------
  "nav.home": "Beranda",
  "nav.groups": "Grup",
  "nav.bracket": "Bracket",
  "nav.players": "Pemain",
  "nav.brand": "Piala Dunia 2026",
  "nav.skipToContent": "Lewati ke konten utama",
  "aria.toggleTheme.toLight": "Ganti ke mode terang",
  "aria.toggleTheme.toDark": "Ganti ke mode gelap",
  "aria.menu.open": "Buka menu navigasi",
  "aria.menu.close": "Tutup menu navigasi",
  "page.home.title": "Statistik Piala Dunia FIFA 2026: Grup, Bracket & Pemain",
  "page.home.meta":
    "Pantau klasemen 12 grup, bracket dari Babak 32 Besar sampai Final, dan statistik pemain 48 tim Piala Dunia FIFA 2026. Cepat dan jelas di ponsel.",

  // --- USULAN (belum ada di microcopy) ---------------------------------
  /** USULAN: catatan data statis di Footer (permintaan prompt 13, poin 6). */
  "footer.dataNote":
    "Data bersifat statis dan tidak diperbarui otomatis.",
  /** USULAN: sumber data; sesuai docs/data-sources.md (openfootball). */
  "footer.source": "Sumber data: repositori publik openfootball.",
  /** USULAN: nama tautan sumber di Footer. */
  "footer.sourceLinkLabel": "openfootball",
  /** USULAN: aria-label navigasi utama di Navbar. */
  "aria.nav.main": "Navigasi utama",
  /** USULAN: aria-label navigasi kedua di Footer. */
  "aria.nav.footer": "Navigasi footer",
} as const;

export type MicrocopyKey = keyof typeof microcopy;

/** Ambil teks berdasarkan kunci; kunci yang salah ditolak saat typecheck. */
export function t(key: MicrocopyKey): string {
  return microcopy[key];
}
