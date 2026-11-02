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

  "page.groups.title": "Klasemen Grup A–L | Piala Dunia FIFA 2026",
  "page.groups.meta":
    "Klasemen lengkap 12 grup Piala Dunia FIFA 2026: main, menang, seri, kalah, selisih gol, dan poin. Lihat siapa yang lolos ke Babak 32 Besar.",
  "groups.hero.title": "Klasemen Grup",
  "groups.intro":
    "Dua tim teratas tiap grup lolos langsung ke Babak 32 Besar. Delapan dari dua belas tim peringkat 3 menyusul sebagai Best 3rd.",
  "groups.bestThirds.title": "Klasemen Best 3rd",
  "groups.bestThirds.intro":
    "Delapan tim peringkat 3 terbaik lolos ke Babak 32 Besar.",
  "groups.legend.qualified": "Lolos otomatis ke Babak 32 Besar",
  "groups.legend.bestThird":
    "Kandidat Best 3rd: menunggu perbandingan 12 tim peringkat 3",
  "nav.groupTab": "Grup {letter}",
  "status.fullTime": "FT",
  "status.fullTime.tooltip": "Full Time: pertandingan selesai",
  "status.qualified": "Lolos",
  "status.eliminated": "Tersingkir",
  "status.bestThirdCandidate": "Kandidat Best 3rd",
  "status.qualifiedAsBestThird": "Lolos sebagai Best 3rd",
  "status.provisional": "Sementara",
  "status.provisional.tooltip":
    "Grup ini belum selesai, jadi peringkat masih bisa berubah",
  "status.winner": "Pemenang",
  "match.matchday": "Matchday {number}",
  "match.versus": "vs",
  "standings.col.rank": "#",
  "standings.col.rank.tooltip": "Peringkat",
  "standings.col.team": "Tim",
  "standings.col.played": "Main",
  "standings.col.played.tooltip": "Pertandingan dimainkan",
  "standings.col.won": "M",
  "standings.col.won.tooltip": "Menang",
  "standings.col.drawn": "S",
  "standings.col.drawn.tooltip": "Seri",
  "standings.col.lost": "K",
  "standings.col.lost.tooltip": "Kalah",
  "standings.col.goalsFor": "GM",
  "standings.col.goalsFor.tooltip": "Gol Memasukkan",
  "standings.col.goalsAgainst": "GK",
  "standings.col.goalsAgainst.tooltip": "Gol Kemasukan",
  "standings.col.goalDifference": "SG",
  "standings.col.goalDifference.tooltip": "Selisih Gol",
  "standings.col.points": "Poin",
  "standings.col.points.tooltip": "Poin",
  "aria.standings.table": "Klasemen Grup {letter}",
  "aria.row.qualified": "Lolos otomatis ke Babak 32 Besar",
  "aria.row.bestThird": "Kandidat Best 3rd",
  "aria.flag": "Bendera {teamName}",
  "aria.matchScore": "{homeTeam} {homeScore}, {awayTeam} {awayScore}",
  "aria.loading": "Memuat data",
  "empty.groups.title": "Belum ada klasemen untuk grup ini.",
  "empty.groups.body": "Klasemen muncul setelah pertandingan pertama dimainkan.",

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
  /** USULAN: judul kolom Status pada tabel klasemen (Badge teks, bukan warna saja). */
  "standings.col.status": "Status",
  /** USULAN: aria-label tablist Grup A sampai L. */
  "aria.groups.tabs": "Pilih grup",
  /** USULAN: aria-label legenda warna baris klasemen. */
  "groups.legend.title": "Keterangan warna baris",
  /** USULAN: judul daftar laga pada panel grup. */
  "groups.matches.title": "Pertandingan",
  /** USULAN: judul tabel klasemen pada panel grup. */
  "groups.standings.title": "Klasemen",
  /** USULAN: aria-label tabel Best 3rd. */
  "aria.bestThirds.table": "Klasemen peringkat ketiga terbaik",
  /** USULAN: teks bantu pembaca layar penanda batas lolos 8 besar. */
  "groups.bestThirds.cutoff": "Batas 8 besar peringkat ketiga",
} as const;

export type MicrocopyKey = keyof typeof microcopy;

/**
 * Isi placeholder `{nama}` pada teks microcopy. Hanya penggantian string;
 * placeholder tanpa nilai dibiarkan apa adanya agar kesalahan terlihat.
 */
export function tf(
  key: MicrocopyKey,
  values: Readonly<Record<string, string | number>>,
): string {
  return microcopy[key].replace(/\{(\w+)\}/g, (whole, name: string) =>
    Object.hasOwn(values, name) ? String(values[name]) : whole,
  );
}

/** Ambil teks berdasarkan kunci; kunci yang salah ditolak saat typecheck. */
export function t(key: MicrocopyKey): string {
  return microcopy[key];
}
