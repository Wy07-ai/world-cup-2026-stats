# Sumber Data — teams.json (Claude #4)

Diperbarui terakhir: 2026-10-27 (hari ini menurut sistem). Berkas ini akan diperbarui lagi pada prompt 4 dan 5.

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
