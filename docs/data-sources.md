# Sumber Data — teams.json, matches.json, players.json (Claude #4)

Diperbarui terakhir: 2026-10-27 (hari ini menurut sistem). Bagian teams.json ditulis pada prompt 3; bagian "Data laga" di paling bawah ditambahkan pada prompt 4. Berkas ini akan diperbarui lagi pada prompt 5.

## Cek tanggal terhadap jadwal turnamen
Per 2026-10-27, `worldcup-full.json` memuat 104 laga; laga terakhir adalah Final pada 2026-07-19 (Spain vs Argentina). Turnamen sudah selesai dan seluruh 6 slot play-off sudah terisi, sehingga status kualifikasi **final** dan tidak ada slot placeholder (TB1, TB2, dst.) yang dibutuhkan.

## Sumber per kelompok data
Tidak ada akses internet yang dipakai; semua data berasal dari berkas mentah yang ditempelkan/diunggah pengguna. URL asal berkas tidak disebutkan pengguna, sehingga **URL tidak dicatat dan belum terverifikasi**. Tanggal akses = tanggal berkas diterima.

| Kelompok data | Berkas sumber | URL | Tanggal akses |
|---|---|---|---|
| Daftar 48 tim, kode FIFA, konfederasi, grup | `worldcup_teams.json` | tidak diberikan | 2026-10-27 |
| Pembagian grup dan urutan tim dalam grup | `worldcup_groups.json` | tidak diberikan | 2026-10-27 |
| Pemenang play-off (pemeriksaan silang) | `worldcup_quali_playoffs.json` | tidak diberikan | 2026-10-27 |
| Pemeriksaan silang nama tim & grup pada 72 laga grup | `worldcup-full.json` | tidak diberikan | 2026-10-27 |
| Dipakai agen lain, tidak dipakai di teams.json | `worldcup.json`, `worldcup_squads.json`, `worldcup_stadiums.json` | tidak diberikan | 2026-10-27 |

## Pemeriksaan silang yang dijalankan
- Urutan tim di `worldcup_groups.json` identik dengan urutan di `worldcup_teams.json` untuk 12 grup. Urutan ini dipakai sebagai posisi undian (A1..A4, dst.).
- Semua 72 laga fase grup di `worldcup-full.json` mempertemukan tim dari grup yang sama dengan `teams.json` (0 ketidakcocokan).
- Enam pemenang play-off (CZE grup A, BIH grup B, TUR grup D, SWE grup F, COD grup K, IRQ grup I) cocok dengan hasil final jalur di `worldcup_quali_playoffs.json`.

## Pemetaan nama (penting untuk Claude #5 dan #6)
`worldcup-full.json` memakai penamaan campuran. `teams.json` memakai `name_normalised` dari `worldcup_teams.json` bila ada. Untuk BIH dan CIV (tidak ada atau ejaan tanpa aksen di `name_normalised`) dipakai ejaan yang muncul di `worldcup-full.json`. Cocokkan data laga ke tim lewat tabel ini, bukan lewat nama.

| id | name di teams.json | name di worldcup_teams.json | nama di worldcup-full.json |
|---|---|---|---|
| KOR | Korea Republic | South Korea | South Korea |
| CZE | Czechia | Czech Republic | Czech Republic |
| BIH | Bosnia and Herzegovina | Bosnia & Herzegovina | Bosnia and Herzegovina |
| USA | United States | USA | USA |
| TUR | Türkiye | Turkey | Turkey |
| CIV | Côte d'Ivoire | Ivory Coast | Côte d'Ivoire |
| IRN | IR Iran | Iran | Iran |
| CPV | Cabo Verde | Cape Verde | Cabo Verde |
| COD | Congo DR | DR Congo | Congo DR |

## Belum terverifikasi
- URL dan tanggal publikasi asli semua berkas sumber.
- Penamaan resmi FIFA persis (mis. "Bosnia and Herzegovina" vs "Bosnia & Herzegovina", "Türkiye" vs "Turkey"): dipilih berdasarkan `name_normalised` dan ejaan di data laga, bukan dari situs FIFA.
- Urutan tim dalam grup sebagai posisi undian resmi: diasumsikan dari urutan berkas sumber.
- Kode FIFA 3 huruf per tim: diambil apa adanya dari `fifa_code`, tidak dicocokkan dengan daftar resmi FIFA.
- Kesesuaian dengan Master PRD: `docs/master-prd.md` masih placeholder, jadi Bab 4.3, 8.2, dan penamaan "United States" tidak dapat dicocokkan.

---

# Data laga (prompt 4): matches.json dan players.json

## Sumber dan tanggal akses
Data laga diambil dari repositori publik openfootball pada **2026-10-27**. Berkas mentah disalin ke `scripts/raw/` agar hasil dapat direproduksi dengan `node scripts/build-matches.mjs`.

| Kelompok data | Berkas (di `scripts/raw/`) | URL asal | Tanggal akses |
|---|---|---|---|
| Skor akhir, gol, menit, penalti, gol bunuh diri, jam kickoff lokal, kota | `worldcup.json` | https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json | 2026-10-27 |
| Nomor punggung, posisi, nama pemain (untuk id `PL-{TIM}-{NN}`) | `squads.json` | https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.squads.json | 2026-10-27 |
| Nama stadion per kota | `stadiums.json` | https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.stadiums.json | 2026-10-27 |

Catatan: berkas-berkas ini bukan berkas yang sama persis dengan `worldcup-full.json` yang disebut di bagian teams.json di atas (itu tidak tersedia di repositori ini). Pemeriksaan silang grup/tim terhadap `teams.json` dijalankan ulang terhadap `worldcup.json` di atas: 0 ketidakcocokan. Lisensi data openfootball **belum terverifikasi** oleh Claude #4.

## Zona waktu kickoff
Sumber menulis jam lokal stadion beserta offset UTC, misalnya `13:00 UTC-6`. `kickoffTime` dihitung dengan **UTC = jam lokal − offset** (contoh: 13:00 UTC-6 → 19:00Z; 20:00 UTC-4 → 00:00Z hari berikutnya). Offset memakai nilai yang tertulis di sumber per laga (Meksiko UTC-6 tanpa DST; kota AS/Kanada mengikuti waktu musim panas: Pasifik UTC-7, Tengah UTC-5, Timur UTC-4). Contoh pembanding PRD 4.2 (M-001, 2026-06-11T19:00:00Z) cocok persis. Offset sumber **belum diperiksa silang** dengan sumber kedua.

## Nomor laga (id M-xxx)
Sumber tidak memuat nomor resmi FIFA dan urutannya per grup, bukan kronologis. **Pilihan yang diambil:** id M-001 sampai M-072 diberikan **kronologis menurut kickoff UTC**; bila kickoff sama persis (laga serentak matchday 3), urutannya mengikuti huruf grup lalu urutan dalam grup di sumber. Nomor ini **belum diverifikasi terhadap nomor resmi FIFA** dan bisa berbeda untuk laga serentak. Bila nomor resmi didapat, ubah id lewat Claude #1 (id event ikut urutan laga).

## Matchday
Sumber memberi nomor "Matchday" global (1–17), bukan matchday per grup. `matchday` 1/2/3 dihitung per grup dari urutan kickoff: dua laga paling awal grup = 1, dua berikutnya = 2, dua terakhir = 3. Hasilnya tiap tim bermain tepat sekali pada tiap matchday (diperiksa validator).

## Venue
Format `"Nama Stadion, Kota"` memakai nama stadion dari `stadiums.json` (nama komersial, mis. "AT&T Stadium") dan string kota persis seperti di sumber (termasuk keterangan dalam kurung). Nama netral FIFA turnamen tidak dipakai; ini **belum diverifikasi** terhadap penamaan resmi PRD.

## Aturan pengisian events
- Hanya `GOAL`, `PENALTY_GOAL`, dan `OWN_GOAL` yang tersedia di sumber. Gol dengan penanda penalti menjadi `PENALTY_GOAL`; gol dengan penanda gol bunuh diri menjadi `OWN_GOAL`.
- Di sumber, gol bunuh diri dicantumkan pada daftar tim yang diuntungkan. Pada `matches.json`, `teamId` dan `playerId` OWN_GOAL diubah mengikuti konvensi 3(c): tim milik pemain yang membuat gol bunuh diri. Pemain dicari di skuad tim tersebut.
- Menit "90+4" → `minute: 90, extraMinute: 4`. Event diurutkan naik menurut `(minute, extraMinute)`, seri mengikuti urutan sumber (tim kandang dahulu). Id `E-0001` dst. berurutan global menurut id laga.
- Assist, kartu, dan pergantian **tidak tersedia** di sumber dan tidak diisi (lihat `docs/known-gaps.md`).

## players.json (entri minimal)
Hanya pemain yang muncul di event (154 pemain: pencetak gol dan pembuat gol bunuh diri). Id `PL-{KODE TIM}-{NN}` dari nomor punggung di `squads.json`; semua `stats` = 0; `photoUrl` = `/players/{id huruf kecil}.webp` (berkas foto belum ada; konvensi 6 menyebut placeholder.svg, tetapi PRD 4.1 dan prompt meminta .webp, jadi .webp dipakai). `shortName` diisi **nama belakang** (kata terakhir nama lengkap) sebagai asumsi karena sumber tidak memuat nama jersey; **belum terverifikasi**. Prompt 5 melengkapi skuad penuh tanpa mengubah id ini.

## Pencocokan nama pemain
Nama pencetak di data laga dicocokkan ke skuad tim: 215 gol → 215 pemain terselesaikan, 0 ambigu. Delapan nama berbeda ejaan dari skuad dan dicocokkan karena hanya ada satu kandidat; **perlu verifikasi manusia**:

| Laga | Nama di data laga | Pemain di skuad (id) | Jenis |
|---|---|---|---|
| M-015 | Maxi Araújo | Maximiliano Araújo (PL-URU-20) | alias ejaan/nama panggilan |
| M-016 | Mohammad Mohebbi | Mohammad Mohebi (PL-IRN-08) | alias ejaan/nama panggilan |
| M-039 | Maxi Araújo | Maximiliano Araújo (PL-URU-20) | alias ejaan/nama panggilan |
| M-039 | Agustín Cano | Agustín Canobbio (PL-URU-14) | alias ejaan/nama panggilan |
| M-040 | Mostafa Zico | Mostafa Ziko (PL-EGY-11) | alias ejaan/nama panggilan |
| M-050 | Mahmoud Abunada | Mahmud Abunada (PL-QAT-01) | alias ejaan/nama panggilan |
| M-059 | Baris Alper Yilmaz | Barış Alper Yılmaz (PL-TUR-21) | alias ejaan/nama panggilan |
| M-072 | Mousa Al-Tamari | Musa Al-Taamari (PL-JOR-10) | alias ejaan/nama panggilan |

## Belum terverifikasi (data laga)
- Kebenaran faktual skor, pencetak gol, dan menit: berasal dari satu sumber (openfootball), **tidak dicocokkan** dengan FIFA/Wikipedia karena tidak ada akses ke sumber itu. Konsistensi internal (skor = jumlah gol dari event) lolos validator, tetapi itu tidak membuktikan kebenaran faktual.
- Nomor laga M-001–M-072 terhadap nomor resmi FIFA (lihat di atas).
- Offset zona waktu per laga dan hasil konversi UTC (hanya M-001 yang dibandingkan dengan contoh PRD).
- Nama stadion terhadap penamaan resmi; `shortName` pemain; delapan pencocokan nama pemain pada tabel di atas.
- Status laga: semua 72 laga sudah lewat dari 2026-10-27 dan seluruhnya punya skor final di sumber, jadi daftar "Belum terverifikasi" untuk skor kosong (0 laga).
