# Design Tokens — Platform Statistik Piala Dunia FIFA 2026

> Pemilik: Claude #5 (UI/UX Strategist & Copywriter). Berkas ini berisi nilai token dan konfigurasi tema; tidak ada logika.

**Acuan PRD:** Master PRD Bab 5.1 (Tema Visual dan Sistem Warna) menjadi acuan utama, dengan Bab 5.2 (komponen), Bab 5.4 (transisi dan state), Bab 3.3 (Tailwind dan `cn()`), dan Bab 7.2 (batas wewenang Claude #5).

Catatan sumber: `docs/master-prd.md` di repositori masih berupa placeholder. PRD yang dibaca adalah `master-prd-world-cup-2026-lengkap.docx`.

## 1. Prinsip visual dan aturan warna aksen

Antarmuka dibuat modern, sporty, dan elegan: permukaan netral yang tenang, dengan aksen turnamen (Cyan, Magenta, Neon Green) dipakai hemat sebagai penanda, bukan latar luas. Keterbacaan di luar ruangan adalah prioritas utama, jadi kontras tinggi, angka besar dan tegas (Oswald), dan tidak ada informasi yang hanya dibawa oleh warna. Warna neon bekerja sebagai latar dengan teks gelap; sebagai teks atau garis, Light Mode memakai varian *ink* yang lebih gelap, sedangkan Dark Mode boleh memakai aksen langsung karena hasil hitungnya lulus. Gerak dibuat singkat (200 ms) dan selalu menghormati preferensi gerak pengguna.

**Peran aksen**

| Aksen | Peran | Contoh |
|---|---|---|
| Cyan | Interaktif | Tautan, tab aktif, fokus keyboard, tombol primer |
| Magenta | Sorotan | Badge rating, penanda pencetak gol terbanyak, ilustrasi besar |
| Neon Green | Positif dan hidup | Chip "Lolos", penanda menang, indikator aktif |

**Boleh**

- Memakai `accent-cyan`, `accent-magenta`, `accent-neon` (nilai mentah) sebagai **latar** tombol, chip, dan indikator besar, dengan teks `on-accent` (#0B1220) di atasnya. Semua pasangan ini lulus (bagian 3).
- Memakai `accent-*-ink` untuk **teks, ikon, garis tipis, dan outline fokus**. Token ini sudah diturunkan per tema sehingga lulus di Light maupun Dark.
- Memakai tint semantik (`success-bg`, `warning-bg`) untuk menyorot baris klasemen, selalu bersama penanda non-warna (ikon, teks, atau chip).
- Satu aksen dominan per komponen; aksen kedua hanya sebagai pelengkap kecil.
- Semua warna lewat token pada bagian 2. Komponen memakai kelas token (`bg-surface`, `text-fg`), bukan `dark:` per warna, karena token sudah berganti otomatis mengikuti tema.

**Tidak boleh**

- Memakai nilai mentah aksen sebagai **teks, ikon tipis, atau garis tipis** di Light Mode. Hasil hitung terhadap putih: Cyan 1,82:1, Neon 1,36:1, Magenta 3,20:1 (butuh 4,5:1 untuk teks).
- Menaruh **teks putih** di atas latar aksen mentah (Cyan 1,82:1, Neon 1,36:1, Magenta 3,20:1). Selalu `text-on-accent`.
- Menyampaikan status (lolos, menang, kandidat Best 3rd, tersingkir) **hanya dengan warna**. Wajib ada ikon, teks, atau bentuk.
- Efek glow atau bayangan berwarna neon, dan gradien neon pada area luas: menyilaukan pada layar gelap dan cahaya berubah.
- Menaruh dua aksen berbeda berdampingan pada elemen kecil (chip, badge) dan memakai ketiganya sekaligus dalam satu kartu.
- Menambahkan nilai Hex baru di komponen tanpa lebih dulu menambah token dan menghitung kontrasnya.

## 2. Token warna

Latar Light Mode: `gray-50` (#F9FAFB), kartu `white`. Latar Dark Mode: `slate-900` (#0F172A), kartu `slate-800` (#1E293B). Dipilih `slate-900` (bukan `zinc-950`) agar satu keluarga dengan kartu `slate-800` dan teks `slate-*`.

| Token | Kelas Tailwind | Light | Dark | Fungsi |
|---|---|---|---|---|
| `canvas` | `bg-canvas` | `#F9FAFB` | `#0F172A` | Latar halaman (Light = gray-50, Dark = slate-900) |
| `surface` | `bg-surface` | `#FFFFFF` | `#1E293B` | Kartu, tabel, navbar (Light = white, Dark = slate-800) |
| `surface-muted` | `bg-surface-muted` | `#F3F4F6` | `#283548` | Header tabel, skeleton, hover baris. Dark = slate-700 50% di atas slate-800 |
| `line` | `border-line` | `#E5E7EB` | `#334155` | Border dekoratif kartu dan pemisah |
| `line-strong` | `border-line-strong` | `#6B7280` | `#64748B` | Border input, tombol sekunder (komponen UI, butuh 3:1) |
| `fg` | `text-fg` | `#111827` | `#F8FAFC` | Teks utama |
| `fg-secondary` | `text-fg-secondary` | `#4B5563` | `#CBD5E1` | Teks sekunder |
| `fg-muted` | `text-fg-muted` | `#626B79` | `#A0AEC0` | Teks samar (label kecil, keterangan) |
| `accent-cyan` | `bg-accent-cyan` | `#00D1FF` | `#22D3EE` | Aksen Cyan, **hanya latar**. Dark disesuaikan agar tidak menyilaukan |
| `accent-magenta` | `bg-accent-magenta` | `#FF2BD6` | `#FF5CE1` | Aksen Magenta, **hanya latar** |
| `accent-neon` | `bg-accent-neon` | `#39FF14` | `#6EF05A` | Aksen Neon Green, **hanya latar** |
| `accent-cyan-ink` | `text-accent-cyan-ink` | `#0E7490` | `#22D3EE` | Cyan untuk teks, ikon, garis, fokus |
| `accent-magenta-ink` | `text-accent-magenta-ink` | `#B0006F` | `#FF5CE1` | Magenta untuk teks, ikon, garis |
| `accent-neon-ink` | `text-accent-neon-ink` | `#166534` | `#6EF05A` | Neon untuk teks, ikon, garis |
| `on-accent` | `text-on-accent` | `#0B1220` | `#0B1220` | Teks di atas latar aksen mentah |
| `success-fg` | `text-success-fg` | `#166534` | `#4ADE80` | Teks sukses/menang |
| `success-bg` | `bg-success-bg` | `#F0FDF4` | `rgb(74, 222, 128 / 0,12) ≈ #233F43` | Tint sukses; baris klasemen peringkat 1–2 |
| `success` | `bg-success / border-success` | `#16A34A` | `#4ADE80` | Bar, ikon, dan garis sukses (komponen UI) |
| `warning-fg` | `text-warning-fg` | `#92400E` | `#FCD34D` | Teks peringatan / Best 3rd |
| `warning-bg` | `bg-warning-bg` | `#FFFBEB` | `rgb(252, 211, 77 / 0,12) ≈ #393D3D` | Tint peringatan; baris klasemen peringkat 3 |
| `warning` | `bg-warning / border-warning` | `#B45309` | `#FBBF24` | Bar, ikon, dan garis peringatan |
| `danger-fg` | `text-danger-fg` | `#B91C1C` | `#FA8383` | Teks bahaya/error |
| `danger-bg` | `bg-danger-bg` | `#FEF2F2` | `rgb(250, 131, 131 / 0,12) ≈ #383444` | Tint bahaya |
| `danger` | `bg-danger / border-danger` | `#DC2626` | `#F87171` | Bar, ikon, dan garis bahaya |
| `info-fg` | `text-info-fg` | `#0369A1` | `#38BDF8` | Teks info |
| `info-bg` | `bg-info-bg` | `#F0F9FF` | `rgb(56, 189, 248 / 0,12) ≈ #213B52` | Tint info |
| `info` | `bg-info / border-info` | `#0284C7` | `#38BDF8` | Bar, ikon, dan garis info |

Tint Dark berupa warna dengan alfa 0,12; nilai Hex di kolom adalah hasil campur di atas `surface` Dark (#1E293B) dengan rumus `hasil = 0,12 × aksen + 0,88 × surface` per kanal RGB, dibulatkan. Tint Dark hanya boleh dipakai di atas `surface`.

Konvensi nama: `accent-{warna}` = latar; `accent-{warna}-ink` = teks/ikon/garis; `{semantik}-fg` = teks; `{semantik}-bg` = tint; `{semantik}` polos = bar/ikon/garis. Semantik: `success` (sukses/menang), `warning` (peringatan/Best 3rd), `danger`, `info`.

## 3. Kontras (WCAG 2.x AA)

**Rumus (WCAG 2.x).** Tiap kanal sRGB `c` dibagi 255 lalu dilinearkan: bila `c ≤ 0,03928` maka `c/12,92`, selain itu `((c + 0,055) / 1,055)^2,4`. Luminans relatif `L = 0,2126·R + 0,7152·G + 0,0722·B`. Rasio kontras `(L terang + 0,05) / (L gelap + 0,05)`. Ambang AA: teks normal 4,5:1; teks besar dan komponen UI 3:1.

**Alat.** Skrip Python sekali pakai yang menerapkan rumus di atas (bukan bagian repositori), dijalankan terhadap seluruh nilai pada bagian 2. Rasio ditulis **dibulatkan ke bawah** pada dua desimal agar tidak ada nilai yang naik melewati ambang.
**Contoh hitung.** `accent-cyan-ink` Light (#0E7490) di atas `surface` (#FFFFFF): L(#0E7490) = 0,1460, L(#FFFFFF) = 1,0000, rasio = (1,0000 + 0,05) / (0,1460 + 0,05) = 5,35:1.

Semua pasangan **teks** dinilai pada ambang 4,5:1, termasuk teks besar (skor Oswald ≥ 24 px), karena seluruhnya lulus pada ambang yang lebih ketat. Komponen UI (bar, border input, ikon, outline fokus) dinilai pada 3:1.

| Pasangan | Light (fg / bg) | Rasio | AA | Dark (fg / bg) | Rasio | AA |
|---|---|---|---|---|---|---|
| Teks fg di atas canvas | `#111827` / `#F9FAFB` | 16,97 | Lulus | `#F8FAFC` / `#0F172A` | 17,06 | Lulus |
| Teks fg-secondary di atas canvas | `#4B5563` / `#F9FAFB` | 7,23 | Lulus | `#CBD5E1` / `#0F172A` | 12,02 | Lulus |
| Teks fg-muted di atas canvas | `#626B79` / `#F9FAFB` | 5,15 | Lulus | `#A0AEC0` / `#0F172A` | 7,91 | Lulus |
| Teks fg di atas surface | `#111827` / `#FFFFFF` | 17,73 | Lulus | `#F8FAFC` / `#1E293B` | 13,98 | Lulus |
| Teks fg-secondary di atas surface | `#4B5563` / `#FFFFFF` | 7,55 | Lulus | `#CBD5E1` / `#1E293B` | 9,85 | Lulus |
| Teks fg-muted di atas surface | `#626B79` / `#FFFFFF` | 5,38 | Lulus | `#A0AEC0` / `#1E293B` | 6,48 | Lulus |
| Teks fg di atas surface-muted | `#111827` / `#F3F4F6` | 16,11 | Lulus | `#F8FAFC` / `#283548` | 11,85 | Lulus |
| Teks fg-secondary di atas surface-muted | `#4B5563` / `#F3F4F6` | 6,86 | Lulus | `#CBD5E1` / `#283548` | 8,35 | Lulus |
| Teks fg-muted di atas surface-muted | `#626B79` / `#F3F4F6` | 4,89 | Lulus | `#A0AEC0` / `#283548` | 5,49 | Lulus |
| Teks/ikon aksen (cyan-ink) di atas canvas | `#0E7490` / `#F9FAFB` | 5,12 | Lulus | `#22D3EE` / `#0F172A` | 9,87 | Lulus |
| Teks/ikon aksen (magenta-ink) di atas canvas | `#B0006F` / `#F9FAFB` | 6,53 | Lulus | `#FF5CE1` / `#0F172A` | 6,69 | Lulus |
| Teks/ikon aksen (neon-ink) di atas canvas | `#166534` / `#F9FAFB` | 6,82 | Lulus | `#6EF05A` / `#0F172A` | 12,13 | Lulus |
| Aksen mentah (cyan) sebagai TEKS di atas canvas | `#00D1FF` / `#F9FAFB` | 1,73 | GAGAL (4,5:1) | `#22D3EE` / `#0F172A` | 9,87 | Lulus |
| Aksen mentah (magenta) sebagai TEKS di atas canvas | `#FF2BD6` / `#F9FAFB` | 3,05 | GAGAL (4,5:1) | `#FF5CE1` / `#0F172A` | 6,69 | Lulus |
| Aksen mentah (neon) sebagai TEKS di atas canvas | `#39FF14` / `#F9FAFB` | 1,29 | GAGAL (4,5:1) | `#6EF05A` / `#0F172A` | 12,13 | Lulus |
| Teks/ikon aksen (cyan-ink) di atas surface | `#0E7490` / `#FFFFFF` | 5,35 | Lulus | `#22D3EE` / `#1E293B` | 8,09 | Lulus |
| Teks/ikon aksen (magenta-ink) di atas surface | `#B0006F` / `#FFFFFF` | 6,82 | Lulus | `#FF5CE1` / `#1E293B` | 5,48 | Lulus |
| Teks/ikon aksen (neon-ink) di atas surface | `#166534` / `#FFFFFF` | 7,13 | Lulus | `#6EF05A` / `#1E293B` | 9,94 | Lulus |
| Aksen mentah (cyan) sebagai TEKS di atas surface | `#00D1FF` / `#FFFFFF` | 1,81 | GAGAL (4,5:1) | `#22D3EE` / `#1E293B` | 8,09 | Lulus |
| Aksen mentah (magenta) sebagai TEKS di atas surface | `#FF2BD6` / `#FFFFFF` | 3,19 | GAGAL (4,5:1) | `#FF5CE1` / `#1E293B` | 5,48 | Lulus |
| Aksen mentah (neon) sebagai TEKS di atas surface | `#39FF14` / `#FFFFFF` | 1,35 | GAGAL (4,5:1) | `#6EF05A` / `#1E293B` | 9,94 | Lulus |
| Teks gelap di atas latar cyan | `#0B1220` / `#00D1FF` | 10,31 | Lulus | `#0B1220` / `#22D3EE` | 10,36 | Lulus |
| Teks gelap di atas latar magenta | `#0B1220` / `#FF2BD6` | 5,85 | Lulus | `#0B1220` / `#FF5CE1` | 7,01 | Lulus |
| Teks gelap di atas latar neon | `#0B1220` / `#39FF14` | 13,80 | Lulus | `#0B1220` / `#6EF05A` | 12,72 | Lulus |
| Aksen mentah (cyan) sebagai komponen UI/garis di atas surface | `#00D1FF` / `#FFFFFF` | 1,81 | GAGAL (3,0:1) | `#22D3EE` / `#1E293B` | 8,09 | Lulus |
| Aksen mentah (magenta) sebagai komponen UI/garis di atas surface | `#FF2BD6` / `#FFFFFF` | 3,19 | Lulus | `#FF5CE1` / `#1E293B` | 5,48 | Lulus |
| Aksen mentah (neon) sebagai komponen UI/garis di atas surface | `#39FF14` / `#FFFFFF` | 1,35 | GAGAL (3,0:1) | `#6EF05A` / `#1E293B` | 9,94 | Lulus |
| Border input/tombol di atas surface | `#6B7280` / `#FFFFFF` | 4,83 | Lulus | `#64748B` / `#1E293B` | 3,07 | Lulus |
| Border input/tombol di atas canvas | `#6B7280` / `#F9FAFB` | 4,62 | Lulus | `#64748B` / `#0F172A` | 3,75 | Lulus |
| Border kartu (dekoratif, tidak wajib 3:1) | `#E5E7EB` / `#FFFFFF` | 1,23 | Tidak dinilai (dekoratif) | `#334155` / `#1E293B` | 1,41 | Tidak dinilai (dekoratif) |
| Teks success di atas surface | `#166534` / `#FFFFFF` | 7,13 | Lulus | `#4ADE80` / `#1E293B` | 8,39 | Lulus |
| Teks success di atas tint success | `#166534` / `#F0FDF4` | 6,81 | Lulus | `#4ADE80` / `#233F43` | 6,46 | Lulus |
| Bar/ikon success solid di atas surface | `#16A34A` / `#FFFFFF` | 3,29 | Lulus | `#4ADE80` / `#1E293B` | 8,39 | Lulus |
| Teks warning di atas surface | `#92400E` / `#FFFFFF` | 7,09 | Lulus | `#FCD34D` / `#1E293B` | 10,14 | Lulus |
| Teks warning di atas tint warning | `#92400E` / `#FFFBEB` | 6,83 | Lulus | `#FCD34D` / `#393D3D` | 7,62 | Lulus |
| Bar/ikon warning solid di atas surface | `#B45309` / `#FFFFFF` | 5,02 | Lulus | `#FBBF24` / `#1E293B` | 8,76 | Lulus |
| Teks danger di atas surface | `#B91C1C` / `#FFFFFF` | 6,47 | Lulus | `#FA8383` / `#1E293B` | 6,01 | Lulus |
| Teks danger di atas tint danger | `#B91C1C` / `#FEF2F2` | 5,91 | Lulus | `#FA8383` / `#383444` | 4,95 | Lulus |
| Bar/ikon danger solid di atas surface | `#DC2626` / `#FFFFFF` | 4,82 | Lulus | `#F87171` / `#1E293B` | 5,28 | Lulus |
| Teks info di atas surface | `#0369A1` / `#FFFFFF` | 5,93 | Lulus | `#38BDF8` / `#1E293B` | 6,82 | Lulus |
| Teks info di atas tint info | `#0369A1` / `#F0F9FF` | 5,56 | Lulus | `#38BDF8` / `#213B52` | 5,40 | Lulus |
| Bar/ikon info solid di atas surface | `#0284C7` / `#FFFFFF` | 4,09 | Lulus | `#38BDF8` / `#1E293B` | 6,82 | Lulus |
| Teks fg di atas baris klasemen (success) | `#111827` / `#F0FDF4` | 16,94 | Lulus | `#F8FAFC` / `#233F43` | 10,77 | Lulus |
| Teks fg-secondary di atas baris klasemen (success) | `#4B5563` / `#F0FDF4` | 7,21 | Lulus | `#CBD5E1` / `#233F43` | 7,59 | Lulus |
| Teks fg-muted di atas baris klasemen (success) | `#626B79` / `#F0FDF4` | 5,14 | Lulus | `#A0AEC0` / `#233F43` | 4,99 | Lulus |
| Bar penanda baris vs tint (success) | `#16A34A` / `#F0FDF4` | 3,14 | Lulus | `#4ADE80` / `#233F43` | 6,46 | Lulus |
| Teks fg di atas baris klasemen (warning) | `#111827` / `#FFFBEB` | 17,10 | Lulus | `#F8FAFC` / `#393D3D` | 10,51 | Lulus |
| Teks fg-secondary di atas baris klasemen (warning) | `#4B5563` / `#FFFBEB` | 7,28 | Lulus | `#CBD5E1` / `#393D3D` | 7,40 | Lulus |
| Teks fg-muted di atas baris klasemen (warning) | `#626B79` / `#FFFBEB` | 5,19 | Lulus | `#A0AEC0` / `#393D3D` | 4,87 | Lulus |
| Bar penanda baris vs tint (warning) | `#B45309` / `#FFFBEB` | 4,84 | Lulus | `#FBBF24` / `#393D3D` | 6,59 | Lulus |

### Pasangan yang gagal AA dan solusinya

| Pasangan | Hasil | Solusi |
|---|---|---|
| `accent-cyan` (#00D1FF) sebagai teks di atas `surface`/`canvas`, Light | 1,81:1 / 1,73:1, gagal 4,5:1 | Dilarang sebagai teks. Pakai `accent-cyan-ink` (#0E7490; 5,35:1 di atas putih) atau jadikan latar dengan `on-accent` (10,31:1). |
| `accent-magenta` (#FF2BD6) sebagai teks di atas `surface`/`canvas`, Light | 3,19:1 / 3,05:1, gagal 4,5:1 | Dilarang sebagai teks. Pakai `accent-magenta-ink` (#B0006F; 6,82:1) atau latar dengan `on-accent` (5,85:1). Sebagai komponen UI lulus 3:1 hanya di atas putih (3,19:1); di atas `canvas` 3,05:1 sehingga tetap pakai ink. |
| `accent-neon` (#39FF14) sebagai teks atau garis di atas `surface`/`canvas`, Light | 1,35:1 / 1,29:1, gagal | Dilarang sebagai teks atau garis. Pakai `accent-neon-ink` (#166534; 7,13:1) atau latar dengan `on-accent` (13,80:1). |
| `accent-cyan`/`accent-neon` sebagai garis atau ikon UI di atas `surface`, Light | 1,81:1 dan 1,35:1, gagal 3:1 | Garis, ikon, dan outline fokus memakai `accent-*-ink`; area besar berlatar aksen dikelilingi teks `on-accent`. |
| Teks putih di atas latar aksen mentah | Cyan 1,81:1, Neon 1,35:1, Magenta 3,19:1 | Tidak dipakai. Latar aksen selalu berteks `on-accent`. |
| `line` di atas `surface` (border kartu) | Light 1,23:1, Dark 1,41:1 | Border ini dekoratif (batas kartu juga dibantu perbedaan latar dan bayangan), jadi tidak dinilai 3:1. Batas yang berfungsi sebagai kontrol (input, tombol sekunder) memakai `line-strong` (4,83:1 Light, 3,07:1 Dark). |

Di Dark Mode seluruh aksen mentah lulus sebagai teks karena sudah disesuaikan (Cyan #22D3EE, Magenta #FF5CE1, Neon #6EF05A), sehingga `accent-*-ink` Dark bernilai sama dengan `accent-*`.

### Highlight baris klasemen

Warna menandai, tetapi bukan satu-satunya pembawa informasi (lihat penanda non-warna di bawah tabel).

| Peringkat | Makna | Latar Light | Latar Dark | Bar kiri 4 px (Light / Dark) | Kelas |
|---|---|---|---|---|---|
| 1–2 | Lolos otomatis | `#F0FDF4` | `#233F43` | `#16A34A` / `#4ADE80` | `bg-success-bg border-l-4 border-success` |
| 3 | Kandidat Best 3rd | `#FFFBEB` | `#393D3D` | `#B45309` / `#FBBF24` | `bg-warning-bg border-l-4 border-warning` |
| 4 | Tidak lolos | tanpa highlight | tanpa highlight | tanpa bar | `bg-surface` |

Kontras teks pada baris ber-highlight (fg, fg-secondary, fg-muted di atas tint) dan kontras bar terhadap tint serta `surface` tercantum pada tabel di atas dan seluruhnya lulus.

**Penanda non-warna (wajib):**

- Angka peringkat selalu tampil di kolom `#`.
- Peringkat 1–2: ikon `Check` di sebelah angka peringkat, ditambah teks sr-only `aria.row.qualified`; pada ≥ 768 px chip teks `status.qualified`.
- Peringkat 3: ikon `Hourglass` (bentuk berbeda dari `Check`), teks sr-only `aria.row.bestThird`, dan chip `status.bestThirdShort`. Setelah perbandingan 12 tim peringkat 3 final, chip berganti menjadi `status.qualifiedAsBestThird` atau `status.eliminated`.
- Legenda di atas tabel memakai ikon dan teks yang sama (`groups.legend.qualified`, `groups.legend.bestThird`).
- Skor pemenang pada MatchRow: warna `success-fg`, **ditambah** berat huruf 700 (kalah 500) dan teks sr-only `status.winner`. Pada seri, kedua skor memakai `fg`.
- Nama ikon `Check`, `Hourglass`, `X`, `Sun`, `Moon`, `ZoomIn`, `ZoomOut`, `Search`, `SlidersHorizontal`, `RotateCcw`, `Menu`, `ArrowLeft` sudah dicek ada di `lucide-react` 1.66.0 (versi yang terpasang dari `^1.61.0`).

## 4. Tipografi

Font: **Inter** (teks umum; dipilih di antara Inter atau Roboto sesuai PRD 5.1) dan **Oswald** (angka skor dan statistik besar). Dimuat lewat `next/font` (bagian 6). Breakpoint ganti ukuran: token dasar untuk mobile (< 768 px), token `-lg` dengan awalan `md:` untuk tablet dan desktop.

| Peran | Font dan berat | Mobile | Desktop | Tinggi baris | Kelas |
|---|---|---|---|---|---|
| Angka hero (display) | Oswald 700 | 48 px | 64 px | 1 | `font-display font-bold text-display md:text-display-lg` |
| Skor pertandingan | Oswald 700 | 32 px | 48 px | 1 | `font-display font-bold text-score md:text-score-lg` |
| Angka statistik besar | Oswald 600 | 28 px | 36 px | 1,1 | `font-display font-semibold text-stat md:text-stat-lg` |
| H1 | Inter 700 | 28 px | 40 px | 1,15 / 1,1 | `font-bold text-h1 md:text-h1-lg` |
| H2 | Inter 700 | 22 px | 28 px | 1,25 / 1,2 | `font-bold text-h2 md:text-h2-lg` |
| H3 | Inter 600 | 18 px | 18 px | 1,3 | `font-semibold text-h3` |
| Teks isi | Inter 400 | 16 px | 16 px | 1,5 | `text-body` |
| Teks tabel dan baris | Inter 400/500, angka 500–700 | 14 px | 14 px | 1,45 | `text-body-sm tabular-nums` |
| Label kecil / keterangan | Inter 500 | 12 px | 12 px | 1,35 | `font-medium text-caption` |

- **Berat diizinkan:** Inter 400, 500, 600, 700. Oswald 500, 600, 700. Dilarang: berat ≤ 300 dan ≥ 800, serta huruf miring untuk angka. Ukuran minimum 12 px.
- **Tinggi baris:** isi 1,5; judul 1,1–1,3; angka besar 1 (angka tidak punya huruf turun, jadi tidak terpotong).
- **Teks besar menurut WCAG** = ≥ 24 px reguler atau ≥ 18,66 px berat 700. H3 (18 px, 600) **bukan** teks besar dan dinilai 4,5:1; skor dan angka statistik memenuhi definisi teks besar.
- **Angka tabular:** semua angka yang tersusun vertikal (kolom klasemen, daftar statistik, peringkat) memakai Inter 14 px dengan `tabular-nums`, rata kanan, dan lebar kolom tetap. **Oswald hanya untuk angka tunggal yang besar** (skor, statistik hero), bukan untuk kolom tabel.

Alasan aturan terakhir: berkas Oswald variabel (subset latin, salinan di paket npm `@fontsource-variable/oswald`) dicek dengan fontTools dan **tidak punya fitur `tnum`**; lebar angka 0–9 berbeda-beda (378 sampai 517 unit). Inter punya fitur `tnum`. Hasil ini berasal dari salinan paket npm, bukan langsung dari Google Fonts, sehingga dicatat sebagai terverifikasi pada salinan itu saja.

## 5. Radius, bayangan, jarak, dan gerak

**Radius** memakai nilai bawaan Tailwind v4 (nilai `--radius-*` dicek pada hasil kompilasi: `rounded-lg` = 0,5 rem, `rounded-xl` = 0,75 rem).

| Elemen | Kelas | Nilai |
|---|---|---|
| Chip, badge, avatar | `rounded-full` | penuh |
| Tombol, input, tooltip | `rounded-lg` | 0,5 rem (8 px) |
| Kartu, tabel, PlayerCard, node bracket | `rounded-xl` | 0,75 rem (12 px); PlayerCard sesuai PRD 5.2 |
| Modal, panel besar | `rounded-2xl` | 1 rem (16 px) |

**Bayangan.** Dua tingkat, berganti per tema lewat variabel CSS (nilai pada bagian 6):

| Token | Kelas | Pemakaian | Light | Dark |
|---|---|---|---|---|
| `shadow-card` | `shadow-card` | Kartu, baris tabel | `0 1px 2px 0 rgb(15 23 42 / 0.06), 0 1px 3px 0 rgb(15 23 42 / 0.08)` | `0 1px 2px 0 rgb(0 0 0 / 0.45)` |
| `shadow-pop` | `shadow-pop` | Dropdown, tooltip, modal | `0 8px 24px -4px rgb(15 23 42 / 0.16), 0 2px 6px 0 rgb(15 23 42 / 0.08)` | `0 8px 24px -4px rgb(0 0 0 / 0.6), 0 0 0 1px rgb(51 65 85 / 0.8)` |

Di Dark Mode kedalaman dibangun dari terang-gelapnya permukaan (`canvas` → `surface` → `surface-muted`) dan cincin 1 px, bukan bayangan tebal. Dilarang bayangan berwarna aksen.

**Jarak.** Skala kelipatan 4 px (bawaan Tailwind): 1 (4), 2 (8), 3 (12), 4 (16), 6 (24), 8 (32), 12 (48), 16 (64). Padding halaman `px-4` (mobile), `md:px-6`, `lg:px-8`. Padding kartu `p-4` (mobile), `md:p-6`. Jarak antar-kartu `gap-3` (mobile), `md:gap-4`. Area sentuh minimum **44 × 44 px** (`size-11` = 2,75 rem) untuk semua tombol dan tautan yang berdiri sendiri.

**Gerak.**

- Durasi transisi **200 ms** (`duration-200`; juga menjadi bawaan lewat `--default-transition-duration`), kurva ease-out. Sebutkan properti (`transition-transform`, `transition-colors`), bukan `transition-all`.
- `hover:scale-105` **hanya** untuk elemen yang bisa diklik: tombol, tautan, kartu yang berupa tautan, dan PlayerCard. Dilarang pada elemen yang tidak bisa diklik (kartu statistik statis, header, legenda). Wajib berpasangan dengan `transition-transform duration-200` dan `motion-reduce:hover:scale-100 motion-reduce:transition-none`.
- Pada Tailwind v4 varian `hover:` hanya aktif pada perangkat yang mendukung hover (dicek pada hasil kompilasi: aturan dibungkus `@media (hover: hover)`), jadi tidak menempel setelah disentuh di ponsel. Umpan balik sentuh memakai `active:opacity-80`, tanpa skala.
- Elemen selebar penuh (baris pertandingan, baris klasemen) tidak diskalakan: pembesaran 5% membuat tepi melewati lebar layar 320 px. Baris yang bisa diklik memakai `hover:bg-surface-muted` dan `transition-colors duration-200`. PRD 5.4 memberi `hover:scale-105` sebagai contoh ("misalnya"), jadi ini tidak bertentangan, tetapi dicatat pada daftar persetujuan.
- Skeleton memakai `animate-shimmer` dan `motion-reduce:animate-none` (latar diam `bg-surface-muted`). Spinner bulat generik dilarang (PRD 5.4).
- Aturan `prefers-reduced-motion: reduce` global ada pada snippet (bagian 6). Zoom dan geser bracket tidak dianimasikan saat preferensi ini aktif.
- Fokus keyboard: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan-ink`. Rasio outline terhadap `surface`: Light 5,35:1, Dark 8,09:1 (lulus 3:1). Dilarang `outline-none` tanpa pengganti.

## 6. Snippet konfigurasi

**Versi Tailwind.** `package.json` memuat `"tailwindcss": "^4"` dan `"@tailwindcss/turbopack": "^4"`, jadi proyek memakai **Tailwind v4** dengan blok `@theme` (bukan `tailwind.config`). `src/app/globals.css` saat ini hanya berisi `@import "tailwindcss";` dan `@custom-variant dark (&:where(.dark, .dark *));` (dark mode berbasis class); snippet di bawah mempertahankan keduanya.

### 6.1 CSS tema (`src/app/globals.css`)

Variabel CSS Light dan Dark, pemetaan `@theme`, skala tipografi, bayangan, dan gerak.

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

:root {
  color-scheme: light;
  --canvas: #F9FAFB;
  --surface: #FFFFFF;
  --surface-muted: #F3F4F6;
  --line: #E5E7EB;
  --line-strong: #6B7280;
  --fg: #111827;
  --fg-secondary: #4B5563;
  --fg-muted: #626B79;
  --accent-cyan: #00D1FF;
  --accent-magenta: #FF2BD6;
  --accent-neon: #39FF14;
  --accent-cyan-ink: #0E7490;
  --accent-magenta-ink: #B0006F;
  --accent-neon-ink: #166534;
  --on-accent: #0B1220;
  --success-fg: #166534;
  --success-bg: #F0FDF4;
  --success-solid: #16A34A;
  --warning-fg: #92400E;
  --warning-bg: #FFFBEB;
  --warning-solid: #B45309;
  --danger-fg: #B91C1C;
  --danger-bg: #FEF2F2;
  --danger-solid: #DC2626;
  --info-fg: #0369A1;
  --info-bg: #F0F9FF;
  --info-solid: #0284C7;
  --shadow-card-value: 0 1px 2px 0 rgb(15 23 42 / 0.06), 0 1px 3px 0 rgb(15 23 42 / 0.08);
  --shadow-pop-value: 0 8px 24px -4px rgb(15 23 42 / 0.16), 0 2px 6px 0 rgb(15 23 42 / 0.08);
}

.dark {
  color-scheme: dark;
  --canvas: #0F172A;
  --surface: #1E293B;
  --surface-muted: #283548;
  --line: #334155;
  --line-strong: #64748B;
  --fg: #F8FAFC;
  --fg-secondary: #CBD5E1;
  --fg-muted: #A0AEC0;
  --accent-cyan: #22D3EE;
  --accent-magenta: #FF5CE1;
  --accent-neon: #6EF05A;
  --accent-cyan-ink: #22D3EE;
  --accent-magenta-ink: #FF5CE1;
  --accent-neon-ink: #6EF05A;
  --on-accent: #0B1220;
  --success-fg: #4ADE80;
  --success-bg: rgb(74 222 128 / 0.12);
  --success-solid: #4ADE80;
  --warning-fg: #FCD34D;
  --warning-bg: rgb(252 211 77 / 0.12);
  --warning-solid: #FBBF24;
  --danger-fg: #FA8383;
  --danger-bg: rgb(250 131 131 / 0.12);
  --danger-solid: #F87171;
  --info-fg: #38BDF8;
  --info-bg: rgb(56 189 248 / 0.12);
  --info-solid: #38BDF8;
  --shadow-card-value: 0 1px 2px 0 rgb(0 0 0 / 0.45);
  --shadow-pop-value: 0 8px 24px -4px rgb(0 0 0 / 0.6), 0 0 0 1px rgb(51 65 85 / 0.8);
}

@theme inline {
  --color-canvas: var(--canvas);
  --color-surface: var(--surface);
  --color-surface-muted: var(--surface-muted);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-fg: var(--fg);
  --color-fg-secondary: var(--fg-secondary);
  --color-fg-muted: var(--fg-muted);
  --color-accent-cyan: var(--accent-cyan);
  --color-accent-magenta: var(--accent-magenta);
  --color-accent-neon: var(--accent-neon);
  --color-accent-cyan-ink: var(--accent-cyan-ink);
  --color-accent-magenta-ink: var(--accent-magenta-ink);
  --color-accent-neon-ink: var(--accent-neon-ink);
  --color-on-accent: var(--on-accent);
  --color-success: var(--success-solid);
  --color-success-fg: var(--success-fg);
  --color-success-bg: var(--success-bg);
  --color-warning: var(--warning-solid);
  --color-warning-fg: var(--warning-fg);
  --color-warning-bg: var(--warning-bg);
  --color-danger: var(--danger-solid);
  --color-danger-fg: var(--danger-fg);
  --color-danger-bg: var(--danger-bg);
  --color-info: var(--info-solid);
  --color-info-fg: var(--info-fg);
  --color-info-bg: var(--info-bg);

  --shadow-card: var(--shadow-card-value);
  --shadow-pop: var(--shadow-pop-value);
}

@theme {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-oswald), "Arial Narrow", Impact, sans-serif;

  --text-caption: 0.75rem;
  --text-caption--line-height: 1.35;
  --text-body-sm: 0.875rem;
  --text-body-sm--line-height: 1.45;
  --text-body: 1rem;
  --text-body--line-height: 1.5;
  --text-h3: 1.125rem;
  --text-h3--line-height: 1.3;
  --text-h2: 1.375rem;
  --text-h2--line-height: 1.25;
  --text-h2-lg: 1.75rem;
  --text-h2-lg--line-height: 1.2;
  --text-h1: 1.75rem;
  --text-h1--line-height: 1.15;
  --text-h1-lg: 2.5rem;
  --text-h1-lg--line-height: 1.1;
  --text-stat: 1.75rem;
  --text-stat--line-height: 1.1;
  --text-stat-lg: 2.25rem;
  --text-stat-lg--line-height: 1.1;
  --text-score: 2rem;
  --text-score--line-height: 1;
  --text-score-lg: 3rem;
  --text-score-lg--line-height: 1;
  --text-display: 3rem;
  --text-display--line-height: 1;
  --text-display-lg: 4rem;
  --text-display-lg--line-height: 1;

  --default-transition-duration: 200ms;
  --default-transition-timing-function: cubic-bezier(0, 0, 0.2, 1);

  --animate-shimmer: shimmer 1.6s linear infinite;
  @keyframes shimmer {
    from { background-position: 200% 0; }
    to { background-position: -200% 0; }
  }
}

@layer base {
  body {
    background-color: var(--canvas);
    color: var(--fg);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Catatan: warna dipetakan dengan `@theme inline` agar kelas Tailwind membaca variabel yang berganti per tema (`.dark`). Bayangan memakai variabel perantara `--shadow-*-value` karena nilainya berbeda per tema.

### 6.2 Konfigurasi `next/font` (mis. `src/app/fonts.ts`)

```ts
import { Inter, Oswald } from "next/font/google";

export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
});
```

Kedua variabel (`--font-inter`, `--font-oswald`) dipasang sebagai kelas pada elemen `<html>` (`className={`${inter.variable} ${oswald.variable}`}`) oleh pemilik `layout.tsx`. `latin-ext` pada Inter dipakai karena nama pemain memuat huruf seperti ø, đ, ł. Opsi `weight` sengaja tidak diisi: Inter dan Oswald dimuat sebagai variable font, dan berat yang diizinkan diatur lewat aturan pada bagian 4.

### 6.3 Hasil verifikasi snippet

- CSS: dikompilasi dengan `tailwindcss` 4.3.3 (CLI) terhadap HTML uji yang memakai seluruh kelas token. Hasil: kompilasi selesai tanpa galat; kelas `bg-canvas`, `text-accent-cyan-ink`, `font-display`, `md:text-score-lg`, `shadow-card`, `dark:bg-surface`, dan `hover:scale-105` (dalam `@media (hover: hover)`) muncul pada keluaran.
- `next/font`: dicek dengan `tsc --noEmit` (strict) terhadap tipe `next` 16.4.3: lolos. Kontrol negatif (`display: "nope"`) memang ditolak. **Belum terverifikasi:** pengunduhan font saat `next build` (jaringan ke Google Fonts tidak tersedia di lingkungan ini) dan tampilan di browser.

## 7. Asumsi

- Inter dipilih (bukan Roboto) sebagai font teks umum; PRD memperbolehkan keduanya.
- `slate-900` dipilih sebagai latar Dark (PRD: slate-900 atau zinc-950).
- Hex aksen mentah (Cyan #00D1FF, Magenta #FF2BD6, Neon #39FF14, serta penyesuaian Dark) adalah rancangan Claude #5. Prompt dan PRD tidak menyebut Hex resmi turnamen; kemiripannya dengan identitas visual resmi **belum terverifikasi**.
- Rute Detail Pemain `/players/[id]` adalah asumsi; tidak memengaruhi token.
- Titik henti (breakpoint) 768 px untuk ukuran desktop mengikuti PRD 8.1 (Tablet 768 px).
