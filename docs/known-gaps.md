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
