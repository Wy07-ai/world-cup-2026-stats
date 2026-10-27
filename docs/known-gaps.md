# Known Gaps — matches.json (Claude #4)

Diperbarui: 2026-10-27.

## Kekurangan yang berlaku untuk SEMUA 72 laga
Sumber data laga (lihat `docs/data-sources.md`) hanya memuat **skor akhir, pencetak gol, menit gol, penanda penalti, dan penanda gol bunuh diri**. Sumber itu TIDAK memuat data berikut, dan karena tidak ada sumber terverifikasi lain yang dapat diakses, datanya **tidak diisi** (tidak ditebak):

| Data yang kurang | Dampak | Berlaku untuk |
|---|---|---|
| Assist (`relatedPlayerId` pada `GOAL`) | `assists` semua pemain akan 0 saat dihitung (prompt 10) | 72 laga |
| `YELLOW_CARD` dan `RED_CARD` | `fairPlayPoints` semua tim akan 0, sehingga tie-breaker fair play (PRD 6.1) tidak bermakna; `yellowCards`/`redCards` pemain 0 | 72 laga |
| `SUBSTITUTION` | perkiraan menit bermain dari event tidak mungkin akurat | 72 laga |

Yang SUDAH lengkap dan lolos validasi: skor akhir tiap laga sama dengan jumlah gol dari event (formula konvensi 2.4), termasuk 12 gol bunuh diri dan 8 gol penalti.

Tidak ada pengecualian pada rumus skor = event (0 laga dikecualikan).

## Per laga
Kolom "Event" = jumlah event yang tercatat (semuanya gol). Untuk setiap baris di bawah, yang kurang adalah **assist, kartu, dan pergantian pemain**.

| Laga | Grup | Pertandingan | Skor | Event |
|---|---|---|---|---|
| M-001 | A | MEX vs RSA | 2–0 | 2 |
| M-002 | A | KOR vs CZE | 2–1 | 3 |
| M-003 | B | CAN vs BIH | 1–1 | 2 |
| M-004 | D | USA vs PAR | 4–1 | 5 |
| M-005 | B | QAT vs SUI | 1–1 | 2 |
| M-006 | C | BRA vs MAR | 1–1 | 2 |
| M-007 | C | HAI vs SCO | 0–1 | 1 |
| M-008 | D | AUS vs TUR | 2–0 | 2 |
| M-009 | E | GER vs CUW | 7–1 | 8 |
| M-010 | F | NED vs JPN | 2–2 | 4 |
| M-011 | E | CIV vs ECU | 1–0 | 1 |
| M-012 | F | SWE vs TUN | 5–1 | 6 |
| M-013 | H | ESP vs CPV | 0–0 | 0 |
| M-014 | G | BEL vs EGY | 1–1 | 2 |
| M-015 | H | KSA vs URU | 1–1 | 2 |
| M-016 | G | IRN vs NZL | 2–2 | 4 |
| M-017 | I | FRA vs SEN | 3–1 | 4 |
| M-018 | I | IRQ vs NOR | 1–4 | 5 |
| M-019 | J | ARG vs ALG | 3–0 | 3 |
| M-020 | J | AUT vs JOR | 3–1 | 4 |
| M-021 | K | POR vs COD | 1–1 | 2 |
| M-022 | L | ENG vs CRO | 4–2 | 6 |
| M-023 | L | GHA vs PAN | 1–0 | 1 |
| M-024 | K | UZB vs COL | 1–3 | 4 |
| M-025 | A | CZE vs RSA | 1–1 | 2 |
| M-026 | B | SUI vs BIH | 4–1 | 5 |
| M-027 | B | CAN vs QAT | 6–0 | 6 |
| M-028 | A | MEX vs KOR | 1–0 | 1 |
| M-029 | D | USA vs AUS | 2–0 | 2 |
| M-030 | C | SCO vs MAR | 0–1 | 1 |
| M-031 | C | BRA vs HAI | 3–0 | 3 |
| M-032 | D | TUR vs PAR | 0–1 | 1 |
| M-033 | F | NED vs SWE | 5–1 | 6 |
| M-034 | E | GER vs CIV | 2–1 | 3 |
| M-035 | E | ECU vs CUW | 0–0 | 0 |
| M-036 | F | TUN vs JPN | 0–4 | 4 |
| M-037 | H | ESP vs KSA | 4–0 | 4 |
| M-038 | G | BEL vs IRN | 0–0 | 0 |
| M-039 | H | URU vs CPV | 2–2 | 4 |
| M-040 | G | NZL vs EGY | 1–3 | 4 |
| M-041 | J | ARG vs AUT | 2–0 | 2 |
| M-042 | I | FRA vs IRQ | 3–0 | 3 |
| M-043 | I | NOR vs SEN | 3–2 | 5 |
| M-044 | J | JOR vs ALG | 1–2 | 3 |
| M-045 | K | POR vs UZB | 5–0 | 5 |
| M-046 | L | ENG vs GHA | 0–0 | 0 |
| M-047 | L | PAN vs CRO | 0–1 | 1 |
| M-048 | K | COL vs COD | 1–0 | 1 |
| M-049 | B | SUI vs CAN | 2–1 | 3 |
| M-050 | B | BIH vs QAT | 3–1 | 4 |
| M-051 | C | SCO vs BRA | 0–3 | 3 |
| M-052 | C | MAR vs HAI | 4–2 | 6 |
| M-053 | A | CZE vs MEX | 0–3 | 3 |
| M-054 | A | RSA vs KOR | 1–0 | 1 |
| M-055 | E | CUW vs CIV | 0–2 | 2 |
| M-056 | E | ECU vs GER | 2–1 | 3 |
| M-057 | F | JPN vs SWE | 1–1 | 2 |
| M-058 | F | TUN vs NED | 1–3 | 4 |
| M-059 | D | TUR vs USA | 3–2 | 5 |
| M-060 | D | PAR vs AUS | 0–0 | 0 |
| M-061 | I | NOR vs FRA | 1–4 | 5 |
| M-062 | I | SEN vs IRQ | 5–0 | 5 |
| M-063 | H | CPV vs KSA | 0–0 | 0 |
| M-064 | H | URU vs ESP | 0–1 | 1 |
| M-065 | G | EGY vs IRN | 1–1 | 2 |
| M-066 | G | NZL vs BEL | 1–5 | 6 |
| M-067 | L | PAN vs ENG | 0–2 | 2 |
| M-068 | L | CRO vs GHA | 2–1 | 3 |
| M-069 | K | COL vs POR | 0–0 | 0 |
| M-070 | K | COD vs UZB | 3–1 | 4 |
| M-071 | J | ALG vs AUT | 3–3 | 6 |
| M-072 | J | JOR vs ARG | 1–3 | 4 |

## Perlu keputusan pihak lain (bukan wewenang Claude #4)
- Claude #1 / pengguna: apakah akan menyediakan sumber kartu, assist, dan pergantian (mis. berkas rincian laga) agar bisa diisi pada putaran berikutnya? Tanpa itu, fair play dan assist tidak akan bermakna.
- UI (Claude #2/#5): jangan menampilkan fair play, kartu, atau assist sebagai angka nyata "0" tanpa catatan bahwa datanya belum tersedia.

---

# Tambahan prompt 5 (Claude #4): fase gugur dan skuad pemain

Diperbarui: 2026-10-27.

## A. Fase gugur (M-073 – M-104): kekurangan yang sama dengan fase grup
Sumber (`scripts/raw/worldcup.json`) hanya memuat skor, pencetak gol + menit, penanda penalti, dan penanda gol bunuh diri. Untuk **semua 32 laga fase gugur** data berikut **tidak tersedia dan tidak diisi**: assist (`relatedPlayerId`), `YELLOW_CARD`, `RED_CARD`, `SUBSTITUTION`. Dampak sama seperti fase grup: `assists`, kartu, dan `fairPlayPoints` akan 0 saat dihitung, dan menit bermain tidak dapat dihitung akurat. UI tidak boleh menampilkan angka 0 itu sebagai fakta.

Skor fase gugur = skor setelah waktu normal + perpanjangan (`score.et` bila ada, selain itu `score.ft`). Adu penalti hanya di `homePenaltyScore`/`awayPenaltyScore` dan tidak dicatat sebagai event. Ada 4 laga adu penalti: M-074, M-075, M-088, dan M-096.

## B. Hal yang perlu verifikasi manusia (data laga fase gugur)
| Laga | Masalah | Tindakan Claude #4 | Status |
|---|---|---|---|
| M-102 | Sumber mencatat gol Lautaro Martínez pada menit polos "92" padahal laga tidak punya perpanjangan (hanya `ft`) | Dinormalisasi menjadi `minute: 90, extraMinute: 2` (asumsi: waktu tambahan babak kedua) | sejalan dengan satu situs sekunder (worldcupranking.com mencatat 90+2'); belum dicek ke FIFA |
| M-073 | Nama di data laga "Stephan Eustáquio", skuad "Stephen Eustáquio" | Dicocokkan lewat nama belakang (kandidat tunggal) | perlu verifikasi |
| M-086 | Gol bunuh diri oleh "Diney Borges"; skuad CPV hanya memuat "Diney" (#3, DF) | Dicocokkan ke `PL-CPV-03` (kandidat tunggal) | perlu verifikasi |
| M-095 | "Mostafa Zico" vs skuad "Mostafa Ziko" | Alias yang sama dengan M-040 (prompt 4) | perlu verifikasi |

- Nomor laga M-073 – M-104 diambil dari field `num` di sumber dan cocok dengan rentang yang dipakai konvensi; kesesuaian dengan nomor resmi FIFA **belum terverifikasi**. Sebaliknya M-001 – M-072 (fase grup) **bukan** nomor resmi (urut kronologis buatan Claude #4, lihat `docs/data-sources.md`). Akibatnya penomoran campuran: bagian gugur "resmi menurut sumber", bagian grup tidak.
- Struktur bagan (siapa melawan siapa) **tidak** dicocokkan dengan regulasi FIFA. Yang diperiksa hanya konsistensi internal: tiap peserta babak berikutnya adalah pemenang babak sebelumnya menurut data.
- Cek silang web (2026-10-27, hanya sebagian kecil, bukan verifikasi penuh): skor dan penomoran M-084, M-098, M-101, M-102, M-103 (Inggris 6–4 Prancis), dan M-104 (Spanyol 1–0 Argentina setelah perpanjangan, Torres 106') sejalan dengan beberapa situs berita/statistik. Sumber itu juga mencatat kartu merah Enzo Fernández (90+3') pada Final, yang **tidak ada** di `matches.json` karena sumber data kita tidak memuat kartu (kekurangan A di atas). Laga lain belum dicek silang.
- Kebenaran faktual semua skor/pencetak gol/menit: satu sumber, belum dicocokkan dengan FIFA atau sumber kedua. Zona waktu `kickoffTime` memakai offset yang tertulis di sumber dan belum diperiksa silang.
- Nama stadion memakai nama komersial dari `stadiums.json`, belum dicocokkan dengan nama resmi turnamen.

## C. Skuad pemain (players.json: 1.248 pemain)
- Semua **48 tim memiliki 26 pemain** di sumber (`scripts/raw/squads.json`, openfootball), nomor punggung unik per tim, posisi valid. Tidak ada tim yang jumlahnya kurang, dan tidak ada nama yang dikarang.
- **Belum terverifikasi untuk SEMUA 48 tim**: daftar skuad berasal dari satu sumber komunitas dan tidak dicocokkan dengan daftar resmi FIFA. Tidak ada tim yang saya lewati karena skuad "tidak resmi", tetapi status "resmi" tidak dapat saya buktikan. Verifikasi manusia/agen lain diperlukan sebelum rilis.
- Kemungkinan perubahan skuad (cedera, pengganti) setelah daftar sumber dibuat tidak terpantau.
- `shortName` (nama di jersey) tidak ada di sumber. Aturan sementara: kata terakhir nama lengkap (sama dengan prompt 4). Akibatnya: 4 pemain bernama akhiran seperti sufiks (`PL-BRA-07` "Júnior", `PL-HAI-07` "Jr.", `PL-POR-18` "Neto", `PL-QAT-08` "Junior"), 21 pemain bernama tunggal, dan 42 pasangan `shortName` kembar di dalam satu tim. Semuanya **belum terverifikasi** dan perlu dikoreksi manual bila ingin nama jersey yang tepat (butuh persetujuan karena `shortName` pemain lama pada prompt 4 tidak boleh berubah tanpa keputusan pemilik data).
- Foto belum ada; lihat `docs/players-photos-checklist.md`.
