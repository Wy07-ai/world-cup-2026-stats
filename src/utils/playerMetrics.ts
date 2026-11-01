import type { Player, PlayerPosition, PlayerRadarDatum } from "@/types";

/**
 * Metrik pemain untuk Radar Chart dan kartu pemain.
 *
 * Acuan: Master PRD Bab 5.2 (PlayerCard) dan Bab 7.2 (Claude #3 menyuplai
 * data bagan, Claude #2 menggambarnya); tipe PlayerRadarDatum dari
 * src/types/index.d.ts.
 *
 * Semua fungsi murni dan tidak memutasi masukan.
 */

/** Nilai maksimum turnamen per metrik, dipakai untuk normalisasi radar. */
export interface TournamentMaxStats {
  goals: number;
  assists: number;
  appearances: number;
  minutesPlayed: number;
  /** Beban kartu tertinggi (lihat getCardPenalty). */
  cardPenalty: number;
}

/** Bobot beban kartu: kuning 1, merah 3 (pilihan internal proyek). */
const YELLOW_WEIGHT = 1;
const RED_WEIGHT = 3;

function safe(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/**
 * Beban kartu = 1 x kuning + 3 x merah. Kartu dihitung literal sesuai
 * aturan agregasi, jadi 2 kuning + 1 merah bernilai 5.
 */
export function getCardPenalty(player: Player): number {
  return (
    YELLOW_WEIGHT * safe(player.stats.yellowCards) +
    RED_WEIGHT * safe(player.stats.redCards)
  );
}

/** Nilai maksimum turnamen. Daftar kosong menghasilkan semua nol. */
export function getTournamentMaxStats(players: Player[]): TournamentMaxStats {
  const max: TournamentMaxStats = {
    goals: 0,
    assists: 0,
    appearances: 0,
    minutesPlayed: 0,
    cardPenalty: 0,
  };
  for (const player of players) {
    max.goals = Math.max(max.goals, safe(player.stats.goals));
    max.assists = Math.max(max.assists, safe(player.stats.assists));
    max.appearances = Math.max(max.appearances, safe(player.stats.appearances));
    max.minutesPlayed = Math.max(
      max.minutesPlayed,
      safe(player.stats.minutesPlayed),
    );
    max.cardPenalty = Math.max(max.cardPenalty, getCardPenalty(player));
  }
  return max;
}

/** Normalisasi ke 0 sampai 100 (dibulatkan); maksimum 0 menghasilkan 0. */
function normalize(value: number, max: number): number {
  if (!(max > 0)) return 0;
  return Math.min(100, Math.max(0, Math.round((safe(value) / max) * 100)));
}

/**
 * Data radar dengan sumbu: Gol, Assist, Penampilan, Menit, Disiplin.
 * Setiap nilai = nilai pemain / maksimum turnamen x 100 (bulat, 0 sampai 100);
 * maksimum 0 menghasilkan 0 (tanpa pembagian dengan nol).
 *
 * Disiplin adalah kebalikan beban kartu: 100 - (beban pemain / beban
 * tertinggi) x 100. ASUMSI: bila tidak ada satu pun kartu di turnamen
 * (beban tertinggi 0), Disiplin = 100 (semua pemain bersih), bukan 0 seperti
 * sumbu lain, supaya pemain bersih tidak tampil "tidak disiplin". Catatan
 * data: saat ini kartu belum tercatat di matches.json, jadi nilai ini belum
 * bermakna dan UI sebaiknya memberi keterangan.
 */
export function buildPlayerRadarData(
  player: Player,
  tournamentMax: TournamentMaxStats,
): PlayerRadarDatum[] {
  const discipline =
    tournamentMax.cardPenalty > 0
      ? 100 - normalize(getCardPenalty(player), tournamentMax.cardPenalty)
      : 100;

  return [
    { metric: "Gol", value: normalize(player.stats.goals, tournamentMax.goals), fullMark: 100 },
    { metric: "Assist", value: normalize(player.stats.assists, tournamentMax.assists), fullMark: 100 },
    { metric: "Penampilan", value: normalize(player.stats.appearances, tournamentMax.appearances), fullMark: 100 },
    { metric: "Menit", value: normalize(player.stats.minutesPlayed, tournamentMax.minutesPlayed), fullMark: 100 },
    { metric: "Disiplin", value: discipline, fullMark: 100 },
  ];
}

/** Bobot rating per posisi. Lihat calculatePlayerRating. */
interface RatingWeights {
  goal: number;
  assist: number;
  per90: number;
}

const RATING_WEIGHTS: Readonly<Record<PlayerPosition, RatingWeights>> = {
  FW: { goal: 5, assist: 3.5, per90: 1 },
  MF: { goal: 4, assist: 3.5, per90: 1.5 },
  DF: { goal: 3, assist: 2.5, per90: 2.5 },
  GK: { goal: 2, assist: 2, per90: 3 },
};

const RATING_BASE = 40;
const RATING_MAX = 99;

/**
 * RATING INTERNAL PROYEK, BUKAN rating resmi FIFA maupun EA FC. Dipakai hanya
 * sebagai angka tampilan di kartu pemain; tidak dikalibrasi terhadap sumber
 * eksternal mana pun.
 *
 * Rumus (skala 40 sampai 99, dibulatkan):
 *   rating = 40
 *          + goal   x gol
 *          + assist x assist
 *          + per90  x (menit bermain / 90)
 *          - 1 x kartu kuning - 3 x kartu merah
 *   lalu dibatasi ke 40..99.
 *
 * Bobot per posisi (goal / assist / per90):
 *   FW 5 / 3.5 / 1     MF 4 / 3.5 / 1.5     DF 3 / 2.5 / 2.5     GK 2 / 2 / 3
 * Gol dan assist paling berbobot untuk FW dan makin kecil ke arah GK;
 * sebaliknya menit bermain (kehadiran konsisten) makin berbobot ke arah GK.
 * Clean sheet tidak tersedia di data, jadi tidak ikut dihitung.
 *
 * Karena menit bermain hanyalah perkiraan (belum ada data lineup), rating
 * pemain yang jarang muncul di event cenderung terlalu rendah.
 */
export function calculatePlayerRating(player: Player): number {
  const weights = RATING_WEIGHTS[player.position];
  const raw =
    weights.goal * safe(player.stats.goals) +
    weights.assist * safe(player.stats.assists) +
    (weights.per90 * safe(player.stats.minutesPlayed)) / 90 -
    getCardPenalty(player);
  return Math.round(Math.min(RATING_MAX, Math.max(RATING_BASE, RATING_BASE + raw)));
}
