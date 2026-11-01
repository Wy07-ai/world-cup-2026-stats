import type { Match, MatchEvent, Player, PlayerAggregateStats } from "@/types";

/**
 * Agregasi statistik pemain dari Match.events.
 *
 * Acuan: Master PRD Bab 4.3 (nilai agregat tidak boleh di-hardcode, dihitung
 * dari events) dan Bab 6.3 (agregasi statistik, tie-breaker Golden Boot, menit
 * bermain), ditambah Bab 6.4 (adu penalti dan gol bunuh diri) serta
 * docs/data-conventions.md bagian 3 sampai 5.
 *
 * Semua fungsi di berkas ini murni: tidak memutasi parameter, tidak menulis
 * ke JSON, tidak memakai Date atau angka acak.
 *
 * ---------------------------------------------------------------------
 * ATURAN YANG PASTI (bukan perkiraan)
 * ---------------------------------------------------------------------
 * - Hanya laga `isFinished === true` yang dihitung.
 * - Gol: GOAL dan PENALTY_GOAL pada menit 1 sampai 120 menambah `goals`
 *   milik `playerId`. OWN_GOAL TIDAK menambah gol pemain mana pun. Gol adu
 *   penalti tidak dicatat sebagai event (konvensi), jadi tidak pernah masuk.
 * - Assist: `relatedPlayerId` pada event GOAL. PENALTY_GOAL dan OWN_GOAL tidak
 *   menghasilkan assist.
 * - Kartu: setiap event YELLOW_CARD dan RED_CARD dihitung SECARA LITERAL.
 *   Dua kuning dan satu merah pada satu laga berarti yellowCards 2 dan
 *   redCards 1 (sesuai docs/data-conventions.md bagian 4).
 * - Event dengan `minute` di atas 120, di bawah 1, atau bukan bilangan bulat
 *   DIABAIKAN SELURUHNYA (tidak menambah gol, assist, kartu, maupun
 *   penampilan) dan menghasilkan satu peringatan. Catatan: `120+5` (minute 120,
 *   extraMinute 5) valid; yang diperiksa adalah field `minute`, bukan
 *   minute + extraMinute.
 *
 * ---------------------------------------------------------------------
 * PERKIRAAN: penampilan dan menit bermain (BUKAN data pasti)
 * ---------------------------------------------------------------------
 * Tipe `Match` belum memuat susunan pemain awal (lineup). Karena itu
 * `appearances` dan `minutesPlayed` DIPERKIRAKAN dari event, dan hasilnya
 * cenderung LEBIH RENDAH dari kenyataan: pemain yang bermain tanpa pernah
 * muncul di event (banyak kiper dan bek) tidak terlacak sama sekali.
 * Akurasi penuh membutuhkan data lineup (usulan skema: docs/data-conventions.md
 * bagian 9.1, menunggu persetujuan Claude #1/pengguna). Starter TIDAK
 * dikarang; aturan perkiraannya:
 *   (a) Pemain dianggap tampil di sebuah laga bila muncul sebagai `playerId`
 *       atau `relatedPlayerId` pada event laga itu.
 *   (b) Pemain pengganti (playerId pada SUBSTITUTION) bermain dari menit masuk
 *       sampai akhir durasi laga.
 *   (c) Pemain yang digantikan (relatedPlayerId pada SUBSTITUTION) dianggap
 *       starter dan bermain dari 0 sampai menit keluar.
 *   (d) Pemain lain yang muncul di event dan tidak digantikan dianggap starter
 *       yang bermain sampai akhir durasi laga, atau sampai menit kartu merah
 *       bila ada.
 *
 * DURASI LAGA (calculateMatchDuration)
 *   - Waktu normal = 90 + extraMinute terbesar pada event bermenit 90
 *     (event 90+4 berarti 94 menit). Tambahan waktu babak pertama (45+x)
 *     tidak ikut dihitung karena jam babak kedua dimulai ulang dari 46.
 *   - Bila ada event bermenit di atas 90 (perpanjangan waktu), durasi = 120
 *     (batas maksimum PRD Bab 6.3), apa pun extraMinute-nya.
 *   - TAMBAHAN (asumsi, lihat laporan): laga yang memiliki skor adu penalti
 *     (homePenaltyScore dan awayPenaltyScore) pasti sudah melewati perpanjangan
 *     waktu, jadi durasinya 120 walau tidak ada event di atas menit 90.
 *
 * WAKTU TERPAKAI SEBUAH EVENT (untuk pergantian dan kartu merah)
 *   = minute, ditambah extraMinute hanya bila minute === 90 (akhir waktu
 *   normal); hasilnya dibatasi ke 0 sampai durasi laga.
 */

/** Jenis peringatan yang dihasilkan agregasi. */
export type AggregationWarningCode =
  | "EVENT_MINUTE_OUT_OF_RANGE"
  | "UNKNOWN_PLAYER";

/** Satu peringatan agregasi (data yang diabaikan, bukan galat fatal). */
export interface AggregationWarning {
  code: AggregationWarningCode;
  matchId: string;
  eventId: string;
  message: string;
}

/** Opsi tambahan; semua opsional agar signature dasar tetap sederhana. */
export interface AggregationOptions {
  /** Dipanggil untuk setiap peringatan. Fungsi agregasi sendiri tidak mencetak log. */
  onWarning?: (warning: AggregationWarning) => void;
}

/** Hasil agregasi beserta seluruh peringatannya. */
export interface AggregationResult {
  stats: PlayerAggregateStats[];
  warnings: AggregationWarning[];
}

const NORMAL_TIME_MINUTES = 90;
const MAX_MATCH_MINUTES = 120;

function emptyStats(): Player["stats"] {
  return {
    appearances: 0,
    minutesPlayed: 0,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
  };
}

function isValidMinute(minute: number): boolean {
  return Number.isInteger(minute) && minute >= 1 && minute <= MAX_MATCH_MINUTES;
}

function hasShootout(match: Match): boolean {
  return (
    match.homePenaltyScore !== undefined && match.awayPenaltyScore !== undefined
  );
}

/**
 * Durasi laga dalam menit (lihat aturan di komentar berkas).
 * Event dengan menit tidak valid diabaikan.
 */
export function calculateMatchDuration(match: Match): number {
  let maxInjury = 0;
  let reachedExtraTime = hasShootout(match);

  for (const event of match.events) {
    if (!isValidMinute(event.minute)) continue;
    if (event.minute > NORMAL_TIME_MINUTES) {
      reachedExtraTime = true;
    } else if (event.minute === NORMAL_TIME_MINUTES) {
      const extra = event.extraMinute ?? 0;
      if (Number.isInteger(extra) && extra > maxInjury) maxInjury = extra;
    }
  }

  if (reachedExtraTime) return MAX_MATCH_MINUTES;
  return Math.min(NORMAL_TIME_MINUTES + maxInjury, MAX_MATCH_MINUTES);
}

/** Menit jam pertandingan saat event terjadi, dibatasi 0 sampai `duration`. */
function elapsedMinute(event: MatchEvent, duration: number): number {
  const extra =
    event.minute === NORMAL_TIME_MINUTES && Number.isInteger(event.extraMinute)
      ? (event.extraMinute ?? 0)
      : 0;
  return Math.max(0, Math.min(event.minute + extra, duration));
}

/**
 * Hitung statistik seluruh pemain beserta peringatannya. Keluaran berisi satu
 * entri per pemain pada `players`, urutan sama dengan masukan (pemain tanpa
 * event tetap ada dengan angka 0).
 */
export function aggregatePlayerStatsDetailed(
  players: Player[],
  matches: Match[],
  options: AggregationOptions = {},
): AggregationResult {
  const warnings: AggregationWarning[] = [];
  const warn = (warning: AggregationWarning): void => {
    warnings.push(warning);
    options.onWarning?.(warning);
  };

  const totals = new Map<string, Player["stats"]>();
  for (const player of players) totals.set(player.id, emptyStats());

  for (const match of matches) {
    if (!match.isFinished) continue;

    const events: MatchEvent[] = [];
    for (const event of match.events) {
      if (!isValidMinute(event.minute)) {
        warn({
          code: "EVENT_MINUTE_OUT_OF_RANGE",
          matchId: match.id,
          eventId: event.id,
          message: `Event ${event.id} di ${match.id} bermenit ${event.minute} (di luar 1 sampai 120): diabaikan.`,
        });
        continue;
      }
      events.push(event);
    }

    const duration = calculateMatchDuration(match);
    const appeared = new Set<string>();
    const subInAt = new Map<string, number>();
    const subOutAt = new Map<string, number>();
    const redAt = new Map<string, number>();
    const reportedUnknown = new Set<string>();

    const resolve = (id: string, event: MatchEvent): Player["stats"] | null => {
      const stats = totals.get(id);
      if (stats) return stats;
      if (!reportedUnknown.has(id)) {
        reportedUnknown.add(id);
        warn({
          code: "UNKNOWN_PLAYER",
          matchId: match.id,
          eventId: event.id,
          message: `Pemain ${id} pada event ${event.id} di ${match.id} tidak ada di daftar pemain: diabaikan.`,
        });
      }
      return null;
    };

    for (const event of events) {
      const main = resolve(event.playerId, event);
      const related =
        event.relatedPlayerId !== undefined
          ? resolve(event.relatedPlayerId, event)
          : null;
      const at = elapsedMinute(event, duration);

      if (main) appeared.add(event.playerId);
      if (related && event.relatedPlayerId !== undefined) {
        appeared.add(event.relatedPlayerId);
      }

      switch (event.type) {
        case "GOAL":
          if (main) main.goals += 1;
          if (related) related.assists += 1;
          break;
        case "PENALTY_GOAL":
          // Tidak ada assist pada gol penalti, walau relatedPlayerId terisi.
          if (main) main.goals += 1;
          break;
        case "OWN_GOAL":
          // Gol bunuh diri bukan gol pemain; pemainnya tetap dianggap tampil.
          break;
        case "YELLOW_CARD":
          if (main) main.yellowCards += 1;
          break;
        case "RED_CARD":
          if (main) main.redCards += 1;
          if (main) {
            const previous = redAt.get(event.playerId);
            if (previous === undefined || at < previous) {
              redAt.set(event.playerId, at);
            }
          }
          break;
        case "SUBSTITUTION":
          if (main && !subInAt.has(event.playerId)) {
            subInAt.set(event.playerId, at);
          }
          if (related && event.relatedPlayerId !== undefined) {
            if (!subOutAt.has(event.relatedPlayerId)) {
              subOutAt.set(event.relatedPlayerId, at);
            }
          }
          break;
      }
    }

    for (const playerId of appeared) {
      const stats = totals.get(playerId);
      if (!stats) continue;
      const start = subInAt.get(playerId) ?? 0;
      const end = Math.min(
        duration,
        subOutAt.get(playerId) ?? duration,
        redAt.get(playerId) ?? duration,
      );
      stats.appearances += 1;
      stats.minutesPlayed += Math.max(0, end - start);
    }
  }

  const stats = players.map((player): PlayerAggregateStats => {
    const total = totals.get(player.id) ?? emptyStats();
    return { ...total, playerId: player.id, teamId: player.teamId };
  });
  return { stats, warnings };
}

/**
 * Hitung statistik seluruh pemain dari `matches` (hanya laga selesai).
 * Satu entri per pemain, urutan mengikuti `players`. Untuk mendapat
 * peringatan, berikan `options.onWarning` atau pakai
 * `aggregatePlayerStatsDetailed`.
 */
export function aggregatePlayerStats(
  players: Player[],
  matches: Match[],
  options: AggregationOptions = {},
): PlayerAggregateStats[] {
  return aggregatePlayerStatsDetailed(players, matches, options).stats;
}

/**
 * Salinan pemain dengan `stats` terisi dari hasil agregasi. Tidak memutasi
 * masukan dan tidak menulis ke JSON.
 */
export function enrichPlayers(
  players: Player[],
  matches: Match[],
  options: AggregationOptions = {},
): Player[] {
  const aggregates = aggregatePlayerStats(players, matches, options);
  const byId = new Map<string, PlayerAggregateStats>();
  for (const aggregate of aggregates) byId.set(aggregate.playerId, aggregate);

  return players.map((player): Player => {
    const aggregate = byId.get(player.id);
    const stats = aggregate
      ? {
          appearances: aggregate.appearances,
          minutesPlayed: aggregate.minutesPlayed,
          goals: aggregate.goals,
          assists: aggregate.assists,
          yellowCards: aggregate.yellowCards,
          redCards: aggregate.redCards,
        }
      : emptyStats();
    return { ...player, stats };
  });
}

/**
 * Pencetak gol terbanyak (Golden Boot). Pemain bergol 0 tidak ikut.
 * Urutan (PRD Bab 6.3): gol terbanyak, assist terbanyak, menit bermain paling
 * sedikit, lalu nama alfabetis (dan id) agar hasil stabil. `limit` yang tidak
 * valid atau <= 0 menghasilkan array kosong. Tidak memutasi masukan.
 *
 * Catatan: `minutesPlayed` hanya perkiraan sampai data lineup tersedia.
 */
export function getTopScorers(players: Player[], limit: number): Player[] {
  if (!Number.isFinite(limit) || limit <= 0) return [];
  return players
    .filter((player) => player.stats.goals > 0)
    .sort(
      (a, b) =>
        b.stats.goals - a.stats.goals ||
        b.stats.assists - a.stats.assists ||
        a.stats.minutesPlayed - b.stats.minutesPlayed ||
        a.name.localeCompare(b.name, "en") ||
        (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
    )
    .slice(0, Math.floor(limit));
}
