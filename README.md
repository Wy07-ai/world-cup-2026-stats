# Platform Statistik Interaktif Piala Dunia FIFA 2026

Aplikasi web berbasis Next.js (App Router, TypeScript strict, Tailwind CSS) untuk menampilkan statistik interaktif Piala Dunia FIFA 2026: fase grup, bagan gugur, dan profil pemain, dengan dukungan dark mode berbasis class.

## Perintah

```bash
npm install        # pasang dependensi
npm run dev        # server pengembangan di http://localhost:3000
npm run build      # build produksi
npm run validate   # validasi integritas data (lihat bagian Validasi data)
npm test           # jalankan Vitest
```

Perintah tambahan: `npm run lint`, `npm run typecheck`, `npm start`.

## Validasi data

`npm run validate` memeriksa `src/data/teams.json`, `players.json`, dan `matches.json`; jalankan sebelum build dan saat audit data. Karena data disimpan sebagai JSON statis (tanpa foreign key bawaan database), skrip ini menjadi gerbang kualitas yang mewajibkan relasi antar-berkas tetap utuh (acuan: PRD Bab 4.3). Skrip hanya **membaca**; ia tidak pernah mengubah berkas data. Temuan ERROR diperbaiki oleh pemilik data (Claude #4), bukan dengan mengedit data agar validasi lulus.

### Cara menjalankan

```bash
npm run validate                          # data asli di src/data
npm run validate -- --strict              # WARNING dianggap ERROR
npm run validate -- --data-dir <folder>   # data lain, mis. salinan sementara untuk uji
npm run validate -- --verbose             # tampilkan semua WARNING (bukan hanya 10 per kode)
npm run validate -- --list-codes          # cetak daftar kode
```

| Opsi | Fungsi | Default |
|---|---|---|
| `--data-dir <path>` | Folder berisi `teams.json`, `players.json`, `matches.json` | `src/data` |
| `--strict` | Semua WARNING menjadi ERROR | mati |
| `--public-dir <path>` | Folder aset untuk cek bendera dan foto | `public` |
| `--known-gaps <path>` | Berkas pengecualian skor | `docs/known-gaps.md` |
| `--verbose` | Tampilkan semua WARNING | maksimal 10 per kode |

Path relatif dihitung dari folder tempat perintah dijalankan (jalankan dari akar proyek). `npm run validate` dengan argumen perlu tanda `--` sebelum opsi.

### Kode keluar

| Kode | Arti |
|---|---|
| `0` | Lolos (tidak ada ERROR; WARNING boleh ada kecuali dengan `--strict`) |
| `1` | Ada ERROR, atau ada WARNING saat `--strict` |
| `2` | Salah penggunaan (opsi tidak dikenal) atau kesalahan internal skrip |

### Cara membaca laporan

1. **Ringkasan per kategori**: jumlah ERROR dan WARNING untuk tiap kategori (nama kategori = bagian tengah kode, mis. `FK` pada `E-FK-001`). Kategori bernilai 0 berarti pengecekannya dijalankan dan lolos.
2. **Daftar temuan**, satu baris per temuan, diurutkan menurut kode:

   ```
   [KODE] berkas > lokasi: pesan
   [E-FK-001] players.json > PL-ARG-10 (indeks 35): teamId "ZZZ" tidak ada di teams.json.
   [E-EVT-002] matches.json > M-019 > E-0056 (indeks 0): Pemain PL-ARG-10 milik tim ZZZ, bukan ARG.
   ```

   `lokasi` memuat id entitas dan **indeks** elemen di dalam array JSON (mulai dari 0). Untuk event: `id laga > id event (indeks event)`.
3. **Satu kerusakan bisa memicu beberapa temuan.** Mis. teamId pemain yang salah juga memunculkan `E-FMT-005` dan `E-EVT-002` pada event pemain itu. Perbaiki sumbernya dulu, lalu jalankan ulang.
4. Daftar WARNING dipangkas maksimal 10 per kode; jumlah di ringkasan tetap lengkap. Gunakan `--verbose` untuk daftar penuh. ERROR tidak pernah dipangkas.
5. Baris terakhir: `HASIL: LULUS/GAGAL`.

**ERROR** = data pasti salah (melanggar kontrak tipe atau aturan integritas). **WARNING** = mencurigakan atau belum lengkap (skor tidak sama dengan jumlah gol event, bendera/foto belum ada, bendera terlalu besar, field tambahan).

### Pengecualian skor

`W-SCR-001` melewati laga yang tercantum pada bagian **berjudul "Pengecualian skor"** di `docs/known-gaps.md` (setiap `M-NNN` di bawah judul itu sampai judul berikutnya yang selevel atau lebih tinggi). Bagian lain berkas itu, termasuk tabel "Per laga" yang mendaftar assist/kartu yang belum tersedia, **tidak** dianggap pengecualian.

### Daftar kode

Awalan `E-` = ERROR, `W-` = WARNING. Daftar ini sama dengan `--list-codes`.

| Kode | Tingkat | Arti |
|---|---|---|
| `E-STR-001` | ERROR | Berkas tidak ditemukan, tidak terbaca, atau bukan JSON valid |
| `E-STR-002` | ERROR | Isi berkas bukan array |
| `E-STR-003` | ERROR | Elemen tidak sesuai tipe Team / Player / Match |
| `E-STR-004` | ERROR | Event di dalam laga tidak sesuai tipe MatchEvent |
| `W-STR-001` | WARNING | Field tambahan yang tidak ada di kontrak tipe |
| `E-FK-001` | ERROR | players.json: teamId tidak ada di teams.json |
| `E-FK-002` | ERROR | matches.json: homeTeamId/awayTeamId tidak ada di teams.json dan bukan placeholder resmi |
| `E-FK-003` | ERROR | Placeholder bracket dipakai pada laga fase grup |
| `E-FK-004` | ERROR | event.playerId tidak ada di players.json |
| `E-FK-005` | ERROR | event.relatedPlayerId tidak ada di players.json |
| `E-FK-006` | ERROR | event.teamId tidak ada di teams.json |
| `E-PH-001` | ERROR | Placeholder W-Mnnn / L-Mnnn merujuk laga yang tidak ada atau bukan laga yang lebih awal |
| `E-PH-002` | ERROR | Pola placeholder tidak diizinkan pada fase laga tersebut |
| `E-ID-001` | ERROR | id tim tidak unik |
| `E-ID-002` | ERROR | id pemain tidak unik |
| `E-ID-003` | ERROR | id laga tidak unik |
| `E-ID-004` | ERROR | id event tidak unik (harus unik global di seluruh laga) |
| `E-FMT-001` | ERROR | id tim bukan 3 huruf kapital |
| `E-FMT-002` | ERROR | id pemain tidak sesuai pola PL-XXX-NN |
| `E-FMT-003` | ERROR | id laga tidak sesuai pola M-NNN (001–104) |
| `E-FMT-004` | ERROR | id event tidak sesuai pola E-NNNN |
| `E-FMT-005` | ERROR | id pemain tidak cocok dengan teamId dan nomor punggungnya |
| `E-FMT-006` | ERROR | Team.code tidak sama dengan Team.id |
| `E-CNT-001` | ERROR | Jumlah tim bukan 48 |
| `E-CNT-002` | ERROR | Jumlah laga bukan 104 |
| `E-CNT-003` | ERROR | Susunan grup bukan 12 grup (A–L) x 4 tim |
| `E-CNT-004` | ERROR | Jumlah laga per fase tidak sesuai 72/16/8/4/2/1/1 |
| `E-TIME-001` | ERROR | kickoffTime bukan format ISO UTC berakhiran Z (YYYY-MM-DDTHH:mm:ssZ) |
| `E-TIME-002` | ERROR | kickoffTime berpola benar tetapi bukan tanggal/jam yang valid |
| `E-STAT-001` | ERROR | player.stats memuat angka bukan 0 (statistik hanya boleh hasil kalkulasi) |
| `E-PLR-001` | ERROR | Nomor punggung ganda di dalam satu tim |
| `E-PLR-002` | ERROR | Nomor punggung bukan bilangan bulat 1–99 |
| `E-GRP-001` | ERROR | Tim fase grup tidak bermain tepat 3 laga |
| `E-GRP-002` | ERROR | Pasangan tim yang sama bertemu lebih dari sekali di fase grup |
| `E-GRP-003` | ERROR | Tim pada laga grup bukan anggota grup laga tersebut |
| `E-GRP-004` | ERROR | Matchday tim fase grup bukan tepat 1, 2, dan 3 |
| `E-MTC-001` | ERROR | homeTeamId sama dengan awayTeamId |
| `E-MTC-002` | ERROR | Skor adu penalti ada pada laga fase grup |
| `E-MTC-003` | ERROR | Skor adu penalti tidak berpasangan atau bukan bilangan bulat >= 0 |
| `E-MTC-004` | ERROR | Skor adu penalti ada tetapi skor laga tidak seri, atau kedua skor penalti sama |
| `E-MTC-005` | ERROR | groupLetter/matchday tidak konsisten dengan fase laga |
| `E-MTC-006` | ERROR | Laga dengan placeholder dilarang selesai, bernilai bukan 0-0, atau punya event/penalti |
| `E-MTC-007` | ERROR | Skor laga bukan bilangan bulat >= 0 |
| `E-MTC-008` | ERROR | Laga belum selesai tetapi skor bukan 0-0 atau sudah punya event/penalti |
| `E-MTC-009` | ERROR | Laga fase gugur selesai seri tanpa adu penalti (tidak ada pemenang) |
| `E-EVT-001` | ERROR | event.teamId bukan salah satu dari dua tim laga |
| `E-EVT-002` | ERROR | event.playerId bukan milik tim event.teamId |
| `E-EVT-003` | ERROR | minute bukan bilangan bulat 1–120 |
| `E-EVT-004` | ERROR | Laga fase grup memuat event dengan minute > 90 |
| `E-EVT-005` | ERROR | extraMinute tidak valid (harus bilangan bulat >= 1 dan minute 45/90/105/120) |
| `E-EVT-006` | ERROR | relatedPlayerId ada/tidak ada tidak sesuai jenis event |
| `E-EVT-007` | ERROR | relatedPlayerId sama dengan playerId atau berasal dari tim lain |
| `W-SCR-001` | WARNING | Skor laga tidak sama dengan jumlah gol dari events |
| `E-AST-001` | ERROR | flagUrl/photoUrl bukan path relatif berawalan / di dalam public/ |
| `W-AST-001` | WARNING | Berkas bendera belum ada di public/ |
| `W-AST-002` | WARNING | Berkas foto pemain belum ada di public/ |
| `W-AST-003` | WARNING | Berkas bendera lebih dari 5 KB |

### Catatan

- 5 KB pada `W-AST-003` dihitung 5 × 1024 = 5120 byte.
- Skrip tidak memeriksa kebenaran faktual (skor, pencetak gol, skuad) terhadap dunia nyata; itu di luar jangkauan validasi struktur. Pemeriksaan silang terhadap sumber mentah ada di `scripts/validate-data.mjs` (Claude #4).

## Dokumentasi

Sumber kebenaran proyek: [docs/master-prd.md](docs/master-prd.md)
