/**
 * =====================================================================
 * KONTRAK TIPE TUNGGAL — Platform Statistik Piala Dunia FIFA 2026
 * =====================================================================
 *
 * Berkas ini adalah SATU-SATUNYA tempat bentuk data didefinisikan.
 * Semua agen wajib mengimpor dari sini: `import type { Team } from "@/types"`
 * dan DILARANG mendefinisikan ulang atau memperlebar tipe-tipe ini.
 *
 * Arti semantik field (siapa pemilik teamId pada gol bunuh diri, apa yang
 * termasuk dalam skor, cara mencatat kartu, dst.) ditetapkan di
 * `docs/data-conventions.md`. Komentar JSDoc di bawah merangkum aturan itu
 * pada tiap field; bila ada selisih, `docs/data-conventions.md` yang berlaku.
 *
 * Catatan penting untuk pengguna tipe:
 * - Berkas JSON yang diimpor bertipe `string` untuk semua nilai teks, sehingga
 *   field berbentuk union literal (GroupLetter, MatchStage, dst.) TIDAK dapat
 *   di-assign langsung dari JSON. Lakukan validasi + type guard di lapisan data.
 * - Tipe hasil kalkulasi (GroupStanding, ThirdPlaceEntry, PlayerAggregateStats,
 *   PlayerRadarDatum) TIDAK disimpan sebagai JSON; dihitung dari Match.events
 *   dan Match.homeScore/awayScore.
 */

// ---------------------------------------------------------------------
// Tipe dasar
// ---------------------------------------------------------------------

/**
 * Huruf grup fase grup. Piala Dunia 2026 memiliki 12 grup (A–L), masing-masing 4 tim.
 *
 * @example "A"
 */
export type GroupLetter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L";

// ---------------------------------------------------------------------
// Tipe inti (PRD Bab 4.1)
// ---------------------------------------------------------------------

/**
 * Satu tim nasional peserta. Data statis (JSON); total 48 tim.
 */
export interface Team {
  /**
   * Pengenal unik tim. Tepat 3 huruf kapital A–Z (kode FIFA) dan WAJIB sama
   * dengan `code`. Dipakai sebagai kunci asing di Player.teamId, Match.homeTeamId,
   * MatchEvent.teamId, dst.
   *
   * Batasan: regex `^[A-Z]{3}$`; unik di seluruh 48 tim; tidak pernah berubah.
   * @example "ARG"
   */
  id: string;

  /**
   * Nama tim untuk ditampilkan di UI.
   *
   * Batasan: tidak kosong; satu tim satu penulisan yang konsisten di seluruh data.
   * @example "Argentina"
   */
  name: string;

  /**
   * Kode 3 huruf kapital tim (kode FIFA) untuk tampilan ringkas (tabel, bagan).
   *
   * Batasan: regex `^[A-Z]{3}$`; sama persis dengan `id`.
   * @example "ARG"
   */
  code: string;

  /**
   * Path bendera relatif terhadap folder `public/`, diawali "/".
   *
   * Batasan: menunjuk berkas yang ada di `public/flags/`; bukan URL eksternal.
   * @example "/flags/arg.svg"
   */
  flagUrl: string;

  /**
   * Grup fase grup tempat tim ini dilombakan.
   *
   * Satuan: huruf grup. Batasan: tepat satu grup per tim; tiap grup berisi 4 tim.
   * @example "J"
   */
  groupLetter: GroupLetter;

  /**
   * Konfederasi sepak bola tim.
   *
   * @example "CONMEBOL"
   */
  confederation: "UEFA" | "CONMEBOL" | "CONCACAF" | "CAF" | "AFC" | "OFC";
}

/**
 * Satu pemain dalam skuad. Data statis (JSON) beserta rekap statistik turnamen.
 */
export interface Player {
  /**
   * Pengenal unik pemain, format `PL-{ID TIM}-{NOMOR PUNGGUNG 2 DIGIT}`.
   *
   * Batasan: regex `^PL-[A-Z]{3}-\d{2}$`; bagian tengah WAJIB sama dengan `teamId`,
   * bagian akhir WAJIB sama dengan `shirtNumber` yang diisi nol di depan (1 → "01").
   * Contoh "PL-010" di PRD hanyalah ilustrasi dan TIDAK dipakai.
   * @example "PL-ARG-10"
   */
  id: string;

  /**
   * Id tim pemain (kunci asing ke Team.id).
   *
   * Batasan: harus ada di data Team.
   * @example "ARG"
   */
  teamId: string;

  /**
   * Nama lengkap untuk halaman profil.
   *
   * Batasan: tidak kosong.
   * @example "Lionel Messi"
   */
  name: string;

  /**
   * Nama ringkas untuk ruang sempit (tabel, kartu, label event).
   *
   * Batasan: tidak kosong.
   * @example "L. Messi"
   */
  shortName: string;

  /**
   * Nomor punggung pemain di turnamen ini.
   *
   * Satuan: nomor (bilangan bulat). Batasan: 1 sampai 99; unik di dalam satu tim.
   * @example 10
   */
  shirtNumber: number;

  /**
   * Posisi utama pemain: GK = penjaga gawang, DF = bek, MF = gelandang, FW = penyerang.
   *
   * @example "FW"
   */
  position: "GK" | "DF" | "MF" | "FW";

  /**
   * Path foto pemain relatif terhadap folder `public/`, diawali "/".
   * Selalu terisi (bukan opsional); pemain tanpa foto memakai path placeholder
   * yang ditetapkan di docs/data-conventions.md.
   *
   * Batasan: bukan URL eksternal.
   * @example "/players/PL-ARG-10.webp"
   */
  photoUrl: string;

  /**
   * Rekap statistik kumulatif pemain sepanjang turnamen (semua fase).
   * Sumber kebenarannya adalah Match.events; nilai di sini adalah salinan
   * terdenormalisasi yang HARUS konsisten dengan hasil agregasi event
   * (lihat PlayerAggregateStats). Seluruh angka adalah bilangan bulat >= 0.
   */
  stats: {
    /**
     * Jumlah laga yang diikuti pemain (starter maupun pemain pengganti).
     *
     * Satuan: laga. Batasan: 0 sampai jumlah laga tim yang berstatus selesai.
     * Catatan: karena Match belum memuat susunan pemain, nilai ini hanya
     * dapat diperkirakan dari event (lihat "Usulan perubahan skema").
     * @example 7
     */
    appearances: number;

    /**
     * Total menit bermain, termasuk perpanjangan waktu, tidak termasuk adu penalti.
     *
     * Satuan: menit. Batasan: 0 sampai 120 per laga (jadi <= 120 x appearances).
     * Catatan: hanya perkiraan sampai ada susunan pemain.
     * @example 630
     */
    minutesPlayed: number;

    /**
     * Jumlah gol yang dicetak pemain: event GOAL ditambah PENALTY_GOAL milik pemain.
     * Gol bunuh diri (OWN_GOAL) dan gol adu penalti TIDAK dihitung.
     *
     * Satuan: gol.
     * @example 5
     */
    goals: number;

    /**
     * Jumlah assist: berapa kali pemain menjadi `relatedPlayerId` pada event GOAL.
     * PENALTY_GOAL dan OWN_GOAL tidak pernah menghasilkan assist.
     *
     * Satuan: assist.
     * @example 3
     */
    assists: number;

    /**
     * Jumlah event YELLOW_CARD milik pemain. Kuning kedua yang berujung merah
     * tetap dihitung sebagai satu kuning (jadi pemain itu mendapat 2 kuning
     * dan 1 merah pada laga tersebut).
     *
     * Satuan: kartu.
     * @example 2
     */
    yellowCards: number;

    /**
     * Jumlah event RED_CARD milik pemain (merah langsung maupun akibat kuning kedua).
     *
     * Satuan: kartu.
     * @example 0
     */
    redCards: number;
  };
}

/**
 * Satu kejadian dalam pertandingan. Disimpan di dalam `Match.events`.
 *
 * Aturan kunci: `teamId` SELALU adalah tim milik `playerId` (termasuk untuk
 * OWN_GOAL). Rincian per jenis event ada di docs/data-conventions.md.
 */
export interface MatchEvent {
  /**
   * Pengenal event, unik secara global (bukan hanya di dalam satu laga).
   *
   * Batasan: regex `^E-\d{4,}$`; 4 digit diisi nol di depan (E-0001, E-0002, ...);
   * tidak pernah dipakai ulang.
   * @example "E-0001"
   */
  id: string;

  /**
   * Menit pertandingan saat event terjadi.
   *
   * Satuan: menit (bilangan bulat). Batasan: 1 sampai 120. Waktu normal 1–90,
   * perpanjangan waktu 91–120. Laga fase grup hanya boleh 1–90.
   * Tambahan waktu (stoppage) dicatat lewat `extraMinute`, bukan dengan menit > batas babak.
   * @example 90
   */
  minute: number;

  /**
   * Menit tambahan waktu (stoppage time) pada akhir babak.
   * Notasi 45+2 ditulis `minute: 45, extraMinute: 2`.
   *
   * Satuan: menit (bilangan bulat). Batasan: >= 1; hanya boleh diisi bila `minute`
   * bernilai 45, 90, 105, atau 120 (akhir babak). Dihilangkan bila tidak ada.
   * @example 3
   */
  extraMinute?: number;

  /**
   * Jenis event.
   * - GOAL: gol dari permainan terbuka atau bola mati selain penalti.
   * - PENALTY_GOAL: gol dari titik penalti DALAM waktu normal/perpanjangan (bukan adu penalti).
   * - OWN_GOAL: gol bunuh diri.
   * - YELLOW_CARD / RED_CARD: kartu kuning / merah.
   * - SUBSTITUTION: penggantian pemain.
   *
   * Gol adu penalti TIDAK pernah dicatat sebagai event.
   * @example "GOAL"
   */
  type:
    | "GOAL"
    | "PENALTY_GOAL"
    | "OWN_GOAL"
    | "YELLOW_CARD"
    | "RED_CARD"
    | "SUBSTITUTION";

  /**
   * Id tim milik `playerId` (kunci asing ke Team.id). Untuk OWN_GOAL ini adalah
   * tim pemain yang membuat gol bunuh diri, yaitu tim yang DIRUGIKAN; skornya
   * ditambahkan ke lawan.
   *
   * Batasan: harus salah satu dari homeTeamId/awayTeamId laga pemilik event
   * dan sama dengan Player.teamId dari `playerId`.
   * @example "ARG"
   */
  teamId: string;

  /**
   * Pemain utama event: pencetak gol (GOAL/PENALTY_GOAL), pembuat gol bunuh diri
   * (OWN_GOAL), penerima kartu (YELLOW_CARD/RED_CARD), atau pemain yang MASUK
   * (SUBSTITUTION).
   *
   * Batasan: harus ada di data Player.
   * @example "PL-ARG-10"
   */
  playerId: string;

  /**
   * Pemain terkait. Hanya dipakai pada dua jenis event:
   * - GOAL: pemberi assist (opsional; dihilangkan bila gol tanpa assist).
   * - SUBSTITUTION: pemain yang KELUAR (wajib).
   * Pada jenis event lain field ini WAJIB dihilangkan.
   *
   * Batasan: pemain di tim yang sama dengan `playerId` dan tidak sama dengan `playerId`.
   * @example "PL-ARG-11"
   */
  relatedPlayerId?: string;
}

/**
 * Satu pertandingan. Total 104 laga: 72 fase grup + 32 fase gugur.
 */
export interface Match {
  /**
   * Pengenal pertandingan, `M-001` sampai `M-104`.
   *
   * Batasan: regex `^M-\d{3}$`, nomor 001–104, unik. Rentang per fase ada di
   * docs/data-conventions.md.
   * @example "M-001"
   */
  id: string;

  /**
   * Fase pertandingan.
   *
   * @example "ROUND_OF_32"
   */
  stage:
    | "GROUP_STAGE"
    | "ROUND_OF_32"
    | "ROUND_OF_16"
    | "QUARTER_FINALS"
    | "SEMI_FINALS"
    | "THIRD_PLACE"
    | "FINAL";

  /**
   * Grup laga ini. WAJIB terisi bila `stage` = "GROUP_STAGE" dan WAJIB dihilangkan
   * pada fase gugur.
   *
   * Batasan: kedua tim laga ini harus punya Team.groupLetter yang sama dengan nilai ini.
   * @example "A"
   */
  // DEVIASI PRD: tipe `GroupLetter` menggantikan `string` seperti pada contoh PRD
  // (penyempurnaan kecil agar huruf grup tervalidasi oleh compiler).
  groupLetter?: GroupLetter;

  /**
   * Giliran laga di fase grup (hari pertandingan ke-1, ke-2, atau ke-3).
   * WAJIB terisi pada fase grup dan WAJIB dihilangkan pada fase gugur.
   *
   * Satuan: nomor giliran. Batasan: 1, 2, atau 3.
   * @example 1
   */
  // DEVIASI PRD: dipersempit dari `number` menjadi union literal `1 | 2 | 3`
  // karena setiap grup berisi 4 tim sehingga hanya ada 3 giliran laga.
  matchday?: 1 | 2 | 3;

  /**
   * Waktu tendangan awal dalam ISO 8601 UTC.
   *
   * Batasan: format persis `YYYY-MM-DDTHH:mm:ssZ` — wajib berakhiran "Z", tanpa
   * offset (+07:00) dan tanpa milidetik. Konversi zona waktu dilakukan di UI.
   * @example "2026-06-11T19:00:00Z"
   */
  kickoffTime: string;

  /**
   * Nama stadion tempat laga dimainkan, ditulis konsisten (satu stadion = satu
   * penulisan di seluruh 104 laga).
   *
   * Batasan: tidak kosong.
   * @example "MetLife Stadium"
   */
  venue: string;

  /**
   * Id tim tuan rumah menurut jadwal (kunci asing ke Team.id). Penanda "home"
   * hanya urutan penulisan jadwal; tidak berarti keunggulan kandang.
   *
   * Batasan: tidak sama dengan `awayTeamId`. Record Match fase gugur baru dibuat
   * setelah kedua tim pasti (lihat docs/data-conventions.md).
   * @example "MEX"
   */
  homeTeamId: string;

  /**
   * Id tim tamu menurut jadwal (kunci asing ke Team.id).
   *
   * Batasan: tidak sama dengan `homeTeamId`.
   * @example "RSA"
   */
  awayTeamId: string;

  /**
   * Skor akhir tim tuan rumah SETELAH waktu normal ditambah perpanjangan waktu.
   * Sudah memuat gol bunuh diri lawan sebagai gol tuan rumah. TIDAK memuat adu penalti.
   *
   * Satuan: gol. Batasan: bilangan bulat >= 0; harus sama dengan jumlah event
   * GOAL + PENALTY_GOAL bertim tuan rumah ditambah OWN_GOAL bertim tamu.
   * Bernilai 0 selama `isFinished` = false dan tidak boleh dipakai untuk klasemen.
   * @example 2
   */
  homeScore: number;

  /**
   * Skor akhir tim tamu (aturan sama dengan `homeScore`, dari sisi tamu).
   *
   * Satuan: gol. Batasan: bilangan bulat >= 0.
   * @example 1
   */
  awayScore: number;

  /**
   * Skor adu penalti tuan rumah. Terpisah dari `homeScore`.
   * Diisi HANYA pada laga fase gugur yang berakhir seri (homeScore === awayScore)
   * dan berlanjut ke adu penalti; selalu berpasangan dengan `awayPenaltyScore`.
   *
   * Satuan: penalti yang berhasil. Batasan: bilangan bulat >= 0 dan tidak sama
   * dengan `awayPenaltyScore` (adu penalti selalu menghasilkan pemenang).
   * @example 4
   */
  homePenaltyScore?: number;

  /**
   * Skor adu penalti tim tamu (aturan sama dengan `homePenaltyScore`).
   *
   * Satuan: penalti yang berhasil. Batasan: bilangan bulat >= 0.
   * @example 3
   */
  awayPenaltyScore?: number;

  /**
   * Status laga. `true` hanya bila hasil akhir sudah final (termasuk adu penalti
   * bila ada). Hanya laga `isFinished` = true yang boleh masuk klasemen,
   * bagan, dan statistik pemain.
   *
   * @example true
   */
  isFinished: boolean;

  /**
   * Seluruh event laga, diurutkan menaik berdasarkan (minute, extraMinute ?? 0),
   * lalu berdasarkan id. Array kosong bila belum ada event.
   */
  events: MatchEvent[];
}

/**
 * Baris klasemen satu tim dalam satu grup.
 *
 * TIPE HASIL KALKULASI (computed): dihitung dari Match yang `isFinished` = true
 * di fase grup. BUKAN data JSON dan tidak boleh disimpan sebagai berkas data.
 */
export interface GroupStanding {
  /**
   * Id tim (kunci asing ke Team.id).
   *
   * @example "MEX"
   */
  teamId: string;

  /**
   * Jumlah laga yang sudah selesai dimainkan tim.
   *
   * Satuan: laga. Batasan: 0 sampai 3 (fase grup); harus sama dengan won + drawn + lost.
   * @example 3
   */
  played: number;

  /**
   * Jumlah kemenangan.
   *
   * Satuan: laga. Batasan: bilangan bulat >= 0.
   * @example 2
   */
  won: number;

  /**
   * Jumlah hasil seri.
   *
   * Satuan: laga. Batasan: bilangan bulat >= 0.
   * @example 1
   */
  drawn: number;

  /**
   * Jumlah kekalahan.
   *
   * Satuan: laga. Batasan: bilangan bulat >= 0.
   * @example 0
   */
  lost: number;

  /**
   * Jumlah gol yang dicetak tim (memuat gol bunuh diri lawan; lihat Match.homeScore).
   *
   * Satuan: gol. Batasan: bilangan bulat >= 0.
   * @example 5
   */
  goalsFor: number;

  /**
   * Jumlah gol yang kemasukan (memuat gol bunuh diri pemain tim sendiri).
   *
   * Satuan: gol. Batasan: bilangan bulat >= 0.
   * @example 2
   */
  goalsAgainst: number;

  /**
   * Selisih gol.
   *
   * Satuan: gol. Batasan: harus sama dengan goalsFor - goalsAgainst; boleh negatif.
   * @example 3
   */
  goalDifference: number;

  /**
   * Poin klasemen: menang 3, seri 1, kalah 0.
   *
   * Satuan: poin. Batasan: harus sama dengan 3 * won + drawn.
   * @example 7
   */
  points: number;

  /**
   * Poin fair play, dipakai sebagai kriteria penentu bila poin dan selisih
   * sama. Bernilai 0 atau NEGATIF (makin besar makin baik): kuning -1, merah akibat
   * kuning kedua -3 (total, menggantikan dua kuning), merah langsung -4, kuning
   * lalu merah langsung -5. Perhitungan memakai aturan pencatatan kartu di
   * docs/data-conventions.md.
   *
   * Satuan: poin. Batasan: bilangan bulat <= 0.
   * @example -2
   */
  fairPlayPoints: number;
}

// ---------------------------------------------------------------------
// Tipe turunan dari Match
// ---------------------------------------------------------------------

/**
 * Alias fase pertandingan; selalu sinkron dengan `Match["stage"]`.
 *
 * @example "QUARTER_FINALS"
 */
export type MatchStage = Match["stage"];

/**
 * Fase gugur: semua `MatchStage` selain "GROUP_STAGE"
 * (ROUND_OF_32, ROUND_OF_16, QUARTER_FINALS, SEMI_FINALS, THIRD_PLACE, FINAL).
 *
 * @example "SEMI_FINALS"
 */
export type KnockoutStage = Exclude<MatchStage, "GROUP_STAGE">;

// DEVIASI PRD: tiga alias berikut (Confederation, PlayerPosition, MatchEventType)
// ditambahkan agar agen lain dapat memakai union ini (mis. Record<MatchEventType, ...>)
// tanpa menulis ulang literalnya. Bentuk data tidak berubah.

/**
 * Alias konfederasi; selalu sinkron dengan `Team["confederation"]`.
 *
 * @example "UEFA"
 */
export type Confederation = Team["confederation"];

/**
 * Alias posisi pemain; selalu sinkron dengan `Player["position"]`.
 *
 * @example "GK"
 */
export type PlayerPosition = Player["position"];

/**
 * Alias jenis event; selalu sinkron dengan `MatchEvent["type"]`.
 *
 * @example "RED_CARD"
 */
export type MatchEventType = MatchEvent["type"];

// ---------------------------------------------------------------------
// Bagan fase gugur
// ---------------------------------------------------------------------

/**
 * Penjelasan asal sebuah slot (sisi tuan rumah atau tamu) pada node bagan.
 * Union terstruktur dengan diskriminator `kind`; setiap varian membawa `label`
 * siap tampil agar UI tidak perlu menyusun teks sendiri.
 */
export type BracketSlotSource =
  | {
      /** Slot diisi tim yang finis di posisi tertentu pada sebuah grup. */
      kind: "GROUP_POSITION";
      /**
       * Grup asal.
       *
       * @example "A"
       */
      groupLetter: GroupLetter;
      /**
       * Posisi akhir di grup: 1 = juara grup, 2 = runner-up.
       *
       * @example 1
       */
      position: 1 | 2;
      /**
       * Teks siap tampil.
       *
       * @example "Juara Grup A"
       */
      label: string;
    }
  | {
      /**
       * Slot diisi salah satu tim peringkat ketiga terbaik (8 dari 12 grup lolos).
       * Tim persisnya ditentukan setelah fase grup selesai dan tampil di
       * BracketNode.homeTeamId / awayTeamId, bukan di sini.
       */
      kind: "THIRD_PLACE";
      /**
       * Grup-grup yang boleh menyumbang tim peringkat ketiga ke slot ini.
       *
       * Batasan: minimal 1 huruf grup, tanpa duplikat.
       * @example ["A", "B", "C", "D", "F"]
       */
      candidateGroups: GroupLetter[];
      /**
       * Teks siap tampil.
       *
       * @example "Peringkat 3 Grup A/B/C/D/F"
       */
      label: string;
    }
  | {
      /** Slot diisi pemenang sebuah pertandingan sebelumnya. */
      kind: "MATCH_WINNER";
      /**
       * Id pertandingan sumber (format Match.id). Id ini dicadangkan sejak awal
       * walaupun record Match-nya belum ada.
       *
       * @example "M-089"
       */
      matchId: string;
      /**
       * Teks siap tampil.
       *
       * @example "Pemenang M-089"
       */
      label: string;
    }
  | {
      /** Slot diisi pecundang sebuah pertandingan sebelumnya (hanya perebutan tempat ketiga). */
      kind: "MATCH_LOSER";
      /**
       * Id pertandingan sumber (format Match.id), yaitu laga semi final.
       *
       * @example "M-101"
       */
      matchId: string;
      /**
       * Teks siap tampil.
       *
       * @example "Pecundang M-101"
       */
      label: string;
    };

/**
 * Satu simpul (satu laga) pada bagan fase gugur. Total 32 node, satu per laga fase gugur.
 *
 * Struktur statis (id, stage, homeSource, awaySource, nextNodeId, loserNextNodeId)
 * didefinisikan sekali. Field peserta dan hasil (matchId, homeTeamId, awayTeamId,
 * winnerTeamId) diturunkan dari data Match dan klasemen; bukan input manual.
 */
export interface BracketNode {
  /**
   * Pengenal node, `BN-{nomor laga 3 digit}` mengikuti nomor Match yang diwakilinya.
   *
   * Batasan: regex `^BN-\d{3}$`, nomor 073–104, unik.
   * @example "BN-089"
   */
  id: string;

  /**
   * Fase node ini (hanya fase gugur).
   *
   * @example "ROUND_OF_16"
   */
  stage: KnockoutStage;

  /**
   * Asal peserta slot tuan rumah.
   */
  homeSource: BracketSlotSource;

  /**
   * Asal peserta slot tamu.
   */
  awaySource: BracketSlotSource;

  /**
   * Id Match yang sudah memiliki record data untuk node ini. Dihilangkan selama
   * kedua peserta belum pasti (record Match fase gugur baru dibuat setelah itu).
   *
   * Batasan: bila ada, harus sama dengan nomor pada `id` (BN-089 → M-089).
   * @example "M-089"
   */
  matchId?: string;

  /**
   * Id tim tuan rumah yang sudah pasti, atau `null` bila belum pasti. Bila
   * dihilangkan, artinya sama dengan belum diketahui (perlakukan seperti null).
   *
   * @example "ARG"
   */
  homeTeamId?: string | null;

  /**
   * Id tim tamu yang sudah pasti, atau `null` bila belum pasti. Bila dihilangkan,
   * perlakukan seperti null.
   *
   * @example null
   */
  awayTeamId?: string | null;

  /**
   * Id tim pemenang (termasuk lewat adu penalti). Dihilangkan sampai laga selesai.
   *
   * Batasan: bila ada, harus sama dengan homeTeamId atau awayTeamId.
   * @example "ARG"
   */
  winnerTeamId?: string;

  /**
   * Id node tujuan PEMENANG (untuk menggambar garis penghubung). Dihilangkan pada
   * node FINAL dan THIRD_PLACE yang tidak punya lanjutan. Slot tujuan (home/away)
   * ditentukan oleh node tujuan lewat BracketSlotSource MATCH_WINNER yang menunjuk laga ini.
   *
   * Batasan: bila ada, menunjuk node lain yang `stage`-nya satu tingkat lebih tinggi.
   * @example "BN-097"
   */
  nextNodeId?: string;

  /**
   * Id node tujuan PECUNDANG. Hanya diisi pada dua node SEMI_FINALS yang
   * pecundangnya menuju node THIRD_PLACE; dihilangkan pada node lain.
   *
   * @example "BN-103"
   */
  loserNextNodeId?: string;
}

// ---------------------------------------------------------------------
// Tipe hasil kalkulasi untuk halaman statistik
// ---------------------------------------------------------------------

/**
 * Entri tabel peringkat tim peringkat ketiga lintas 12 grup: GroupStanding
 * milik tim peringkat ketiga ditambah metadata peringkat lintas grup.
 *
 * TIPE HASIL KALKULASI (computed); bukan data JSON.
 */
export interface ThirdPlaceEntry extends GroupStanding {
  /**
   * Grup asal tim ini.
   *
   * @example "C"
   */
  groupLetter: GroupLetter;

  /**
   * Peringkat tim di antara 12 tim peringkat ketiga (1 = terbaik).
   *
   * Satuan: peringkat. Batasan: bilangan bulat 1 sampai 12, unik di dalam tabel.
   * @example 5
   */
  rank: number;

  /**
   * Apakah tim lolos ke babak 32 besar sebagai peringkat ketiga terbaik.
   * `true` untuk peringkat 1 sampai 8, `false` untuk 9 sampai 12.
   *
   * @example true
   */
  qualified: boolean;

  /**
   * `true` bila grup asal belum menyelesaikan seluruh 6 lajanya, sehingga
   * peringkat dan status lolos masih dapat berubah. `false` bila grup sudah tuntas.
   *
   * @example false
   */
  isProvisional: boolean;
}

/**
 * Agregat statistik satu pemain, dihitung dari Match.events (bukan dari Player.stats).
 * Terdiri dari identitas pemain dan tim, ditambah enam angka yang sama persis dengan
 * `Player["stats"]` (appearances, minutesPlayed, goals, assists, yellowCards, redCards;
 * arti dan batasannya dijelaskan pada Player.stats). Ditulis sebagai interseksi,
 * bukan salinan, agar kedua tipe tidak pernah berbeda bentuk.
 *
 * TIPE HASIL KALKULASI (computed); bukan data JSON.
 */
export type PlayerAggregateStats = Player["stats"] & {
  /**
   * Id pemain (kunci asing ke Player.id).
   *
   * @example "PL-ARG-10"
   */
  playerId: string;

  /**
   * Id tim pemain (kunci asing ke Team.id); sama dengan Player.teamId.
   *
   * @example "ARG"
   */
  teamId: string;
};

/**
 * Satu titik data Radar Chart pemain. Claude #3 menyuplai array tipe ini
 * (satu elemen per sumbu) dan Claude #2 menggambarnya.
 *
 * TIPE HASIL KALKULASI (computed); bukan data JSON.
 */
export interface PlayerRadarDatum {
  /**
   * Label sumbu yang ditampilkan.
   *
   * @example "Gol"
   */
  metric: string;

  /**
   * Nilai ternormalisasi pada sumbu ini.
   *
   * Satuan: skala 0 sampai 100 (bukan satuan mentah). Batasan: 0 <= value <= fullMark.
   * @example 72
   */
  value: number;

  /**
   * Nilai maksimum sumbu; selalu 100.
   *
   * Satuan: skala 0 sampai 100.
   * @example 100
   */
  fullMark: 100;
}
