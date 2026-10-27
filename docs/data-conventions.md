# Konvensi Data — Platform Statistik Piala Dunia FIFA 2026

Berkas ini menegaskan arti setiap field pada kontrak tipe `src/types/index.d.ts`. Semua butir ditulis sebagai **aturan**: kata WAJIB, DILARANG, dan HARUS bersifat mengikat bagi seluruh agen (Claude #2, #3, #4, #6) dan bagi validator data.

> **Status sumber:** `docs/master-prd.md` di repositori saat ini masih berupa placeholder, jadi Bab 4.1 PRD belum dapat dicocokkan. Bentuk tipe mengikuti spesifikasi tugas Claude #1. Aturan yang merupakan asumsi Claude #1 diberi tanda **[ASUMSI]**; bila PRD asli bertentangan, PRD yang menang dan berkas ini harus diperbarui.

## 1. Format id

| Entitas | Format | Regex | Contoh |
|---|---|---|---|
| Tim | 3 huruf kapital (kode FIFA) | `^[A-Z]{3}$` | `ARG` |
| Pemain | `PL-{ID TIM}-{NOMOR PUNGGUNG 2 DIGIT}` | `^PL-[A-Z]{3}-\d{2}$` | `PL-ARG-10` |
| Pertandingan | `M-001` sampai `M-104` | `^M-\d{3}$` | `M-001` |
| Event | `E-0001` dan seterusnya | `^E-\d{4,}$` | `E-0001` |
| Node bagan | `BN-{nomor laga}` | `^BN-\d{3}$` | `BN-089` |

Aturan:

1. `Team.id` WAJIB sama dengan `Team.code`. **[ASUMSI]** (PRD memiliki kedua field; keduanya diseragamkan agar tidak ada dua kode berbeda untuk satu tim.)
2. Id pemain WAJIB memakai id tim sebagai bagian tengah dan nomor punggung 2 digit (diisi nol di depan: 1 → `01`) sebagai bagian akhir. Contoh `PL-010` di PRD hanyalah ilustrasi dan DILARANG dipakai.
3. Nomor punggung unik di dalam satu tim dan tidak berubah selama turnamen; karena itu id pemain unik secara global.
4. Id pertandingan mengikuti nomor resmi jadwal FIFA **[ASUMSI, belum terverifikasi terhadap PRD]**:

   | Fase | Rentang |
   |---|---|
   | GROUP_STAGE | M-001 – M-072 |
   | ROUND_OF_32 | M-073 – M-088 |
   | ROUND_OF_16 | M-089 – M-096 |
   | QUARTER_FINALS | M-097 – M-100 |
   | SEMI_FINALS | M-101 – M-102 |
   | THIRD_PLACE | M-103 |
   | FINAL | M-104 |

5. Id event unik **secara global** (di seluruh 104 laga), diisi nol di depan sampai minimal 4 digit, dan DILARANG dipakai ulang. Bila melewati `E-9999`, digit bertambah (`E-10000`).
6. Id node bagan memakai nomor laga yang diwakilinya (`BN-089` ↔ `M-089`), sehingga hanya ada 32 node: `BN-073` – `BN-104`.

## 2. Skor pertandingan

1. `homeScore` dan `awayScore` adalah **skor akhir setelah waktu normal plus perpanjangan waktu**.
2. Skor SUDAH memuat gol bunuh diri sebagai gol milik **tim yang diuntungkan**.
3. Skor TIDAK memuat adu penalti. Adu penalti hanya ditulis di `homePenaltyScore` dan `awayPenaltyScore`.
4. Rumus yang HARUS dipenuhi oleh setiap laga `isFinished = true`:

   ```
   homeScore = jumlah(GOAL + PENALTY_GOAL dengan teamId = homeTeamId)
             + jumlah(OWN_GOAL dengan teamId = awayTeamId)
   awayScore = jumlah(GOAL + PENALTY_GOAL dengan teamId = awayTeamId)
             + jumlah(OWN_GOAL dengan teamId = homeTeamId)
   ```

5. `homePenaltyScore` / `awayPenaltyScore`:
   - hanya boleh ada pada laga fase gugur dengan `homeScore === awayScore`;
   - WAJIB berpasangan (keduanya ada atau keduanya tidak ada);
   - nilainya DILARANG sama (adu penalti selalu menghasilkan pemenang);
   - pada laga fase grup DILARANG ada.
6. Pemenang laga fase gugur: tim dengan skor lebih tinggi; bila seri, tim dengan skor adu penalti lebih tinggi. Laga fase gugur yang selesai tanpa pemenang DILARANG.
7. Selama `isFinished = false`, `homeScore` dan `awayScore` bernilai `0`, dan klasemen, bagan, serta statistik pemain WAJIB mengabaikan laga tersebut.

Contoh: M-0xx berakhir 2–2 setelah perpanjangan, adu penalti 4–3 untuk tuan rumah → `homeScore: 2, awayScore: 2, homePenaltyScore: 4, awayPenaltyScore: 3`.

## 3. Semantik event

Aturan umum: `MatchEvent.teamId` SELALU sama dengan `Player.teamId` dari `playerId`, dan harus salah satu dari `homeTeamId` / `awayTeamId` laga tersebut.

| `type` | `playerId` | `relatedPlayerId` | Efek |
|---|---|---|---|
| `GOAL` | pencetak gol | pemberi assist (opsional) | +1 gol tim `teamId`; +1 `goals` pencetak; +1 `assists` pemberi assist |
| `PENALTY_GOAL` | pencetak gol | DILARANG ada | +1 gol tim `teamId`; +1 `goals` pencetak; tidak ada assist |
| `OWN_GOAL` | pemain yang membuat gol bunuh diri | DILARANG ada | +1 gol untuk **lawan** `teamId`; TIDAK menambah `goals` pemain mana pun |
| `YELLOW_CARD` | penerima kartu | DILARANG ada | +1 `yellowCards` |
| `RED_CARD` | penerima kartu | DILARANG ada | +1 `redCards` |
| `SUBSTITUTION` | pemain yang **masuk** | pemain yang **keluar** (wajib) | mempengaruhi perkiraan menit bermain |

Rincian:

- **(c) OWN_GOAL**: `teamId` adalah tim milik pemain yang membuat gol bunuh diri (tim yang dirugikan), dan `playerId` adalah pemain itu. Gol dicatat untuk lawannya pada skor dan klasemen (`goalsFor` lawan, `goalsAgainst` tim `teamId`).
- **(d) GOAL**: `relatedPlayerId` adalah pemberi assist; ia WAJIB berasal dari tim yang sama dan berbeda dari pencetak.
- **(d) SUBSTITUTION**: `playerId` pemain masuk, `relatedPlayerId` pemain keluar; keduanya dari tim yang sama.
- **(f) Gol adu penalti TIDAK dicatat sebagai event.** Hasil adu penalti hanya hidup di `homePenaltyScore` / `awayPenaltyScore`, dan tidak menambah `goals` pemain.
- `PENALTY_GOAL` hanya untuk penalti dalam permainan (waktu normal / perpanjangan). Penalti yang gagal tidak dicatat sebagai event. **[ASUMSI]** (tidak ada jenis event untuk itu).

## 4. Pencatatan kartu **(e)**

| Kejadian | Event yang dicatat |
|---|---|
| Kuning pertama | 1 × `YELLOW_CARD` |
| Kuning kedua yang berujung merah | 2 × `YELLOW_CARD` **plus** 1 × `RED_CARD` (merah pada menit yang sama dengan kuning kedua) |
| Merah langsung | 1 × `RED_CARD` |
| Kuning, lalu merah langsung pada menit berbeda | 1 × `YELLOW_CARD` **plus** 1 × `RED_CARD` |

Cara membedakan dua kasus yang sama-sama memiliki `RED_CARD` setelah kuning: **hitung jumlah `YELLOW_CARD` milik pemain itu pada laga tersebut.**

- 2 kuning + 1 merah → merah itu akibat kuning kedua (kartu merah tidak langsung).
- 1 kuning + 1 merah → merah langsung setelah kuning.
- 0 kuning + 1 merah → merah langsung.

Pembatas: pemain DILARANG memiliki lebih dari 2 `YELLOW_CARD` atau lebih dari 1 `RED_CARD` dalam satu laga; dua kuning tanpa merah DILARANG (kuning kedua selalu berakhir merah). Pada kasus 2 kuning + 1 merah, `RED_CARD` WAJIB memiliki `minute` dan `extraMinute` yang sama dengan kuning kedua **[ASUMSI]**.

Dampak ke statistik: `yellowCards` = jumlah event `YELLOW_CARD` (kasus kuning kedua menghasilkan 2 kuning), `redCards` = jumlah event `RED_CARD`.

Poin fair play (`GroupStanding.fairPlayPoints`, nol atau negatif, makin besar makin baik) **[belum terverifikasi terhadap regulasi resmi FIFA 2026]**:

| Kasus per pemain per laga | Poin |
|---|---|
| 1 kuning | −1 |
| 2 kuning → merah | −3 (total; menggantikan, bukan menambah, dua kuning) |
| Merah langsung | −4 |
| 1 kuning + merah langsung | −5 |

## 5. Menit **(g)**

1. `minute` bilangan bulat 1–120. Waktu normal 1–90; perpanjangan waktu memakai **91–120** (babak pertama perpanjangan 91–105, kedua 106–120).
2. Laga fase grup DILARANG memiliki event dengan `minute` > 90.
3. Tambahan waktu ditulis lewat `extraMinute` (bilangan bulat ≥ 1) dan hanya boleh dipakai bila `minute` ∈ {45, 90, 105, 120}. Contoh 45+2 → `minute: 45, extraMinute: 2`. **[ASUMSI]**
4. Penggantian pada jeda babak dicatat pada menit pertama babak berikutnya (46, 91, atau 106). **[ASUMSI]**
5. Urutan `events` dalam satu laga: naik menurut `(minute, extraMinute ?? 0)`, lalu menurut `id`.

## 6. Konsistensi fase, grup, dan giliran laga

- `stage = GROUP_STAGE` → `groupLetter` dan `matchday` (1, 2, atau 3) WAJIB ada; kedua tim WAJIB berada di grup itu.
- `stage` ≠ `GROUP_STAGE` → `groupLetter` dan `matchday` DILARANG ada.
- `kickoffTime`: format persis `YYYY-MM-DDTHH:mm:ssZ` (UTC, berakhiran `Z`, tanpa offset, tanpa milidetik).
- `flagUrl` dan `photoUrl`: path relatif ke `public/`, diawali `/`. Pemain tanpa foto memakai `/players/placeholder.svg` **[ASUMSI; berkas ini belum ada dan menjadi tugas agen data]**.
- Record `Match` fase gugur baru dibuat setelah kedua tim pasti, karena `homeTeamId` / `awayTeamId` bukan nullable. Id laga fase gugur tetap dicadangkan (lihat 1.4) dan dipakai oleh `BracketSlotSource`. **[ASUMSI]** (alternatif butuh perubahan skema; lihat "Usulan perubahan skema").

## 7. Data tersimpan vs hasil kalkulasi

| Tipe | Sifat | Sumber |
|---|---|---|
| `Team`, `Player`, `Match`, `MatchEvent` | Data JSON (tersimpan) | Diisi manual / skrip data |
| `Player.stats` | Salinan terdenormalisasi di JSON | HARUS sama dengan `PlayerAggregateStats` hasil agregasi event (kecuali `appearances` dan `minutesPlayed`, lihat bagian 9) |
| `GroupStanding` | **Computed**, bukan JSON | Laga fase grup `isFinished = true` |
| `ThirdPlaceEntry` | **Computed**, bukan JSON | `GroupStanding` peringkat 3 dari 12 grup |
| `PlayerAggregateStats` | **Computed**, bukan JSON | `Match.events` |
| `PlayerRadarDatum` | **Computed**, bukan JSON | `PlayerAggregateStats`, dinormalisasi ke 0–100 |
| `BracketNode` | Struktur statis + field turunan | `homeSource`, `awaySource`, `nextNodeId`, `loserNextNodeId` tetap; `matchId`, `homeTeamId`, `awayTeamId`, `winnerTeamId` diturunkan dari `Match` dan klasemen |

Berkas di `src/data/` DILARANG berisi `GroupStanding`, `ThirdPlaceEntry`, `PlayerAggregateStats`, maupun `PlayerRadarDatum`.

## 8. Aturan bagan

1. Ada 32 node. `nextNodeId` menunjuk node tujuan pemenang; slot tujuan (home atau away) ditentukan oleh `homeSource` / `awaySource` node tujuan yang berjenis `MATCH_WINNER` dengan `matchId` laga ini.
2. `loserNextNodeId` hanya diisi pada kedua node `SEMI_FINALS` (menuju node `THIRD_PLACE`, yang memakai `MATCH_LOSER`). Node `FINAL` dan `THIRD_PLACE` tidak memiliki `nextNodeId`.
3. `BracketSlotSource` `THIRD_PLACE` hanya memuat daftar grup kandidat. Tim yang benar-benar menempati slot itu muncul di `homeTeamId` / `awayTeamId`.
4. `homeTeamId` / `awayTeamId` bernilai `null` (atau dihilangkan) selama peserta belum pasti.

## 9. Usulan perubahan skema

> **Belum diterapkan.** Usulan di bawah TIDAK ditambahkan ke `src/types/index.d.ts`; semuanya menunggu persetujuan pengguna.

### 9.1 Susunan pemain awal (starting XI)

**Masalah.** Tipe `Match` belum memuat susunan pemain awal. Akibatnya `Player.stats.appearances` dan `Player.stats.minutesPlayed` hanya bisa **diperkirakan** dari event: pemain yang tidak pernah muncul di event (tidak mencetak gol, tidak dikartu, tidak diganti) tidak terlacak sama sekali, dan pemain yang bermain penuh tanpa event tidak diketahui. Perkiraan itu karenanya cenderung **menghitung terlalu rendah**, terutama untuk kiper dan bek.

**Usulan.** Tambahkan field opsional pada `Match`, misalnya:

```ts
// CONTOH USULAN — tidak ada di src/types/index.d.ts
interface MatchLineup {
  teamId: string;
  startingXI: string[];   // 11 playerId
  bench: string[];        // playerId cadangan
}
// pada Match:
lineups?: { home: MatchLineup; away: MatchLineup };
```

**Dampak bila disetujui.**

- `Match` mendapat satu field opsional (tidak mematahkan kode yang sudah ada, namun kontrak berubah, jadi semua agen harus tahu).
- Volume data bertambah: 104 laga × 2 tim × (11 starter + cadangan).
- Claude #3: `appearances` dan `minutesPlayed` bisa dihitung dari `lineups` + `SUBSTITUTION` + `RED_CARD` (pemain yang diusir berhenti bermain), dan keduanya tidak lagi perkiraan.
- Validator: harus mengecek `startingXI` 11 pemain unik dari tim yang tepat, dan setiap pemain di event ada di `lineups`.
- Bila ditolak: UI harus melabeli kedua angka itu sebagai perkiraan.

### 9.2 Peserta fase gugur yang belum pasti pada `Match`

**Masalah.** `Match.homeTeamId` / `awayTeamId` bukan nullable, sehingga laga fase gugur yang pesertanya belum pasti tidak dapat berupa record `Match` (konvensi bagian 6 menahannya sampai peserta pasti), padahal jadwal `kickoffTime` dan `venue`-nya sudah diketahui lebih awal.

**Usulan.** Jadikan `homeTeamId` / `awayTeamId` bertipe `string | null`, atau simpan jadwal fase gugur terpisah dari `Match`.

**Dampak.** Semua kode yang membaca `Match.homeTeamId` harus menangani `null`; `BracketNode.matchId` bisa selalu terisi. Bila ditolak, bagan tetap berfungsi karena `BracketNode` membawa `homeSource` dan `awaySource`, hanya jadwal laga mendatang yang tidak tampil dari data `Match`.

## 10. Placeholder bracket (ditambahkan Claude #4, prompt 5)

> Bagian ini hanya **menambah**; bagian 1–9 milik Claude #1 tidak diubah. Acuan PRD: Bab 4.1 (tipe `Match`, `homeTeamId`/`awayTeamId` bertipe `string`) dan Bab 4.3 (integritas relasi). PRD tidak menyebut placeholder, jadi aturan ini adalah **[ASUMSI]** Claude #4 berdasarkan spesifikasi tugas; bila PRD/Claude #1 menetapkan lain, pihak itu yang menang.

**Kapan dipakai.** Hanya pada laga fase gugur yang pesertanya belum pasti. Per 2026-10-27 seluruh 32 laga fase gugur sudah dimainkan dan pesertanya diketahui dari sumber, sehingga `matches.json` saat ini memuat **0 slot placeholder**. Konvensi ini tetap berlaku untuk pembaruan/rekonstruksi data berikutnya (dibaca `buildBracket` oleh Claude #3 dan validator oleh Claude #1).

### 10.1 Pola yang diizinkan

| Pola (regex) | Arti | Contoh | Boleh pada |
|---|---|---|---|
| `^[12][A-L]$` | juara (1) atau runner-up (2) grup | `1A`, `2B` | `ROUND_OF_32` |
| `^3rd-[A-L]{2,8}$` | peringkat ketiga dari salah satu grup yang tercantum | `3rd-ABCDF` | `ROUND_OF_32` |
| `^W-M\d{3}$` | pemenang laga bernomor itu | `W-M073` | `ROUND_OF_16`, `QUARTER_FINALS`, `SEMI_FINALS`, `FINAL` |
| `^L-M\d{3}$` | pecundang laga bernomor itu | `L-M101` | hanya `THIRD_PLACE` (merujuk `SEMI_FINALS`) |

Aturan tambahan (diterapkan `scripts/validate-data.mjs`):

1. Huruf pada `3rd-…` WAJIB terurut naik dan tanpa duplikat (`3rd-ABCDF`, bukan `3rd-FDCBA`). **[ASUMSI: lebih ketat daripada regex.]**
2. `W-Mnnn` / `L-Mnnn` WAJIB merujuk laga yang benar-benar ada di `matches.json` dan bernomor **lebih kecil** daripada laga yang memuatnya.
3. Susunan sumber tiap laga WAJIB disalin dari regulasi resmi FIFA. DILARANG mengarang atau menebak pasangan. Bila regulasi belum tersedia, laga itu tidak ditambahkan dengan pasangan tebakan; catat di `docs/known-gaps.md`.
4. Kolom lain tetap seperti laga belum dimainkan: `isFinished: false`, `homeScore: 0`, `awayScore: 0`, `events: []`, tanpa `homePenaltyScore`/`awayPenaltyScore`. Laga yang memuat placeholder DILARANG `isFinished: true`.
5. Campuran satu id tim nyata + satu placeholder diizinkan selama laga belum selesai.

### 10.2 Larangan

- Nilai placeholder DILARANG ada di `teams.json` (`id` maupun `code`), di `Player.teamId`, dan di `MatchEvent.teamId`. Placeholder hanya boleh muncul di `Match.homeTeamId` / `Match.awayTeamId` fase gugur.
- Placeholder DILARANG dipakai sebagai kunci pencarian tim di UI tanpa penanganan khusus: `teamById.get("1A")` selalu `undefined`. Konsumen (`buildBracket`, UI) WAJIB mengenali pola di 10.1 lebih dulu.

### 10.3 Siklus hidup slot

1. Slot berisi placeholder → `buildBracket` menurunkannya dari klasemen / hasil laga rujukan.
2. Peserta pasti → record `Match` yang sama (id laga tidak berubah) diperbarui dengan id tim nyata; id event tetap berurutan global.
3. Laga dimainkan → skor, penalti, `isFinished: true`, dan `events` diisi sesuai bagian 2–5.

### 10.4 Catatan konflik untuk Claude #1

- Bagian 6 butir terakhir menyatakan record fase gugur baru dibuat setelah kedua tim pasti, dan bagian 9.2 mengusulkan `homeTeamId | null`. Tugas Claude #4 mewajibkan placeholder string, yang valid terhadap tipe `string` pada `index.d.ts` saat ini tanpa mengubah skema. Konflik ini **tidak** muncul pada data saat ini (0 placeholder), tetapi Claude #1 perlu memutuskan mana yang berlaku bila ada laga yang belum dimainkan.
