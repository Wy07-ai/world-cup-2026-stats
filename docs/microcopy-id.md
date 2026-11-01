# Microcopy Bahasa Indonesia — Platform Statistik Piala Dunia FIFA 2026

> Pemilik: Claude #5 (UI/UX Strategist & Copywriter). Berkas ini hanya berisi teks dan kunci; tidak ada logika.

**Acuan PRD:** Master PRD Bab 5.4 (Empty State dan teks status), Bab 5.2 (komponen MatchRow dan GroupStandingTable), Bab 6.1–6.2 (istilah klasemen dan Best 3rd), serta Bab 7.2 (batas wewenang Claude #5).

Catatan sumber: `docs/master-prd.md` di repositori masih berupa placeholder. PRD yang dibaca adalah `master-prd-world-cup-2026-lengkap.docx`.

## Daftar isi

1. Nada dan glosarium istilah
2. Konvensi kunci
3. Judul, meta SEO, dan hero tiap halaman
4. Navigasi, tombol, status, kolom klasemen, dan aria-label
5. Empty state, error, dan placeholder
6. Label sumber slot bracket
7. Catatan untuk pemakai teks

## 1. Nada dan glosarium istilah

**Nada:** ramah, energik, jelas. Sapaan memakai *kamu*. Kalimat pendek, kata kerja aktif, tanpa bahasa gaul dan tanpa singkatan yang tidak dijelaskan. Tanda seru dipakai paling banyak satu per halaman dan tidak dipakai di pesan error. Teks error menjelaskan apa yang terjadi dan apa langkah berikutnya, tanpa menyalahkan pengguna.

**Satu istilah per konsep.** Pakai kolom *Pakai*; jangan pakai kolom *Hindari*.

| Konsep | Pakai | Hindari |
|---|---|---|
| Turnamen | Piala Dunia FIFA 2026 (singkat: Piala Dunia 2026) | World Cup, WC26, Mundial |
| Fase pertama | Fase Grup | Babak Grup, Penyisihan |
| Babak pertama fase gugur | Babak 32 Besar | Round of 32, Putaran 32 Besar, 32 Besar |
| Babak kedua | 16 Besar | Babak 16 Besar, Round of 16 |
| Babak ketiga | Perempat Final | Quarter Final, 8 Besar |
| Babak keempat | Semi Final | Semifinal, Semi-final |
| Laga hadiah | Perebutan Tempat Ketiga | Juara 3, Third Place, Perebutan Juara Tiga |
| Laga penutup | Final | Partai Puncak |
| Fase setelah grup | Fase Gugur | Knockout, Babak Gugur |
| Tabel poin grup | Klasemen | Standings, Tabel Poin, Peringkat Grup |
| Pohon pertandingan fase gugur | Bracket | Braket, Bagan, Bagan Gugur, Tournament Tree |
| Kumpulan pemain satu tim | Skuad | Squad, Daftar Pemain Tim |
| Negara peserta | Tim | Negara, Kontestan |
| Posisi 1 grup | Juara Grup | Pemuncak Grup, Grup Winner |
| Posisi 2 grup | Runner-up | Juara Kedua, Peringkat 2 (sebagai nama), Wakil Grup |
| Posisi 3 grup (nama slot) | Peringkat 3 | Juara 3 Grup, Posisi Ketiga |
| Status tim peringkat 3 yang berpeluang lolos | Best 3rd (panjang: Kandidat Best 3rd) | Peringkat 3 Terbaik, Third Place Terbaik, Best Third |
| Penentuan lewat tendangan penalti | Adu Penalti | Penalty Shootout, Tos Penalti, PSO |
| Gol yang diciptakan | Gol Memasukkan (GM) | Gol Cetak, Goal For |
| Gol yang diterima | Gol Kemasukan (GK) | Gol Bobol, Goal Against |
| Umpan gol | Assist | Asis, Umpan Gol |
| Poin kartu | Poin Fair Play (FP) | Fair Play (tanpa kata poin), Poin Disiplin |
| Hari pertandingan fase grup | Matchday | Pekan, Hari Pertandingan |
| Pilihan tampilan terang/gelap | Tema (nilai: Terang, Gelap) | Mode (sebagai nama tombol), Skin |

## 2. Konvensi kunci

- Kunci stabil, huruf kecil bertitik (`nav.groups`). Bagian terakhir boleh camelCase (`status.bestThirdCandidate`). Kunci tidak diubah setelah dipakai; bila teks berubah, ubah teksnya, bukan kuncinya.
- Untuk teks yang mengikuti nilai tipe, kunci memakai nilai tipe persis: `stage.ROUND_OF_32`, `position.GK` (nilai `MatchStage` dan `Player.position` pada `@/types`).
- Placeholder ditulis `{nama}` (kurung kurawal tunggal). Nilainya diisi oleh pemanggil; huruf pada `{groups}` sudah terurut.
- Sufiks `.tooltip` = teks panjang untuk tooltip dan `title`. Sufiks `.title` / `.body` = judul dan isi satu pesan.
- Panjang: judul halaman maks. 60 karakter, deskripsi meta maks. 155 karakter (dihitung pada tabel bagian 3).

## 3. Judul, meta SEO, dan hero tiap halaman

Rute: Beranda `/`, Grup `/groups`, Bracket `/bracket`, Pemain `/players`, Detail Pemain `/players/[id]` (asumsi; PRD tidak menyebut rute detail).

| Kunci | Teks | Karakter |
|---|---|---|
| `page.home.title` | Statistik Piala Dunia FIFA 2026: Grup, Bracket & Pemain | 55 |
| `page.home.meta` | Pantau klasemen 12 grup, bracket dari Babak 32 Besar sampai Final, dan statistik pemain 48 tim Piala Dunia FIFA 2026. Cepat dan jelas di ponsel. | 144 |
| `page.groups.title` | Klasemen Grup A–L \| Piala Dunia FIFA 2026 | 41 |
| `page.groups.meta` | Klasemen lengkap 12 grup Piala Dunia FIFA 2026: main, menang, seri, kalah, selisih gol, dan poin. Lihat siapa yang lolos ke Babak 32 Besar. | 139 |
| `page.bracket.title` | Bracket Babak 32 Besar sampai Final \| Piala Dunia 2026 | 54 |
| `page.bracket.meta` | Jelajahi bracket Piala Dunia FIFA 2026 dari Babak 32 Besar, 16 Besar, Perempat Final, Semi Final, hingga Final. Geser dan zoom dengan mudah di ponsel. | 150 |
| `page.players.title` | Pemain Piala Dunia FIFA 2026 \| Statistik & Skuad | 48 |
| `page.players.meta` | Cari pemain dari 48 skuad Piala Dunia FIFA 2026. Lihat gol, assist, menit bermain, dan kartu, lalu saring berdasarkan tim atau posisi. | 134 |
| `page.playerDetail.title` | {playerName} – Profil & Statistik \| Piala Dunia 2026 | 52 |
| `page.playerDetail.meta` | Profil dan statistik {playerName} ({teamName}) di Piala Dunia FIFA 2026: penampilan, gol, assist, kartu, dan rating. | 116 |
| `page.notFound.title` | Halaman Tidak Ditemukan \| Piala Dunia FIFA 2026 | 47 |
| `page.notFound.meta` | Halaman yang kamu cari tidak ada atau sudah dipindah. Kembali ke Beranda untuk melihat klasemen, bracket, dan statistik pemain. | 127 |
| `page.playerDetail.titleShort` | {playerName} \| Piala Dunia FIFA 2026 | 36 |
| `page.playerDetail.metaShort` | Profil dan statistik {playerName} di Piala Dunia FIFA 2026: penampilan, gol, assist, kartu, dan rating. | 103 |

Kasus terburuk Detail Pemain dihitung dengan nama terpanjang di `players.json` ("Mohammad Ahmed Mohammad Taha", 28 karakter) dan nama tim terpanjang ("Bosnia and Herzegovina", 22 karakter): judul panjang menjadi 68 karakter (melebihi 60), jadi pemanggil memakai `page.playerDetail.titleShort` (52 karakter) bila hasil rakitan lebih dari 60 karakter. Deskripsi terburuk 144 karakter (aman). Hitungan memakai `len()` Python pada teks yang sudah diisi.

**Hero dan pengantar**

| Kunci | Teks | Catatan |
|---|---|---|
| `home.hero.eyebrow` | Piala Dunia FIFA 2026 |  |
| `home.hero.title` | Semua angka Piala Dunia, di genggamanmu. | Judul hero (H1). |
| `home.hero.subtitle` | Klasemen 12 grup, bracket sampai Final, dan statistik pemain. Cepat dibuka dari ponsel, jelas dibaca di bawah matahari. |  |
| `home.card.groups.title` | Klasemen Grup | Kartu pintasan. |
| `home.card.groups.desc` | Siapa lolos langsung, siapa menunggu Best 3rd. |  |
| `home.card.bracket.title` | Bracket |  |
| `home.card.bracket.desc` | Jalan menuju Final, dari Babak 32 Besar. |  |
| `home.card.players.title` | Pemain |  |
| `home.card.players.desc` | Cari pemain, lihat gol, assist, dan rating. |  |
| `groups.hero.title` | Klasemen Grup | H1 halaman Grup. |
| `groups.intro` | Dua tim teratas tiap grup lolos langsung ke Babak 32 Besar. Delapan dari dua belas tim peringkat 3 menyusul sebagai Best 3rd. |  |
| `groups.bestThirds.title` | Klasemen Best 3rd | Judul tabel perbandingan 12 tim peringkat 3. |
| `groups.bestThirds.intro` | Delapan tim peringkat 3 terbaik lolos ke Babak 32 Besar. |  |
| `groups.legend.qualified` | Lolos otomatis ke Babak 32 Besar | Legenda baris peringkat 1–2. |
| `groups.legend.bestThird` | Kandidat Best 3rd: menunggu perbandingan 12 tim peringkat 3 | Legenda baris peringkat 3. |
| `bracket.hero.title` | Bracket Fase Gugur | H1 halaman Bracket. |
| `bracket.intro` | Dari Babak 32 Besar sampai Final. Geser untuk menjelajah; cubit layar atau pakai tombol untuk zoom. |  |
| `bracket.hint.scroll` | Geser ke samping untuk melihat babak berikutnya | Petunjuk di bawah bracket pada layar sempit. |
| `players.hero.title` | Pemain | H1 halaman Pemain. |
| `players.intro` | Cari pemain dari 48 skuad, lalu saring menurut tim atau posisi. |  |
| `players.resultCount` | {count} pemain ditemukan | Placeholder {count} = angka. |
| `playerDetail.intro` | {teamName} · {position} · No. {shirtNumber} | Baris pengantar di bawah nama pemain. |
| `playerDetail.section.stats` | Statistik Turnamen |  |
| `playerDetail.section.radar` | Profil Performa | Judul bagian Radar Chart. |

## 4. Navigasi, tombol, status, kolom klasemen, dan aria-label

### Navigasi

| Kunci | Teks | Catatan |
|---|---|---|
| `nav.home` | Beranda |  |
| `nav.groups` | Grup |  |
| `nav.bracket` | Bracket |  |
| `nav.players` | Pemain |  |
| `nav.brand` | Piala Dunia 2026 | Nama merek di navbar (maks. 20 karakter). |
| `nav.skipToContent` | Lewati ke konten utama | Tautan lewati untuk pembaca layar dan keyboard. |
| `nav.groupTab` | Grup {letter} | Tab Grup A sampai L. |
| `footer.disclaimer` | Situs penggemar tidak resmi. Tidak berafiliasi dengan FIFA. | BUTUH PERSETUJUAN pengguna (klaim hukum). |

### Tombol dan aksi

| Kunci | Teks | Catatan |
|---|---|---|
| `action.loadMore` | Muat lebih banyak |  |
| `action.resetFilters` | Atur ulang filter |  |
| `action.toggleTheme` | Ganti tema | Label teks tombol (bila ada teks). |
| `action.retry` | Coba lagi |  |
| `action.backHome` | Kembali ke Beranda |  |
| `action.back` | Kembali |  |
| `action.viewPlayer` | Lihat profil |  |
| `action.clearSearch` | Hapus pencarian |  |
| `bracket.zoomIn` | Perbesar bracket |  |
| `bracket.zoomOut` | Perkecil bracket |  |
| `bracket.zoomReset` | Atur ulang zoom |  |
| `theme.light` | Terang | Nama nilai tema. |
| `theme.dark` | Gelap | Nama nilai tema. |

### Label status

| Kunci | Teks | Catatan |
|---|---|---|
| `status.fullTime` | FT | Disingkat; tooltip di bawah. |
| `status.fullTime.tooltip` | Full Time: pertandingan selesai |  |
| `status.notPlayed` | Belum Dimainkan |  |
| `status.penalties` | Adu Penalti |  |
| `status.penaltyScore` | {home}–{away} pen. | Skor adu penalti, contoh: 4–3 pen. |
| `status.qualified` | Lolos |  |
| `status.eliminated` | Tersingkir |  |
| `status.bestThirdCandidate` | Kandidat Best 3rd |  |
| `status.bestThirdShort` | Best 3rd | Versi chip sempit. |
| `status.qualifiedAsBestThird` | Lolos sebagai Best 3rd | Untuk ThirdPlaceEntry.qualified = true. |
| `status.provisional` | Sementara | Untuk ThirdPlaceEntry.isProvisional = true; tooltip di bawah. |
| `status.provisional.tooltip` | Grup ini belum selesai, jadi peringkat masih bisa berubah |  |
| `status.winner` | Pemenang |  |

### Tahap pertandingan (nilai MatchStage)

| Kunci | Teks | Catatan |
|---|---|---|
| `stage.GROUP_STAGE` | Fase Grup |  |
| `stage.ROUND_OF_32` | Babak 32 Besar |  |
| `stage.ROUND_OF_16` | 16 Besar |  |
| `stage.QUARTER_FINALS` | Perempat Final |  |
| `stage.SEMI_FINALS` | Semi Final |  |
| `stage.THIRD_PLACE` | Perebutan Tempat Ketiga |  |
| `stage.FINAL` | Final |  |
| `match.matchday` | Matchday {number} |  |
| `match.versus` | vs |  |

### Kolom klasemen (singkatan dan tooltip)

| Kunci | Teks | Catatan |
|---|---|---|
| `standings.col.rank` | # | Tooltip: Peringkat. |
| `standings.col.rank.tooltip` | Peringkat |  |
| `standings.col.team` | Tim |  |
| `standings.col.played` | Main |  |
| `standings.col.played.tooltip` | Pertandingan dimainkan |  |
| `standings.col.won` | M |  |
| `standings.col.won.tooltip` | Menang |  |
| `standings.col.drawn` | S |  |
| `standings.col.drawn.tooltip` | Seri |  |
| `standings.col.lost` | K |  |
| `standings.col.lost.tooltip` | Kalah |  |
| `standings.col.goalsFor` | GM |  |
| `standings.col.goalsFor.tooltip` | Gol Memasukkan |  |
| `standings.col.goalsAgainst` | GK | Bentrok dengan kode posisi GK; lihat bagian 7. |
| `standings.col.goalsAgainst.tooltip` | Gol Kemasukan |  |
| `standings.col.goalDifference` | SG |  |
| `standings.col.goalDifference.tooltip` | Selisih Gol |  |
| `standings.col.points` | Poin |  |
| `standings.col.points.tooltip` | Poin | Menang 3, seri 1, kalah 0. |
| `standings.col.fairPlay` | FP |  |
| `standings.col.fairPlay.tooltip` | Poin Fair Play: kuning −1, merah tidak langsung −3, merah langsung −4, kuning + merah langsung −5. Makin sedikit minus, makin baik. | Aturan dari PRD Bab 6.1. |

### Posisi dan statistik pemain

| Kunci | Teks | Catatan |
|---|---|---|
| `position.GK` | Kiper | Nilai Player.position. |
| `position.DF` | Bek |  |
| `position.MF` | Gelandang |  |
| `position.FW` | Penyerang |  |
| `player.stat.appearances` | Penampilan |  |
| `player.stat.minutes` | Menit Bermain |  |
| `player.stat.minutes.tooltip` | Perkiraan; data susunan pemain belum tersedia | Sesuai playerMetrics (menit adalah perkiraan). |
| `player.stat.goals` | Gol |  |
| `player.stat.assists` | Assist |  |
| `player.stat.yellowCards` | Kartu Kuning |  |
| `player.stat.redCards` | Kartu Merah |  |
| `player.rating` | Rating |  |
| `player.rating.tooltip` | Rating internal proyek, bukan rating resmi FIFA atau EA FC | Sesuai komentar calculatePlayerRating. |
| `data.unavailable.assists` | Data assist belum tersedia | Sesuai docs/known-gaps.md. |
| `data.unavailable.cards` | Data kartu belum tersedia | Sesuai docs/known-gaps.md. |
| `data.unavailable.generic` | Data belum tersedia |  |

### Label aksesibilitas (aria-label)

| Kunci | Teks | Catatan |
|---|---|---|
| `aria.toggleTheme.toLight` | Ganti ke mode terang | aria-label tombol ikon; tampil saat tema gelap. |
| `aria.toggleTheme.toDark` | Ganti ke mode gelap | Tampil saat tema terang. |
| `aria.zoomIn` | Perbesar bracket | Sama dengan bracket.zoomIn. |
| `aria.zoomOut` | Perkecil bracket | Sama dengan bracket.zoomOut. |
| `aria.zoomReset` | Atur ulang zoom bracket |  |
| `aria.menu.open` | Buka menu navigasi |  |
| `aria.menu.close` | Tutup menu navigasi |  |
| `aria.search.clear` | Hapus pencarian |  |
| `aria.back` | Kembali ke halaman sebelumnya |  |
| `aria.bracket.region` | Bracket fase gugur. Geser untuk menjelajah. | Label region yang bisa di-scroll. |
| `aria.standings.table` | Klasemen Grup {letter} | Label tabel. |
| `aria.row.qualified` | Lolos otomatis ke Babak 32 Besar | Teks sr-only pada baris peringkat 1–2. |
| `aria.row.bestThird` | Kandidat Best 3rd | Teks sr-only pada baris peringkat 3. |
| `aria.flag` | Bendera {teamName} |  |
| `aria.playerPhoto` | Foto {playerName} |  |
| `aria.matchScore` | {homeTeam} {homeScore}, {awayTeam} {awayScore} | Ringkasan skor untuk pembaca layar. |
| `aria.loading` | Memuat data | Region live saat skeleton tampil. |

## 5. Empty state, error, dan placeholder

### Empty state

| Kunci | Teks | Catatan |
|---|---|---|
| `empty.players.title` | Pemain tidak ditemukan di daftar skuad 2026. | Teks wajib dari PRD Bab 5.4. |
| `empty.players.body` | Cek ejaan nama, atau atur ulang filter tim dan posisi. |  |
| `empty.groups.title` | Belum ada klasemen untuk grup ini. |  |
| `empty.groups.body` | Klasemen muncul setelah pertandingan pertama dimainkan. |  |
| `empty.bracket.title` | Bracket belum tersedia. |  |
| `empty.bracket.body` | Bracket terisi setelah fase grup selesai. |  |
| `empty.playerStats.title` | Statistik pemain ini belum tersedia. |  |

### Pesan error

| Kunci | Teks | Catatan |
|---|---|---|
| `error.load.title` | Gagal memuat data |  |
| `error.load.body` | Periksa koneksi internetmu, lalu coba lagi. |  |
| `error.notFound.title` | Halaman tidak ditemukan |  |
| `error.notFound.body` | Alamat yang kamu buka tidak ada atau sudah dipindah. |  |
| `error.playerNotFound.title` | Pemain tidak ditemukan |  |
| `error.playerNotFound.body` | Profil ini tidak ada di daftar skuad 2026. Coba cari lewat halaman Pemain. | Beda dengan empty.players: ini untuk URL profil yang tidak valid. |
| `error.generic.title` | Terjadi kesalahan |  |
| `error.generic.body` | Ada yang tidak berjalan semestinya. Muat ulang halaman atau coba lagi nanti. |  |

### Placeholder pencarian dan filter

| Kunci | Teks | Catatan |
|---|---|---|
| `search.players.placeholder` | Cari nama pemain… |  |
| `filter.position.label` | Posisi |  |
| `filter.position.all` | Semua posisi |  |
| `filter.team.label` | Tim |  |
| `filter.team.all` | Semua tim |  |
| `filter.team.placeholder` | Pilih tim |  |

## 6. Label sumber slot bracket

Ejaan ini wajib dipakai bersama oleh Claude #2 (UI) dan Claude #3 (`buildBracket`).

| Kunci | Teks | Catatan |
|---|---|---|
| `bracket.slot.groupWinner` | Juara Grup {group} | Contoh: Juara Grup A. BracketSlotSource.kind = GROUP_POSITION, position 1. |
| `bracket.slot.groupRunnerUp` | Runner-up Grup {group} | Contoh: Runner-up Grup B. GROUP_POSITION, position 2. |
| `bracket.slot.thirdPlace` | Peringkat 3 (Grup {groups}) | {groups} = huruf terurut dipisah garis miring tanpa spasi. Contoh: Peringkat 3 (Grup A/B/C/D/F). kind = THIRD_PLACE. |
| `bracket.slot.matchWinner` | Pemenang {matchId} | {matchId} = Match.id. Contoh: Pemenang M-073. kind = MATCH_WINNER. |
| `bracket.slot.matchLoser` | Pecundang {matchId} | Contoh: Pecundang M-101. kind = MATCH_LOSER. |
| `bracket.slot.tbd` | Menunggu hasil | Slot yang tim dan sumbernya belum bisa ditampilkan. |

Contoh hasil akhir yang harus tampil: `Juara Grup A`, `Runner-up Grup B`, `Peringkat 3 (Grup A/B/C/D/F)`, `Pemenang M-073`, `Pecundang M-101`.

Pemetaan dari kode placeholder di data ke label (kode di data memakai format tanpa spasi; label memakai id laga `M-nnn`):

| Kode di data (`data-conventions.md` bagian 10.1) | Label |
|---|---|
| `1A` | Juara Grup A |
| `2B` | Runner-up Grup B |
| `3rd-ABCDF` | Peringkat 3 (Grup A/B/C/D/F) |
| `W-M073` | Pemenang M-073 |
| `L-M101` | Pecundang M-101 |

## 7. Catatan untuk pemakai teks

- Selisih ejaan yang ditemukan: komentar pada `src/types/index.d.ts` memberi contoh "Peringkat 3 Grup A/B/C/D/F" (tanpa tanda kurung), sedangkan `src/utils/buildBracket.ts` sudah menghasilkan "Peringkat 3 (Grup A/B/C/D/F)". Berkas ini mengikuti `buildBracket.ts` dan prompt tugas; contoh pada komentar tipe sebaiknya disesuaikan oleh pemiliknya (Claude #1).
- Kode kolom `GK` (Gol Kemasukan) sama dengan kode posisi `GK` (kiper) pada data. Teks posisi di UI memakai kata penuh (`position.GK` = Kiper); bila kode posisi disingkat di kartu sempit, pakai `aria-label` dari `position.*` agar tidak tertukar. Lihat daftar persetujuan di laporan akhir.
- Data assist, kartu, dan pergantian pemain belum tersedia (`docs/known-gaps.md`), sehingga assist, kartu, dan FP akan bernilai 0. Pakai `data.unavailable.*` di dekat angka itu agar 0 tidak terbaca sebagai fakta.
- Nama tim pada `teams.json` berbahasa Inggris (contoh "Korea Republic"). Teks di sini tidak menerjemahkannya; menerjemahkan nama tim butuh perubahan data dan bukan wewenang Claude #5.
- Menu dan teks tidak memuat klaim "langsung" atau "live". Seluruh 104 laga pada `matches.json` per berkas ini sudah berstatus selesai.
