import type {
  BracketNode,
  BracketSlotSource,
  GroupLetter,
  GroupStanding,
  KnockoutStage,
  Match,
  ThirdPlaceEntry,
} from "@/types";

/**
 * Penyusun bagan fase gugur (knockout bracket).
 *
 * Acuan: Master PRD Bab 7.3 (rantai handoff braket: Claude #3 menyusun logika
 * penempatan tim dari hasil grup ke braket) dengan Bab 6.2 (peringkat tiga
 * terbaik), Bab 6.4 (adu penalti hanya menentukan siapa yang lolos) dan
 * Bab 4.1 (tipe Match dan BracketNode dari @/types).
 *
 * Fungsi murni: input tidak dimutasi, hasil deterministik, tanpa Date/acak.
 *
 * ---------------------------------------------------------------------
 * ALUR
 * ---------------------------------------------------------------------
 *  1. Satu node per laga non-grup (id laga `M-nnn`, nnn = 073..104).
 *  2. Asal slot (homeSource/awaySource) diturunkan dari kode placeholder pada
 *     Match.homeTeamId/awayTeamId (docs/data-conventions.md bagian 10). Bila
 *     laga sudah memuat id tim asli (tidak ada placeholder), asal slot diambil
 *     dari KNOCKOUT_SCHEDULE di bawah.
 *  3. Peserta R32: juara/runner-up grup hanya pasti bila seluruh 6 laga grup
 *     itu selesai; 8 peringkat ketiga hanya ditempatkan bila seluruh 12 grup
 *     selesai.
 *  4. Peserta babak berikutnya dan pemenang dipropagasi babak demi babak.
 *
 * ---------------------------------------------------------------------
 * PRIORITAS DATA RESMI
 * ---------------------------------------------------------------------
 * Bila Match sudah memuat id tim asli untuk sebuah slot, id itu yang dipakai.
 * Selisih terhadap hasil hitungan TIDAK mengubah node; ia dicatat sebagai
 * peringatan yang dikeluarkan validateBracket (lihat WARNINGS_BY_NODE).
 *
 * ---------------------------------------------------------------------
 * KETERBATASAN PENEMPATAN PERINGKAT KETIGA (BELUM TERVERIFIKASI)
 * ---------------------------------------------------------------------
 * FIFA menetapkan tabel kombinasi resmi (495 kombinasi 8 dari 12 grup) untuk
 * memetakan peringkat ketiga ke slot 3rd-.... Tabel itu TIDAK tersedia pada
 * proyek ini dan tidak dapat diverifikasi, jadi TIDAK dikarang. Sebagai
 * gantinya dipakai pencocokan berbatasan: setiap peringkat ketiga hanya boleh
 * menempati slot yang mencantumkan grupnya; slot diproses menurut nomor laga
 * naik dan grup menurut huruf naik, dengan backtracking, sehingga hasil
 * deterministik. Bila ada lebih dari satu penugasan valid, hasil di sini BISA
 * BERBEDA dari tabel resmi FIFA. Slot yang sudah berisi id tim asli pada
 * matches.json dihormati lebih dulu dan menjadi batasan bagi sisanya.
 */

// ---------------------------------------------------------------------
// Konstanta struktur
// ---------------------------------------------------------------------

const GROUP_LETTERS: readonly GroupLetter[] = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
];

/** Urutan babak fase gugur (dipakai untuk pengurutan dan propagasi). */
const STAGE_ORDER: readonly KnockoutStage[] = [
  "ROUND_OF_32",
  "ROUND_OF_16",
  "QUARTER_FINALS",
  "SEMI_FINALS",
  "THIRD_PLACE",
  "FINAL",
];

/** Jumlah laga yang diharapkan per babak. */
const STAGE_COUNTS: Readonly<Record<KnockoutStage, number>> = {
  ROUND_OF_32: 16,
  ROUND_OF_16: 8,
  QUARTER_FINALS: 4,
  SEMI_FINALS: 2,
  THIRD_PLACE: 1,
  FINAL: 1,
};

/** Babak tujuan pemenang. THIRD_PLACE dan FINAL tidak punya lanjutan. */
const NEXT_STAGE: Readonly<Partial<Record<KnockoutStage, KnockoutStage>>> = {
  ROUND_OF_32: "ROUND_OF_16",
  ROUND_OF_16: "QUARTER_FINALS",
  QUARTER_FINALS: "SEMI_FINALS",
  SEMI_FINALS: "FINAL",
};

const FIRST_KNOCKOUT_NUMBER = 73;
const LAST_KNOCKOUT_NUMBER = 104;
const TOTAL_KNOCKOUT_NODES = 32;
const GROUP_MATCH_COUNT = 6;
const QUALIFIED_THIRD_COUNT = 8;

/**
 * Susunan resmi 32 laga fase gugur dalam kode placeholder [tuan rumah, tamu].
 *
 * Dipakai HANYA sebagai sumber asal slot bila Match tidak memuat placeholder
 * (kasus data saat ini: seluruh laga sudah memuat id tim asli), dan sebagai
 * pembanding struktur di validateBracket.
 *
 * Status verifikasi: R32 M73-M90 dan M89-M90 cocok dengan jadwal publik FIFA
 * (diperiksa lewat pencarian web). Seluruh 32 baris juga konsisten dengan
 * pasangan tim nyata pada src/data/matches.json (dicek oleh tes integrasi).
 * Baris R16 M91-M96, QF, SF, perebutan tempat ketiga dan Final tidak ditemukan
 * langsung pada sumber web yang diperiksa; keabsahannya bertumpu pada
 * konsistensi dengan data tersebut. Bila FIFA menetapkan lain, PRD dan
 * regulasi FIFA yang menang.
 */
export const KNOCKOUT_SCHEDULE: Readonly<
  Record<number, readonly [string, string]>
> = {
  73: ["2A", "2B"],
  74: ["1E", "3rd-ABCDF"],
  75: ["1F", "2C"],
  76: ["1C", "2F"],
  77: ["1I", "3rd-CDFGH"],
  78: ["2E", "2I"],
  79: ["1A", "3rd-CEFHI"],
  80: ["1L", "3rd-EHIJK"],
  81: ["1D", "3rd-BEFIJ"],
  82: ["1G", "3rd-AEHIJ"],
  83: ["2K", "2L"],
  84: ["1H", "2J"],
  85: ["1B", "3rd-EFGIJ"],
  86: ["1J", "2H"],
  87: ["1K", "3rd-DEIJL"],
  88: ["2D", "2G"],
  89: ["W-M074", "W-M077"],
  90: ["W-M073", "W-M075"],
  91: ["W-M076", "W-M078"],
  92: ["W-M079", "W-M080"],
  93: ["W-M083", "W-M084"],
  94: ["W-M081", "W-M082"],
  95: ["W-M086", "W-M088"],
  96: ["W-M085", "W-M087"],
  97: ["W-M089", "W-M090"],
  98: ["W-M093", "W-M094"],
  99: ["W-M091", "W-M092"],
  100: ["W-M095", "W-M096"],
  101: ["W-M097", "W-M098"],
  102: ["W-M099", "W-M100"],
  103: ["L-M101", "L-M102"],
  104: ["W-M101", "W-M102"],
};

function isKnockoutStage(stage: Match["stage"]): stage is KnockoutStage {
  return stage !== "GROUP_STAGE";
}

/** Stage yang seharusnya dimiliki sebuah nomor laga (073..104). */
function expectedStageOf(num: number): KnockoutStage | null {
  if (num >= 73 && num <= 88) return "ROUND_OF_32";
  if (num >= 89 && num <= 96) return "ROUND_OF_16";
  if (num >= 97 && num <= 100) return "QUARTER_FINALS";
  if (num === 101 || num === 102) return "SEMI_FINALS";
  if (num === 103) return "THIRD_PLACE";
  if (num === 104) return "FINAL";
  return null;
}

// ---------------------------------------------------------------------
// Peringatan hasil build (dibaca validateBracket)
// ---------------------------------------------------------------------

/**
 * Peringatan yang hanya bisa diketahui saat membangun (mis. data resmi
 * berbeda dari hasil hitungan). BracketNode tidak punya field untuk itu dan
 * tipe tidak boleh diubah, jadi disimpan di sini per objek node. WeakMap ini
 * tidak memutasi input dan tidak memengaruhi isi node. Kelemahan: peringatan
 * hilang bila node disalin (spread/structuredClone) sebelum divalidasi.
 */
const WARNINGS_BY_NODE = new WeakMap<BracketNode, readonly string[]>();

// ---------------------------------------------------------------------
// Parsing kode dan label
// ---------------------------------------------------------------------

const TEAM_ID_PATTERN = /^[A-Z]{3}$/;
const GROUP_POSITION_PATTERN = /^([12])([A-L])$/;
const THIRD_PATTERN = /^3rd-([A-L]{2,8})$/;
const WINNER_PATTERN = /^W-M(\d{3})$/;
const LOSER_PATTERN = /^L-M(\d{3})$/;
const MATCH_ID_PATTERN = /^M-(\d{3})$/;

function pad3(n: number): string {
  return String(n).padStart(3, "0");
}

function matchIdOf(num: number): string {
  return `M-${pad3(num)}`;
}

function nodeIdOf(num: number): string {
  return `BN-${pad3(num)}`;
}

function matchNumberOf(matchId: string): number | null {
  const m = MATCH_ID_PATTERN.exec(matchId);
  return m === null ? null : Number(m[1]);
}

function isGroupLetter(value: string): value is GroupLetter {
  return (GROUP_LETTERS as readonly string[]).includes(value);
}

/** Mengubah kode placeholder menjadi asal slot; null bila bukan placeholder. */
function parseSlotCode(code: string): BracketSlotSource | null {
  const pos = GROUP_POSITION_PATTERN.exec(code);
  if (pos !== null && isGroupLetter(pos[2])) {
    const position = pos[1] === "1" ? 1 : 2;
    return {
      kind: "GROUP_POSITION",
      groupLetter: pos[2],
      position,
      label:
        position === 1 ? `Juara Grup ${pos[2]}` : `Runner-up Grup ${pos[2]}`,
    };
  }

  const third = THIRD_PATTERN.exec(code);
  if (third !== null) {
    const groups: GroupLetter[] = [];
    for (const ch of third[1]) {
      if (isGroupLetter(ch) && !groups.includes(ch)) groups.push(ch);
    }
    groups.sort();
    return {
      kind: "THIRD_PLACE",
      candidateGroups: groups,
      label: `Peringkat 3 (Grup ${groups.join("/")})`,
    };
  }

  const win = WINNER_PATTERN.exec(code);
  if (win !== null) {
    const matchId = matchIdOf(Number(win[1]));
    return { kind: "MATCH_WINNER", matchId, label: `Pemenang ${matchId}` };
  }

  const lose = LOSER_PATTERN.exec(code);
  if (lose !== null) {
    const matchId = matchIdOf(Number(lose[1]));
    return { kind: "MATCH_LOSER", matchId, label: `Pecundang ${matchId}` };
  }

  return null;
}

/** Kebalikan parseSlotCode: kode kanonik sebuah asal slot (untuk perbandingan). */
function codeOfSource(source: BracketSlotSource): string {
  switch (source.kind) {
    case "GROUP_POSITION":
      return `${source.position}${source.groupLetter}`;
    case "THIRD_PLACE":
      return `3rd-${[...source.candidateGroups].sort().join("")}`;
    case "MATCH_WINNER": {
      const n = matchNumberOf(source.matchId);
      return `W-M${n === null ? source.matchId : pad3(n)}`;
    }
    case "MATCH_LOSER": {
      const n = matchNumberOf(source.matchId);
      return `L-M${n === null ? source.matchId : pad3(n)}`;
    }
  }
}

// ---------------------------------------------------------------------
// Struktur kerja internal
// ---------------------------------------------------------------------

type Side = "home" | "away";

interface Slot {
  source: BracketSlotSource;
  /** Id tim asli dari matches.json, atau null bila slot berisi placeholder. */
  official: string | null;
  /** Peserta akhir: data resmi diutamakan, lalu hasil hitungan. */
  team: string | null;
}

interface WorkNode {
  num: number;
  stage: KnockoutStage;
  match: Match;
  home: Slot;
  away: Slot;
  winner: string | null;
  loser: string | null;
  warnings: string[];
}

function slotOf(node: WorkNode, side: Side): Slot {
  return side === "home" ? node.home : node.away;
}

/** Membuat slot dari kode pada Match; mencatat peringatan bila perlu. */
function makeSlot(
  code: string,
  side: Side,
  num: number,
  warnings: string[],
): Slot {
  const templatePair = KNOCKOUT_SCHEDULE[num];
  const templateCode =
    templatePair === undefined
      ? null
      : side === "home"
        ? templatePair[0]
        : templatePair[1];
  const matchId = matchIdOf(num);
  const sideLabel = side === "home" ? "tuan rumah" : "tamu";

  const parsed = parseSlotCode(code);
  if (parsed !== null) {
    if (templateCode !== null && templateCode !== codeOfSource(parsed)) {
      warnings.push(
        `${matchId}: placeholder slot ${sideLabel} "${code}" berbeda dari susunan resmi tersimpan "${templateCode}"; placeholder pada data dipakai.`,
      );
    }
    return { source: parsed, official: null, team: null };
  }

  const fallback =
    templateCode === null ? null : parseSlotCode(templateCode);
  if (fallback === null) {
    // Nomor laga di luar 73..104 tidak sampai ke sini (disaring lebih awal).
    throw new Error(`Tidak ada asal slot untuk ${matchId}`);
  }

  if (TEAM_ID_PATTERN.test(code)) {
    return { source: fallback, official: code, team: code };
  }

  warnings.push(
    `${matchId}: kode slot ${sideLabel} "${code}" tidak dikenali (bukan id tim maupun placeholder); asal slot diambil dari susunan resmi tersimpan.`,
  );
  return { source: fallback, official: null, team: null };
}

// ---------------------------------------------------------------------
// Kelengkapan grup dan penempatan peringkat ketiga
// ---------------------------------------------------------------------

/** Grup tuntas bila seluruh 6 laga fasenya ada dan selesai. */
function completedGroups(matches: readonly Match[]): Set<GroupLetter> {
  const result = new Set<GroupLetter>();
  for (const letter of GROUP_LETTERS) {
    const groupMatches = matches.filter(
      (m) => m.stage === "GROUP_STAGE" && m.groupLetter === letter,
    );
    if (
      groupMatches.length >= GROUP_MATCH_COUNT &&
      groupMatches.every((m) => m.isFinished === true)
    ) {
      result.add(letter);
    }
  }
  return result;
}

interface ThirdSlotRef {
  num: number;
  side: Side;
  candidates: readonly GroupLetter[];
}

/**
 * Pencocokan berbatasan: tiap grup pada `groups` ke tepat satu slot pada
 * `slots` yang mencantumkan grup itu. Slot diurut menurut urutan input
 * (nomor laga naik); grup dicoba menurut huruf naik. Penyelesaian pertama
 * yang ditemukan dikembalikan, sehingga hasilnya deterministik.
 */
function matchThirdsToSlots(
  groups: readonly GroupLetter[],
  slots: readonly ThirdSlotRef[],
): Map<number, GroupLetter> | null {
  const ordered = [...groups].sort();
  const assigned = new Map<number, GroupLetter>();
  const used = new Set<GroupLetter>();

  const slotKey = (slot: ThirdSlotRef): number =>
    slot.num * 2 + (slot.side === "home" ? 0 : 1);

  const place = (index: number): boolean => {
    if (index === slots.length) return used.size === ordered.length;
    const slot = slots[index];
    for (const letter of ordered) {
      if (used.has(letter) || !slot.candidates.includes(letter)) continue;
      used.add(letter);
      assigned.set(slotKey(slot), letter);
      if (place(index + 1)) return true;
      used.delete(letter);
      assigned.delete(slotKey(slot));
    }
    return false;
  };

  return slots.length === ordered.length && place(0) ? assigned : null;
}

// ---------------------------------------------------------------------
// Pemenang
// ---------------------------------------------------------------------

/**
 * Menentukan pemenang laga selesai. Skor sudah termasuk perpanjangan waktu;
 * skor penalti HANYA dipakai bila skor imbang dan tidak mengubah statistik gol.
 */
function decideWinner(match: Match): "home" | "away" | null {
  if (match.homeScore > match.awayScore) return "home";
  if (match.awayScore > match.homeScore) return "away";
  const hp = match.homePenaltyScore;
  const ap = match.awayPenaltyScore;
  if (hp === undefined || ap === undefined || hp === ap) return null;
  return hp > ap ? "home" : "away";
}

// ---------------------------------------------------------------------
// buildBracket
// ---------------------------------------------------------------------

/**
 * Menyusun 32 node bagan fase gugur.
 *
 * @param matches    seluruh laga (grup dan fase gugur); tidak diubah.
 * @param standings  klasemen per grup yang sudah terurut (keluaran
 *                   calculateStandings; indeks 0 = juara); tidak diubah.
 * @param bestThirds tabel peringkat ketiga (keluaran calculateBestThirds);
 *                   hanya entri `qualified` yang dipakai.
 * @returns array baru terurut menurut stage lalu nomor laga. Slot yang belum
 *          pasti bernilai null. Laga dengan id di luar M-073..M-104 diabaikan
 *          (validateBracket melaporkan jumlah node yang tidak 32).
 */
export function buildBracket(
  matches: Match[],
  standings: Partial<Record<GroupLetter, GroupStanding[]>>,
  bestThirds: ThirdPlaceEntry[],
): BracketNode[] {
  // 1. Node kerja dari laga non-grup.
  const works = new Map<number, WorkNode>();
  for (const match of matches) {
    if (!isKnockoutStage(match.stage)) continue;
    const num = matchNumberOf(match.id);
    if (
      num === null ||
      num < FIRST_KNOCKOUT_NUMBER ||
      num > LAST_KNOCKOUT_NUMBER ||
      works.has(num)
    ) {
      continue;
    }
    const warnings: string[] = [];
    works.set(num, {
      num,
      stage: match.stage,
      match,
      home: makeSlot(match.homeTeamId, "home", num, warnings),
      away: makeSlot(match.awayTeamId, "away", num, warnings),
      winner: null,
      loser: null,
      warnings,
    });
  }

  const stageRank = (stage: KnockoutStage): number => STAGE_ORDER.indexOf(stage);
  const ordered = [...works.values()].sort(
    (a, b) => stageRank(a.stage) - stageRank(b.stage) || a.num - b.num,
  );

  // 2. Peserta dari hasil grup.
  const complete = completedGroups(matches);
  const allGroupsComplete = GROUP_LETTERS.every((g) => complete.has(g));

  const groupPositionTeam = (
    letter: GroupLetter,
    position: 1 | 2,
  ): string | null => {
    if (!complete.has(letter)) return null;
    return standings[letter]?.[position - 1]?.teamId ?? null;
  };

  const thirdTeamByNode = computeThirdPlacements(
    ordered,
    bestThirds,
    allGroupsComplete,
  );

  // 3. Propagasi babak demi babak.
  for (const stage of STAGE_ORDER) {
    for (const node of ordered) {
      if (node.stage !== stage) continue;
      for (const side of ["home", "away"] as const) {
        const slot = slotOf(node, side);
        const computed = computeSlotTeam(
          slot.source,
          works,
          groupPositionTeam,
          thirdTeamByNode.get(`${node.num}:${side}`) ?? null,
        );
        slot.team = slot.official ?? computed;

        if (
          slot.official !== null &&
          computed !== null &&
          computed !== slot.official &&
          slot.source.kind !== "THIRD_PLACE"
        ) {
          node.warnings.push(
            `${matchIdOf(node.num)}: data resmi memuat ${slot.official} pada slot "${slot.source.label}", sedangkan hasil hitungan ${computed}; data resmi dipertahankan.`,
          );
        }
      }
      resolveWinner(node);
    }
  }

  const thirdWarnings = thirdTeamByNode.warnings;
  for (const [num, list] of thirdWarnings) {
    works.get(num)?.warnings.push(...list);
  }

  // 4. Tautan antar-node.
  const nextOf = new Map<number, number>();
  const loserNextOf = new Map<number, number>();
  for (const node of ordered) {
    for (const side of ["home", "away"] as const) {
      const source = slotOf(node, side).source;
      if (source.kind !== "MATCH_WINNER" && source.kind !== "MATCH_LOSER") {
        continue;
      }
      const from = matchNumberOf(source.matchId);
      if (from === null || !works.has(from)) continue;
      const target = source.kind === "MATCH_WINNER" ? nextOf : loserNextOf;
      if (!target.has(from)) target.set(from, node.num);
    }
  }

  // 5. Keluaran.
  return ordered.map((node): BracketNode => {
    const out: BracketNode = {
      id: nodeIdOf(node.num),
      stage: node.stage,
      homeSource: node.home.source,
      awaySource: node.away.source,
      homeTeamId: node.home.team,
      awayTeamId: node.away.team,
    };
    if (node.home.team !== null && node.away.team !== null) {
      out.matchId = matchIdOf(node.num);
    }
    if (node.winner !== null) out.winnerTeamId = node.winner;
    const next = nextOf.get(node.num);
    if (next !== undefined) out.nextNodeId = nodeIdOf(next);
    const loserNext = loserNextOf.get(node.num);
    if (loserNext !== undefined && node.stage === "SEMI_FINALS") {
      out.loserNextNodeId = nodeIdOf(loserNext);
    }
    WARNINGS_BY_NODE.set(out, node.warnings);
    return out;
  });
}

/** Hasil penempatan peringkat ketiga: tim per "nomor:sisi" plus peringatan per laga. */
interface ThirdPlacements {
  get(key: string): string | undefined;
  warnings: Map<number, string[]>;
}

function computeThirdPlacements(
  ordered: readonly WorkNode[],
  bestThirds: readonly ThirdPlaceEntry[],
  allGroupsComplete: boolean,
): ThirdPlacements {
  const teams = new Map<string, string>();
  const warnings = new Map<number, string[]>();
  const warn = (num: number, text: string): void => {
    const list = warnings.get(num) ?? [];
    list.push(text);
    warnings.set(num, list);
  };
  const result: ThirdPlacements = {
    get: (key) => teams.get(key),
    warnings,
  };

  if (!allGroupsComplete) return result;

  const r32 = ordered.filter((n) => n.stage === "ROUND_OF_32");
  const slots: ThirdSlotRef[] = [];
  for (const node of r32) {
    for (const side of ["home", "away"] as const) {
      const source = slotOf(node, side).source;
      if (source.kind === "THIRD_PLACE") {
        slots.push({ num: node.num, side, candidates: source.candidateGroups });
      }
    }
  }
  if (slots.length === 0) return result;

  // Peringkat ketiga yang lolos (maksimal satu per grup).
  const qualifiedByGroup = new Map<GroupLetter, string>();
  for (const entry of bestThirds) {
    if (entry.qualified && !qualifiedByGroup.has(entry.groupLetter)) {
      qualifiedByGroup.set(entry.groupLetter, entry.teamId);
    }
  }
  if (qualifiedByGroup.size !== QUALIFIED_THIRD_COUNT) {
    for (const slot of slots) {
      if (slotOf(findNode(r32, slot.num), slot.side).official === null) {
        warn(
          slot.num,
          `${matchIdOf(slot.num)}: peringkat ketiga tidak dapat ditempatkan karena bestThirds memuat ${qualifiedByGroup.size} tim lolos, bukan ${QUALIFIED_THIRD_COUNT}.`,
        );
      }
    }
    return result;
  }

  const groupOfTeam = new Map<string, GroupLetter>();
  for (const [letter, teamId] of qualifiedByGroup) groupOfTeam.set(teamId, letter);

  // Hormati data resmi lebih dulu; periksa keabsahannya.
  const fixedGroups = new Set<GroupLetter>();
  const openSlots: ThirdSlotRef[] = [];
  for (const slot of slots) {
    const official = slotOf(findNode(r32, slot.num), slot.side).official;
    if (official === null) {
      openSlots.push(slot);
      continue;
    }
    const group = groupOfTeam.get(official);
    if (group === undefined) {
      warn(
        slot.num,
        `${matchIdOf(slot.num)}: data resmi memuat ${official} pada slot peringkat 3, tetapi tim itu bukan salah satu dari 8 peringkat ketiga terbaik; data resmi dipertahankan.`,
      );
    } else if (!slot.candidates.includes(group)) {
      warn(
        slot.num,
        `${matchIdOf(slot.num)}: data resmi memuat ${official} (peringkat 3 Grup ${group}) pada slot yang hanya mengizinkan Grup ${slot.candidates.join("/")}; data resmi dipertahankan.`,
      );
    } else if (fixedGroups.has(group)) {
      warn(
        slot.num,
        `${matchIdOf(slot.num)}: data resmi memuat peringkat 3 Grup ${group} pada lebih dari satu slot; data resmi dipertahankan.`,
      );
    } else {
      fixedGroups.add(group);
    }
  }

  if (openSlots.length === 0) return result;

  const remaining = [...qualifiedByGroup.keys()].filter(
    (g) => !fixedGroups.has(g),
  );
  const assignment = matchThirdsToSlots(remaining, openSlots);
  if (assignment === null) {
    for (const slot of openSlots) {
      warn(
        slot.num,
        `${matchIdOf(slot.num)}: tidak ditemukan penugasan valid untuk peringkat ketiga pada slot yang tersisa; slot dibiarkan kosong.`,
      );
    }
    return result;
  }

  for (const slot of openSlots) {
    const letter = assignment.get(slot.num * 2 + (slot.side === "home" ? 0 : 1));
    const teamId = letter === undefined ? undefined : qualifiedByGroup.get(letter);
    if (teamId !== undefined) teams.set(`${slot.num}:${slot.side}`, teamId);
  }
  return result;
}

/** Mencari WorkNode menurut nomor laga. */
function findNode(nodes: readonly WorkNode[], num: number): WorkNode {
  const found = nodes.find((n) => n.num === num);
  if (found === undefined) throw new Error(`Node ${num} tidak ditemukan`);
  return found;
}

/** Peserta hasil hitungan untuk sebuah slot; null bila belum pasti. */
function computeSlotTeam(
  source: BracketSlotSource,
  nodes: ReadonlyMap<number, WorkNode>,
  groupPositionTeam: (letter: GroupLetter, position: 1 | 2) => string | null,
  thirdTeam: string | null,
): string | null {
  switch (source.kind) {
    case "GROUP_POSITION":
      return groupPositionTeam(source.groupLetter, source.position);
    case "THIRD_PLACE":
      return thirdTeam;
    case "MATCH_WINNER": {
      const n = matchNumberOf(source.matchId);
      return n === null ? null : (nodes.get(n)?.winner ?? null);
    }
    case "MATCH_LOSER": {
      const n = matchNumberOf(source.matchId);
      return n === null ? null : (nodes.get(n)?.loser ?? null);
    }
  }
}

/** Mengisi winner/loser sebuah node bila laganya selesai dan datanya sahih. */
function resolveWinner(node: WorkNode): void {
  const { match } = node;
  if (!match.isFinished) return;
  const id = matchIdOf(node.num);

  if (node.home.official === null || node.away.official === null) {
    node.warnings.push(
      `${id}: laga berstatus selesai tetapi id tim belum pasti pada data (masih placeholder); pemenang tidak ditentukan.`,
    );
    return;
  }

  const side = decideWinner(match);
  if (side === null) {
    node.warnings.push(
      match.homeScore === match.awayScore &&
        match.homePenaltyScore === undefined
        ? `${id}: laga selesai seri ${match.homeScore}-${match.awayScore} tanpa data adu penalti; pemenang tidak dapat ditentukan.`
        : `${id}: laga selesai seri ${match.homeScore}-${match.awayScore} dengan skor penalti tidak sahih (kosong sebagian atau sama); pemenang tidak dapat ditentukan.`,
    );
    return;
  }

  node.winner = side === "home" ? node.home.official : node.away.official;
  node.loser = side === "home" ? node.away.official : node.home.official;
}

// ---------------------------------------------------------------------
// validateBracket
// ---------------------------------------------------------------------

function numberOfNode(node: BracketNode): number | null {
  const m = /^BN-(\d{3})$/.exec(node.id);
  return m === null ? null : Number(m[1]);
}

/**
 * Memeriksa struktur dan konsistensi bagan; mengembalikan daftar peringatan
 * (array kosong bila tidak ada masalah). Tidak melempar error dan tidak
 * memutasi node.
 *
 * Mencakup: jumlah dan keunikan node, stage terhadap nomor laga, jumlah node
 * per babak, kesesuaian asal slot dengan KNOCKOUT_SCHEDULE, kevalidan
 * nextNodeId/loserNextNodeId, siklus, pemenang yang bukan peserta, tim ganda
 * dalam satu babak, ketidakcocokan peserta dengan pemenang/pecundang sumber,
 * serta peringatan data yang dicatat buildBracket (data resmi berbeda dari
 * hitungan, seri tanpa penalti, penempatan peringkat ketiga bermasalah).
 */
export function validateBracket(nodes: BracketNode[]): string[] {
  const warnings: string[] = [];
  const add = (text: string): void => {
    if (!warnings.includes(text)) warnings.push(text);
  };

  if (nodes.length !== TOTAL_KNOCKOUT_NODES) {
    add(`Jumlah node ${nodes.length}, seharusnya ${TOTAL_KNOCKOUT_NODES}.`);
  }

  const byId = new Map<string, BracketNode>();
  for (const node of nodes) {
    if (byId.has(node.id)) add(`Id node ganda: ${node.id}.`);
    else byId.set(node.id, node);
  }

  // Per node: id, stage, asal slot, matchId, pemenang.
  const stageCount = new Map<KnockoutStage, number>();
  for (const node of nodes) {
    stageCount.set(node.stage, (stageCount.get(node.stage) ?? 0) + 1);
    const num = numberOfNode(node);
    if (num === null || num < FIRST_KNOCKOUT_NUMBER || num > LAST_KNOCKOUT_NUMBER) {
      add(`${node.id}: id node tidak sesuai pola BN-073 sampai BN-104.`);
      continue;
    }
    const expected = expectedStageOf(num);
    if (expected !== null && expected !== node.stage) {
      add(`${node.id}: stage ${node.stage} tidak sesuai nomor laga (seharusnya ${expected}).`);
    }
    const template = KNOCKOUT_SCHEDULE[num];
    if (template !== undefined) {
      if (codeOfSource(node.homeSource) !== template[0]) {
        add(`${node.id}: homeSource "${codeOfSource(node.homeSource)}" berbeda dari susunan resmi tersimpan "${template[0]}".`);
      }
      if (codeOfSource(node.awaySource) !== template[1]) {
        add(`${node.id}: awaySource "${codeOfSource(node.awaySource)}" berbeda dari susunan resmi tersimpan "${template[1]}".`);
      }
    }
    if (node.matchId !== undefined && node.matchId !== matchIdOf(num)) {
      add(`${node.id}: matchId ${node.matchId} tidak sesuai id node.`);
    }
    if (
      node.winnerTeamId !== undefined &&
      node.winnerTeamId !== node.homeTeamId &&
      node.winnerTeamId !== node.awayTeamId
    ) {
      add(`${node.id}: winnerTeamId ${node.winnerTeamId} bukan salah satu peserta node.`);
    }
  }

  for (const stage of STAGE_ORDER) {
    const count = stageCount.get(stage) ?? 0;
    if (count !== STAGE_COUNTS[stage]) {
      add(`Jumlah node ${stage} ${count}, seharusnya ${STAGE_COUNTS[stage]}.`);
    }
  }

  // Tautan.
  const incomingWinner = new Map<string, string[]>();
  for (const node of nodes) {
    const stageNext = NEXT_STAGE[node.stage];
    const expectsNext = stageNext !== undefined;

    if (expectsNext && node.nextNodeId === undefined) {
      add(`${node.id}: nextNodeId kosong padahal babak ${node.stage} harus berlanjut.`);
    }
    if (!expectsNext && node.nextNodeId !== undefined) {
      add(`${node.id}: nextNodeId tidak boleh ada pada babak ${node.stage}.`);
    }
    if (node.nextNodeId !== undefined) {
      const target = byId.get(node.nextNodeId);
      if (target === undefined) {
        add(`${node.id}: nextNodeId ${node.nextNodeId} tidak ada.`);
      } else {
        if (stageNext !== undefined && target.stage !== stageNext) {
          add(`${node.id}: nextNodeId ${target.id} berstage ${target.stage}, seharusnya ${stageNext}.`);
        }
        const myMatch = `M-${node.id.slice(3)}`;
        const refs = [target.homeSource, target.awaySource].filter(
          (s) => s.kind === "MATCH_WINNER" && s.matchId === myMatch,
        );
        if (refs.length === 0) {
          add(`${node.id}: ${target.id} tidak memuat sumber "Pemenang ${myMatch}".`);
        }
        const list = incomingWinner.get(target.id) ?? [];
        list.push(node.id);
        incomingWinner.set(target.id, list);
      }
    }

    if (node.loserNextNodeId !== undefined) {
      if (node.stage !== "SEMI_FINALS") {
        add(`${node.id}: loserNextNodeId hanya boleh ada pada SEMI_FINALS.`);
      }
      const target = byId.get(node.loserNextNodeId);
      if (target === undefined) {
        add(`${node.id}: loserNextNodeId ${node.loserNextNodeId} tidak ada.`);
      } else if (target.stage !== "THIRD_PLACE") {
        add(`${node.id}: loserNextNodeId ${target.id} bukan node THIRD_PLACE.`);
      }
    } else if (node.stage === "SEMI_FINALS") {
      add(`${node.id}: semi final tanpa loserNextNodeId.`);
    }
  }

  // Dua node tidak boleh memberi pemenang ke slot yang sama (satu node tujuan
  // hanya punya dua slot).
  for (const [targetId, sources] of incomingWinner) {
    if (sources.length > 2) {
      add(`${targetId}: menerima pemenang dari ${sources.length} node (${sources.join(", ")}), maksimal 2.`);
    }
  }

  // Siklus (DFS atas nextNodeId dan loserNextNodeId).
  const state = new Map<string, "visiting" | "done">();
  const visit = (id: string): boolean => {
    const mark = state.get(id);
    if (mark === "visiting") return true;
    if (mark === "done") return false;
    state.set(id, "visiting");
    const node = byId.get(id);
    let cyclic = false;
    if (node !== undefined) {
      for (const next of [node.nextNodeId, node.loserNextNodeId]) {
        if (next !== undefined && byId.has(next) && visit(next)) cyclic = true;
      }
    }
    state.set(id, "done");
    return cyclic;
  };
  for (const node of nodes) {
    if (visit(node.id)) {
      add("Terdeteksi siklus pada tautan nextNodeId/loserNextNodeId.");
      break;
    }
  }

  // Peserta harus cocok dengan pemenang/pecundang node sumber.
  for (const node of nodes) {
    for (const side of ["home", "away"] as const) {
      const source = side === "home" ? node.homeSource : node.awaySource;
      const team = side === "home" ? node.homeTeamId : node.awayTeamId;
      if (team === null || team === undefined) continue;
      if (source.kind !== "MATCH_WINNER" && source.kind !== "MATCH_LOSER") continue;
      const from = byId.get(`BN-${source.matchId.slice(2)}`);
      if (from === undefined) {
        add(`${node.id}: sumber ${source.matchId} tidak ada pada bagan.`);
        continue;
      }
      if (from.winnerTeamId === undefined) continue;
      const home = from.homeTeamId;
      const away = from.awayTeamId;
      const expected =
        source.kind === "MATCH_WINNER"
          ? from.winnerTeamId
          : from.winnerTeamId === home
            ? away
            : home;
      if (expected !== null && expected !== undefined && expected !== team) {
        add(`${node.id}: slot "${source.label}" berisi ${team}, tetapi hasil ${source.matchId} menghasilkan ${expected}; data resmi dipertahankan.`);
      }
    }
  }

  // Tim ganda dalam satu babak.
  for (const stage of STAGE_ORDER) {
    const seen = new Map<string, string>();
    for (const node of nodes) {
      if (node.stage !== stage) continue;
      for (const team of [node.homeTeamId, node.awayTeamId]) {
        if (team === null || team === undefined) continue;
        const first = seen.get(team);
        if (first !== undefined) {
          add(`${team} muncul lebih dari sekali pada ${stage} (${first} dan ${node.id}).`);
        } else {
          seen.set(team, node.id);
        }
      }
    }
  }

  // Peringatan yang dicatat saat build.
  for (const node of nodes) {
    for (const text of WARNINGS_BY_NODE.get(node) ?? []) add(text);
  }

  return warnings;
}
