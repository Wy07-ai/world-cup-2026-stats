import type {
  GroupLetter,
  GroupStanding,
  Match,
  MatchEvent,
  Team,
} from "@/types";

/**
 * Klasemen fase grup.
 *
 * Acuan: Master PRD Bab 4.1 (tipe GroupStanding) dan Bab 6.1 (sistem poin dan
 * urutan tie-breaker), serta docs/data-conventions.md bagian 2 (skor sudah
 * memuat gol bunuh diri) dan bagian 4 (pencatatan kartu).
 *
 * Semua fungsi di berkas ini murni: tidak memutasi parameter, tidak memakai
 * Date atau angka acak, dan hasilnya hanya bergantung pada input.
 *
 * ---------------------------------------------------------------------
 * URUTAN TIE-BREAKER (PRD Bab 6.1, urutan wajib)
 * ---------------------------------------------------------------------
 *   1. poin
 *   2. selisih gol (GD)
 *   3. gol memasukkan (GF)
 *   4. poin head-to-head antar tim yang masih imbang
 *   5. selisih gol head-to-head
 *   6. gol memasukkan head-to-head
 *   7. fair play (makin mendekati nol makin baik)
 *   8. pemutus terakhir: nama tim secara alfabetis (lalu id tim), agar stabil
 *
 * BATASAN SATU PUTARAN HEAD-TO-HEAD
 * Kriteria 4 sampai 6 diterapkan SATU KALI pada kelompok tim yang imbang
 * penuh pada (poin, GD, GF). Mini-tabel dihitung dari laga di antara anggota
 * kelompok itu saja. Bila setelah satu putaran masih ada sub-kelompok yang
 * imbang, H2H TIDAK dihitung ulang khusus untuk sub-kelompok tersebut; sisa
 * yang imbang langsung jatuh ke fair play lalu alfabetis. Contoh: tiga tim
 * imbang, mini-tabel memisahkan satu tim dari dua lainnya, dua tim sisanya
 * tidak dibandingkan ulang lewat laga mereka berdua. Ini mengikuti spesifikasi
 * tugas; regulasi yang menerapkan ulang (rekursif) akan memberi hasil berbeda
 * pada kasus langka seperti itu.
 *
 * ANTI HITUNG GANDA GOL BUNUH DIRI
 * GF dan GA hanya bersumber dari homeScore dan awayScore. Menurut konvensi
 * data, skor itu sudah menghitung gol bunuh diri sebagai gol tim yang
 * diuntungkan, sehingga events TIDAK PERNAH dipakai untuk menghitung gol.
 * Events hanya dibaca untuk kartu (fair play). Skor adu penalti diabaikan.
 */

const POINTS_WIN = 3;
const POINTS_DRAW = 1;

/**
 * Poin fair play dari sekumpulan event SATU laga.
 *
 * Dihitung per pemain berdasarkan jumlah YELLOW_CARD dan RED_CARD miliknya di
 * laga tersebut (docs/data-conventions.md bagian 4):
 *   - 1 kuning saja                      -> -1
 *   - 2 kuning berujung merah (1 merah)  -> -3 (menggantikan dua kuning)
 *   - merah langsung (0 kuning)          -> -4
 *   - 1 kuning lalu merah langsung       -> -5
 * Dua kuning tanpa merah tidak sah menurut konvensi; di sini dihitung -1 per
 * kartu agar tidak ada kartu yang hilang. Merah ganda diperlakukan sebagai
 * satu merah. Event selain kartu diabaikan.
 *
 * @param events  event dari satu laga (bukan gabungan banyak laga)
 * @param teamId  bila diberikan, hanya kartu milik tim ini yang dihitung
 * @returns nilai nol atau negatif (makin mendekati nol makin baik)
 */
export function getFairPlayPoints(
  events: readonly MatchEvent[],
  teamId?: string,
): number {
  const perPlayer = new Map<string, { yellow: number; red: number }>();

  for (const event of events) {
    if (event.type !== "YELLOW_CARD" && event.type !== "RED_CARD") continue;
    if (teamId !== undefined && event.teamId !== teamId) continue;

    const tally = perPlayer.get(event.playerId) ?? { yellow: 0, red: 0 };
    if (event.type === "YELLOW_CARD") tally.yellow += 1;
    else tally.red += 1;
    perPlayer.set(event.playerId, tally);
  }

  let total = 0;
  for (const { yellow, red } of perPlayer.values()) {
    if (red === 0) {
      total -= yellow;
    } else if (yellow >= 2) {
      total -= 3;
    } else if (yellow === 1) {
      total -= 5;
    } else {
      total -= 4;
    }
  }
  // Hindari -0 agar perbandingan dan snapshot tetap bersih.
  return total === 0 ? 0 : total;
}

function emptyRow(teamId: string): GroupStanding {
  return {
    teamId,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    fairPlayPoints: 0,
  };
}

function applyResult(
  row: GroupStanding,
  goalsFor: number,
  goalsAgainst: number,
): void {
  row.played += 1;
  row.goalsFor += goalsFor;
  row.goalsAgainst += goalsAgainst;
  row.goalDifference = row.goalsFor - row.goalsAgainst;
  if (goalsFor > goalsAgainst) {
    row.won += 1;
    row.points += POINTS_WIN;
  } else if (goalsFor === goalsAgainst) {
    row.drawn += 1;
    row.points += POINTS_DRAW;
  } else {
    row.lost += 1;
  }
}

/**
 * Tabel (tanpa pengurutan) untuk himpunan tim tertentu dari laga yang kedua
 * timnya ada di himpunan itu. Dipakai untuk klasemen penuh grup maupun
 * mini-tabel head-to-head. Hanya skor akhir (homeScore/awayScore) yang
 * dipakai untuk gol; events hanya untuk fair play.
 */
function buildTable(
  teamIds: readonly string[],
  matches: readonly Match[],
): Map<string, GroupStanding> {
  const rows = new Map<string, GroupStanding>();
  for (const id of teamIds) rows.set(id, emptyRow(id));

  for (const match of matches) {
    const home = rows.get(match.homeTeamId);
    const away = rows.get(match.awayTeamId);
    if (home === undefined || away === undefined) continue;

    applyResult(home, match.homeScore, match.awayScore);
    applyResult(away, match.awayScore, match.homeScore);
    home.fairPlayPoints += getFairPlayPoints(match.events, match.homeTeamId);
    away.fairPlayPoints += getFairPlayPoints(match.events, match.awayTeamId);
  }
  return rows;
}

/** Urutan menurun: nilai lebih besar lebih dulu. */
function descending(a: number, b: number): number {
  return b - a;
}

function compareText(a: string, b: string): number {
  const byName = a.localeCompare(b, "en", { sensitivity: "base" });
  if (byName !== 0) return byName;
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Urutkan satu kelompok tim yang imbang penuh pada (poin, GD, GF):
 * H2H (poin, GD, GF) -> fair play -> nama -> id. Satu putaran saja.
 */
function resolveTiedCluster(
  cluster: readonly GroupStanding[],
  groupMatches: readonly Match[],
  nameOf: ReadonlyMap<string, string>,
): GroupStanding[] {
  const mini = buildTable(
    cluster.map((row) => row.teamId),
    groupMatches,
  );

  const h2h = (teamId: string): GroupStanding => mini.get(teamId) ?? emptyRow(teamId);
  const label = (teamId: string): string => nameOf.get(teamId) ?? teamId;

  return [...cluster].sort((a, b) => {
    const ha = h2h(a.teamId);
    const hb = h2h(b.teamId);
    return (
      descending(ha.points, hb.points) ||
      descending(ha.goalDifference, hb.goalDifference) ||
      descending(ha.goalsFor, hb.goalsFor) ||
      descending(a.fairPlayPoints, b.fairPlayPoints) ||
      compareText(label(a.teamId), label(b.teamId)) ||
      compareText(a.teamId, b.teamId)
    );
  });
}

/**
 * Menghitung klasemen satu grup.
 *
 * Hanya laga dengan stage "GROUP_STAGE", groupLetter yang sama, dan
 * isFinished true yang dihitung; laga lain diabaikan tanpa error. Laga yang
 * melibatkan tim di luar grup (data tidak konsisten) juga dilewati.
 *
 * @returns SEMUA tim pada grup (termasuk yang belum bermain, bernilai 0),
 *          terurut dari peringkat 1. Array baru; input tidak diubah.
 */
export function calculateStandings(
  matches: Match[],
  teams: Team[],
  groupLetter: GroupLetter,
): GroupStanding[] {
  const groupTeams = teams.filter((team) => team.groupLetter === groupLetter);
  const nameOf = new Map<string, string>();
  for (const team of groupTeams) nameOf.set(team.id, team.name);

  const groupMatches = matches.filter(
    (match) =>
      match.stage === "GROUP_STAGE" &&
      match.groupLetter === groupLetter &&
      match.isFinished === true,
  );

  const table = buildTable(
    groupTeams.map((team) => team.id),
    groupMatches,
  );

  // Langkah 1-3: poin, GD, GF. Pengurutan ini hanya membentuk kelompok imbang;
  // urutan di dalam kelompok imbang diputuskan oleh resolveTiedCluster.
  const ranked = [...table.values()].sort(
    (a, b) =>
      descending(a.points, b.points) ||
      descending(a.goalDifference, b.goalDifference) ||
      descending(a.goalsFor, b.goalsFor),
  );

  const result: GroupStanding[] = [];
  let start = 0;
  while (start < ranked.length) {
    let end = start + 1;
    while (
      end < ranked.length &&
      ranked[end].points === ranked[start].points &&
      ranked[end].goalDifference === ranked[start].goalDifference &&
      ranked[end].goalsFor === ranked[start].goalsFor
    ) {
      end += 1;
    }

    const cluster = ranked.slice(start, end);
    result.push(
      ...(cluster.length === 1
        ? cluster
        : resolveTiedCluster(cluster, groupMatches, nameOf)),
    );
    start = end;
  }

  return result;
}
