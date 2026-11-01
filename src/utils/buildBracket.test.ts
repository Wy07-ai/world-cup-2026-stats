import { describe, expect, it } from "vitest";
import matchesJson from "@/data/matches.json";
import teamsJson from "@/data/teams.json";
import type {
  BracketNode,
  GroupLetter,
  GroupStanding,
  Match,
  Team,
  ThirdPlaceEntry,
} from "@/types";
import { buildBracket, KNOCKOUT_SCHEDULE, validateBracket } from "@/utils/buildBracket";
import { calculateBestThirds } from "@/utils/calculateBestThirds";
import { calculateStandings } from "@/utils/calculateStandings";

// ---------------------------------------------------------------------
// Fixture deterministik
//
// Tim fixture: `T` + huruf grup + salah satu P/Q/R/S (peringkat 1..4 di
// grupnya), mis. "TAP" = juara Grup A, "TCR" = peringkat 3 Grup C.
// ---------------------------------------------------------------------

const LETTERS: readonly GroupLetter[] = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
];
const RANK_CODES = ["P", "Q", "R", "S"] as const;

const teamOf = (letter: GroupLetter, rank: 1 | 2 | 3 | 4): string =>
  `T${letter}${RANK_CODES[rank - 1]}`;

function standingRow(teamId: string, points: number): GroupStanding {
  return {
    teamId,
    played: 3,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: points,
    goalsAgainst: 0,
    goalDifference: points,
    points,
    fairPlayPoints: 0,
  };
}

/**
 * Klasemen 12 grup. Poin peringkat 3 menurun mengikuti `thirdOrder`: grup
 * pertama pada daftar menjadi peringkat ketiga terbaik, dst. Hanya 8 pertama
 * yang lolos.
 */
function makeStandings(
  thirdOrder: readonly GroupLetter[] = LETTERS,
): Partial<Record<GroupLetter, GroupStanding[]>> {
  const result: Partial<Record<GroupLetter, GroupStanding[]>> = {};
  for (const letter of LETTERS) {
    const thirdPoints = 12 - thirdOrder.indexOf(letter);
    result[letter] = [
      standingRow(teamOf(letter, 1), 99),
      standingRow(teamOf(letter, 2), 98),
      standingRow(teamOf(letter, 3), thirdPoints),
      standingRow(teamOf(letter, 4), 0),
    ];
  }
  return result;
}

const PAIRS: ReadonlyArray<readonly [1 | 2 | 3 | 4, 1 | 2 | 3 | 4]> = [
  [1, 2], [3, 4], [1, 3], [2, 4], [1, 4], [2, 3],
];

function groupMatchesOf(letter: GroupLetter, finished: boolean): Match[] {
  const base = LETTERS.indexOf(letter) * 6;
  return PAIRS.map(([h, a], i): Match => ({
    id: `M-${String(base + i + 1).padStart(3, "0")}`,
    stage: "GROUP_STAGE",
    groupLetter: letter,
    matchday: (Math.floor(i / 2) + 1) as 1 | 2 | 3,
    kickoffTime: "2026-06-11T19:00:00Z",
    venue: "Stadion Uji",
    homeTeamId: teamOf(letter, h),
    awayTeamId: teamOf(letter, a),
    homeScore: finished ? 1 : 0,
    awayScore: 0,
    isFinished: finished,
    events: [],
  }));
}

function stageOfNumber(n: number): Match["stage"] {
  if (n <= 88) return "ROUND_OF_32";
  if (n <= 96) return "ROUND_OF_16";
  if (n <= 100) return "QUARTER_FINALS";
  if (n <= 102) return "SEMI_FINALS";
  return n === 103 ? "THIRD_PLACE" : "FINAL";
}

/** 32 laga fase gugur berisi placeholder resmi, belum dimainkan. */
function placeholderKnockout(): Match[] {
  const result: Match[] = [];
  for (let n = 73; n <= 104; n += 1) {
    const pair = KNOCKOUT_SCHEDULE[n];
    result.push({
      id: `M-${String(n).padStart(3, "0")}`,
      stage: stageOfNumber(n),
      kickoffTime: "2026-06-28T19:00:00Z",
      venue: "Stadion Uji",
      homeTeamId: pair[0],
      awayTeamId: pair[1],
      homeScore: 0,
      awayScore: 0,
      isFinished: false,
      events: [],
    });
  }
  return result;
}

function groupStage(completeLetters: readonly GroupLetter[]): Match[] {
  return LETTERS.flatMap((l) => groupMatchesOf(l, completeLetters.includes(l)));
}

function thirdsOf(
  standings: Partial<Record<GroupLetter, GroupStanding[]>>,
): ThirdPlaceEntry[] {
  return calculateBestThirds(standings);
}

function nodeOf(nodes: readonly BracketNode[], num: number): BracketNode {
  const found = nodes.find((n) => n.id === `BN-${String(num).padStart(3, "0")}`);
  if (found === undefined) throw new Error(`node ${num} tidak ada`);
  return found;
}

/** Kunci pembeku agar mutasi input langsung gagal (modul ES = strict mode). */
function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

const ALL_COMPLETE_MATCHES = (): Match[] => [
  ...groupStage(LETTERS),
  ...placeholderKnockout(),
];

// ---------------------------------------------------------------------
// Bentuk dasar dan label
// ---------------------------------------------------------------------

describe("buildBracket: seluruh grup belum dimainkan", () => {
  const matches = [...groupStage([]), ...placeholderKnockout()];
  const standings = makeStandings();
  const nodes = buildBracket(matches, standings, thirdsOf(standings));

  it("menghasilkan 32 node terurut menurut stage lalu nomor laga", () => {
    expect(nodes).toHaveLength(32);
    expect(nodes.map((n) => n.id)).toEqual(
      Array.from({ length: 32 }, (_, i) => `BN-${String(73 + i).padStart(3, "0")}`),
    );
    expect(nodes[0].stage).toBe("ROUND_OF_32");
    expect(nodes[30].stage).toBe("THIRD_PLACE");
    expect(nodes[31].stage).toBe("FINAL");
  });

  it("semua slot berlabel, tanpa peserta, tanpa pemenang, tanpa matchId", () => {
    for (const node of nodes) {
      expect(node.homeSource.label.length).toBeGreaterThan(0);
      expect(node.awaySource.label.length).toBeGreaterThan(0);
      expect(node.homeTeamId).toBeNull();
      expect(node.awayTeamId).toBeNull();
      expect(node.winnerTeamId).toBeUndefined();
      expect(node.matchId).toBeUndefined();
    }
  });

  it("menurunkan asal dan label bahasa Indonesia dari kode placeholder", () => {
    expect(nodeOf(nodes, 73).homeSource).toEqual({
      kind: "GROUP_POSITION",
      groupLetter: "A",
      position: 2,
      label: "Runner-up Grup A",
    });
    expect(nodeOf(nodes, 76).homeSource).toEqual({
      kind: "GROUP_POSITION",
      groupLetter: "C",
      position: 1,
      label: "Juara Grup C",
    });
    expect(nodeOf(nodes, 74).awaySource).toEqual({
      kind: "THIRD_PLACE",
      candidateGroups: ["A", "B", "C", "D", "F"],
      label: "Peringkat 3 (Grup A/B/C/D/F)",
    });
    expect(nodeOf(nodes, 89).homeSource).toEqual({
      kind: "MATCH_WINNER",
      matchId: "M-074",
      label: "Pemenang M-074",
    });
    expect(nodeOf(nodes, 103).homeSource).toEqual({
      kind: "MATCH_LOSER",
      matchId: "M-101",
      label: "Pecundang M-101",
    });
  });

  it("menghubungkan node: pemenang ke babak berikut, pecundang semi ke perebutan ketiga", () => {
    expect(nodeOf(nodes, 74).nextNodeId).toBe("BN-089");
    expect(nodeOf(nodes, 77).nextNodeId).toBe("BN-089");
    expect(nodeOf(nodes, 89).nextNodeId).toBe("BN-097");
    expect(nodeOf(nodes, 97).nextNodeId).toBe("BN-101");
    expect(nodeOf(nodes, 101).nextNodeId).toBe("BN-104");
    expect(nodeOf(nodes, 101).loserNextNodeId).toBe("BN-103");
    expect(nodeOf(nodes, 102).loserNextNodeId).toBe("BN-103");
    expect(nodeOf(nodes, 103).nextNodeId).toBeUndefined();
    expect(nodeOf(nodes, 104).nextNodeId).toBeUndefined();
    expect(nodeOf(nodes, 89).loserNextNodeId).toBeUndefined();
  });

  it("tidak menghasilkan peringatan", () => {
    expect(validateBracket(nodes)).toEqual([]);
  });
});

// ---------------------------------------------------------------------
// Resolusi dari fase grup
// ---------------------------------------------------------------------

describe("buildBracket: resolusi peserta dari fase grup", () => {
  it("satu grup selesai: hanya slot 1X dan 2X grup itu yang terisi", () => {
    const matches = [...groupStage(["C"]), ...placeholderKnockout()];
    const standings = makeStandings();
    const nodes = buildBracket(matches, standings, thirdsOf(standings));

    const filled: string[] = [];
    for (const node of nodes) {
      if (node.homeTeamId !== null && node.homeTeamId !== undefined) {
        filled.push(`${node.id}:home:${node.homeTeamId}`);
      }
      if (node.awayTeamId !== null && node.awayTeamId !== undefined) {
        filled.push(`${node.id}:away:${node.awayTeamId}`);
      }
    }
    // Juara C = M-076 (tuan rumah), runner-up C = M-075 (tamu).
    expect(filled).toEqual(["BN-075:away:TCQ", "BN-076:home:TCP"]);
    expect(nodeOf(nodes, 76).awayTeamId).toBeNull();
    expect(nodeOf(nodes, 76).matchId).toBeUndefined();
  });

  it("grup belum tuntas (5 dari 6 laga) tidak mengisi slot meski klasemen tersedia", () => {
    const partial = groupMatchesOf("A", true);
    partial[5] = { ...partial[5], isFinished: false };
    const matches = [...partial, ...groupStage([]).slice(6), ...placeholderKnockout()];
    const standings = makeStandings();
    const nodes = buildBracket(matches, standings, thirdsOf(standings));
    expect(nodeOf(nodes, 79).homeTeamId).toBeNull();
    expect(nodeOf(nodes, 73).homeTeamId).toBeNull();
  });

  it("klasemen parsial (hanya satu grup) tidak menimbulkan error", () => {
    const matches = [...groupStage(["A"]), ...placeholderKnockout()];
    const standings: Partial<Record<GroupLetter, GroupStanding[]>> = {
      A: makeStandings().A,
    };
    const nodes = buildBracket(matches, standings, []);
    expect(nodeOf(nodes, 79).homeTeamId).toBe("TAP");
    expect(nodeOf(nodes, 73).homeTeamId).toBe("TAQ");
  });

  it("11 grup selesai: peringkat ketiga belum ditempatkan", () => {
    const matches = [
      ...groupStage(LETTERS.filter((l) => l !== "L")),
      ...placeholderKnockout(),
    ];
    const standings = makeStandings();
    const nodes = buildBracket(matches, standings, thirdsOf(standings));
    for (const num of [74, 77, 79, 80, 81, 82, 85, 87]) {
      expect(nodeOf(nodes, num).awayTeamId).toBeNull();
    }
    // Slot juara/runner-up grup yang tuntas tetap terisi.
    expect(nodeOf(nodes, 79).homeTeamId).toBe("TAP");
  });

  describe("fase grup selesai penuh", () => {
    const standings = makeStandings();
    const matches = ALL_COMPLETE_MATCHES();
    const nodes = buildBracket(matches, standings, thirdsOf(standings));
    const r32 = nodes.filter((n) => n.stage === "ROUND_OF_32");

    it("seluruh R32 terisi dan setiap node memuat matchId", () => {
      expect(r32).toHaveLength(16);
      for (const node of r32) {
        expect(node.homeTeamId).toEqual(expect.any(String));
        expect(node.awayTeamId).toEqual(expect.any(String));
        expect(node.matchId).toBe(`M-${node.id.slice(3)}`);
      }
    });

    it("8 peringkat ketiga menempati slot yang mengizinkan grupnya", () => {
      const thirdSlots = r32.filter((n) => n.awaySource.kind === "THIRD_PLACE");
      expect(thirdSlots).toHaveLength(8);
      const groups: string[] = [];
      for (const node of thirdSlots) {
        const source = node.awaySource;
        if (source.kind !== "THIRD_PLACE") throw new Error("bukan slot peringkat 3");
        const team = node.awayTeamId ?? "";
        // Format id fixture: T + grup + peringkat; peringkat 3 = "R".
        expect(team.endsWith("R")).toBe(true);
        const group = team[1] as GroupLetter;
        expect(source.candidateGroups).toContain(group);
        groups.push(group);
      }
      expect([...groups].sort()).toEqual(["A", "B", "C", "D", "E", "F", "G", "H"]);
    });

    it("tidak ada tim yang muncul dua kali pada R32 dan semua 32 tim berbeda", () => {
      const teams = r32.flatMap((n) => [n.homeTeamId, n.awayTeamId]);
      expect(new Set(teams).size).toBe(32);
      expect(teams.every((t) => typeof t === "string")).toBe(true);
    });

    it("juara dan runner-up sesuai klasemen", () => {
      expect(nodeOf(nodes, 73).homeTeamId).toBe("TAQ");
      expect(nodeOf(nodes, 73).awayTeamId).toBe("TBQ");
      expect(nodeOf(nodes, 74).homeTeamId).toBe("TEP");
      expect(nodeOf(nodes, 88).homeTeamId).toBe("TDQ");
      expect(nodeOf(nodes, 88).awayTeamId).toBe("TGQ");
    });

    it("peringkat berikutnya masih kosong dan tidak ada peringatan", () => {
      expect(nodeOf(nodes, 89).homeTeamId).toBeNull();
      expect(validateBracket(nodes)).toEqual([]);
    });
  });

  it("penugasan peringkat ketiga valid untuk SEMUA 495 kombinasi 8 dari 12 grup", () => {
    const combos: GroupLetter[][] = [];
    const pick = (start: number, acc: GroupLetter[]): void => {
      if (acc.length === 8) {
        combos.push([...acc]);
        return;
      }
      for (let i = start; i < LETTERS.length; i += 1) pick(i + 1, [...acc, LETTERS[i]]);
    };
    pick(0, []);
    expect(combos).toHaveLength(495);

    for (const combo of combos) {
      const rest = LETTERS.filter((l) => !combo.includes(l));
      const standings = makeStandings([...combo, ...rest]);
      const nodes = buildBracket(ALL_COMPLETE_MATCHES(), standings, thirdsOf(standings));
      const slots = nodes.filter((n) => n.awaySource.kind === "THIRD_PLACE");
      const placed = slots.map((n) => n.awayTeamId);
      expect(placed.every((t) => typeof t === "string")).toBe(true);
      expect(validateBracket(nodes)).toEqual([]);
      const groups = placed.map((t) => (t ?? "")[1]);
      expect([...groups].sort()).toEqual([...combo].sort());
    }
  });

  it("deterministik: dua pemanggilan menghasilkan keluaran identik", () => {
    const standings = makeStandings(["L", "K", "J", "I", "A", "B", "C", "D", "E", "F", "G", "H"]);
    const first = buildBracket(ALL_COMPLETE_MATCHES(), standings, thirdsOf(standings));
    const second = buildBracket(ALL_COMPLETE_MATCHES(), standings, thirdsOf(standings));
    expect(second).toEqual(first);
  });
});

// ---------------------------------------------------------------------
// Pemenang dan propagasi
// ---------------------------------------------------------------------

interface Result {
  home: number;
  away: number;
  pens?: readonly [number, number];
}

/**
 * Memainkan fase gugur sampai Final: setiap laga yang kedua pesertanya pasti
 * dijadikan selesai dengan id tim asli. Default: tuan rumah menang 1-0.
 */
function playOut(
  results: Readonly<Record<string, Result>>,
  upTo = 104,
): { matches: Match[]; nodes: BracketNode[] } {
  const standings = makeStandings();
  const thirds = thirdsOf(standings);
  let matches = ALL_COMPLETE_MATCHES();
  let nodes = buildBracket(matches, standings, thirds);

  for (let round = 0; round < 8; round += 1) {
    let changed = false;
    matches = matches.map((m): Match => {
      const num = Number(m.id.slice(2));
      if (m.stage === "GROUP_STAGE" || m.isFinished || num > upTo) return m;
      const node = nodeOf(nodes, num);
      if (node.homeTeamId == null || node.awayTeamId == null) return m;
      const res = results[m.id] ?? { home: 1, away: 0 };
      changed = true;
      return {
        ...m,
        homeTeamId: node.homeTeamId,
        awayTeamId: node.awayTeamId,
        homeScore: res.home,
        awayScore: res.away,
        ...(res.pens ? { homePenaltyScore: res.pens[0], awayPenaltyScore: res.pens[1] } : {}),
        isFinished: true,
      };
    });
    nodes = buildBracket(matches, standings, thirds);
    if (!changed) break;
  }
  return { matches, nodes };
}

describe("buildBracket: pemenang dan propagasi", () => {
  it("pemenang lewat adu penalti (skor seri; penalti hanya menentukan lolos)", () => {
    const { matches, nodes } = playOut(
      { "M-073": { home: 2, away: 2, pens: [3, 4] } },
      73,
    );
    const node = nodeOf(nodes, 73);
    expect(node.winnerTeamId).toBe("TBQ"); // tamu menang 4-3
    // Statistik gol tidak berubah: skor tetap 2-2 pada data laga.
    const played = matches.find((m) => m.id === "M-073");
    expect(played?.homeScore).toBe(2);
    expect(played?.awayScore).toBe(2);
    // Pemenang masuk slot yang bersumber W-M073 (M-090 tuan rumah... sisi home).
    expect(nodeOf(nodes, 90).homeTeamId).toBe("TBQ");
    expect(nodeOf(nodes, 90).awayTeamId).toBeNull();
  });

  it("pemenang lewat skor perpanjangan (skor sudah termasuk ET)", () => {
    const { nodes } = playOut({ "M-074": { home: 1, away: 2 } }, 74);
    const node = nodeOf(nodes, 74);
    expect(node.winnerTeamId).toBe(node.awayTeamId);
    expect(nodeOf(nodes, 89).homeTeamId).toBe(node.awayTeamId);
  });

  it("seri tanpa data penalti: pemenang kosong dan ada peringatan", () => {
    const { nodes } = playOut({ "M-073": { home: 1, away: 1 } }, 73);
    expect(nodeOf(nodes, 73).winnerTeamId).toBeUndefined();
    expect(nodeOf(nodes, 90).homeTeamId).toBeNull();
    expect(validateBracket(nodes).some((w) => w.includes("M-073") && w.includes("tanpa data adu penalti"))).toBe(true);
  });

  it("seri dengan skor penalti sama: pemenang kosong dan ada peringatan", () => {
    const { nodes } = playOut({ "M-073": { home: 1, away: 1, pens: [4, 4] } }, 73);
    expect(nodeOf(nodes, 73).winnerTeamId).toBeUndefined();
    expect(validateBracket(nodes).some((w) => w.includes("M-073") && w.includes("tidak sahih"))).toBe(true);
  });

  it("propagasi sampai Final; pecundang semi final masuk perebutan tempat ketiga", () => {
    const { nodes } = playOut({
      "M-097": { home: 2, away: 2, pens: [2, 4] }, // tamu menang lewat penalti
      "M-099": { home: 0, away: 1 },
    });

    const sf1 = nodeOf(nodes, 101);
    const sf2 = nodeOf(nodes, 102);
    const third = nodeOf(nodes, 103);
    const final = nodeOf(nodes, 104);

    expect(sf1.winnerTeamId).toBe(sf1.homeTeamId);
    expect(sf2.winnerTeamId).toBe(sf2.homeTeamId);

    const loser1 = sf1.winnerTeamId === sf1.homeTeamId ? sf1.awayTeamId : sf1.homeTeamId;
    const loser2 = sf2.winnerTeamId === sf2.homeTeamId ? sf2.awayTeamId : sf2.homeTeamId;
    expect(third.homeTeamId).toBe(loser1);
    expect(third.awayTeamId).toBe(loser2);
    expect(final.homeTeamId).toBe(sf1.winnerTeamId);
    expect(final.awayTeamId).toBe(sf2.winnerTeamId);
    expect(final.winnerTeamId).toBe(final.homeTeamId);
    expect(third.winnerTeamId).toBe(third.homeTeamId);

    // Pemenang M-097 lewat penalti = tamu M-097, dan dialah yang masuk SF1.
    const qf = nodeOf(nodes, 97);
    expect(qf.winnerTeamId).toBe(qf.awayTeamId);
    expect(sf1.homeTeamId).toBe(qf.awayTeamId);

    // Semua 32 node terisi penuh dan bagan konsisten.
    expect(nodes.every((n) => n.winnerTeamId !== undefined)).toBe(true);
    expect(validateBracket(nodes)).toEqual([]);
  });

  it("propagasi bertahap: setelah seluruh R32 selesai, R16 terisi dan QF masih kosong", () => {
    const { nodes } = playOut({}, 88);
    for (let n = 89; n <= 96; n += 1) {
      expect(nodeOf(nodes, n).homeTeamId).toEqual(expect.any(String));
      expect(nodeOf(nodes, n).awayTeamId).toEqual(expect.any(String));
    }
    expect(nodeOf(nodes, 97).homeTeamId).toBeNull();
  });
});

// ---------------------------------------------------------------------
// Prioritas data resmi dan peringatan
// ---------------------------------------------------------------------

describe("buildBracket: prioritas data resmi", () => {
  it("id tim asli dipertahankan walau berbeda dari hitungan, dengan peringatan", () => {
    const standings = makeStandings();
    const matches = ALL_COMPLETE_MATCHES().map((m): Match =>
      m.id === "M-076" ? { ...m, homeTeamId: "ZZZ" } : m,
    );
    const nodes = buildBracket(matches, standings, thirdsOf(standings));
    expect(nodeOf(nodes, 76).homeTeamId).toBe("ZZZ");
    const warnings = validateBracket(nodes);
    expect(warnings.some((w) => w.includes("M-076") && w.includes("ZZZ") && w.includes("TCP"))).toBe(true);
  });

  it("id tim asli sama dengan hitungan tidak menimbulkan peringatan", () => {
    const standings = makeStandings();
    const matches = ALL_COMPLETE_MATCHES().map((m): Match =>
      m.id === "M-076" ? { ...m, homeTeamId: "TCP" } : m,
    );
    const nodes = buildBracket(matches, standings, thirdsOf(standings));
    expect(validateBracket(nodes)).toEqual([]);
  });

  it("slot peringkat 3 resmi dihormati dan menjadi batasan bagi penugasan sisanya", () => {
    const standings = makeStandings();
    // Dari penugasan default, paksa M-074 memakai peringkat 3 Grup D (valid).
    const base = buildBracket(ALL_COMPLETE_MATCHES(), standings, thirdsOf(standings));
    const defaultTeam = nodeOf(base, 74).awayTeamId;
    expect(defaultTeam).not.toBe("TDR");

    const matches = ALL_COMPLETE_MATCHES().map((m): Match =>
      m.id === "M-074" ? { ...m, awayTeamId: "TDR" } : m,
    );
    const nodes = buildBracket(matches, standings, thirdsOf(standings));
    expect(nodeOf(nodes, 74).awayTeamId).toBe("TDR");
    const thirdTeams = nodes
      .filter((n) => n.awaySource.kind === "THIRD_PLACE")
      .map((n) => n.awayTeamId);
    expect(new Set(thirdTeams).size).toBe(8);
    expect(validateBracket(nodes)).toEqual([]);
  });

  it("slot peringkat 3 resmi yang melanggar daftar grup memicu peringatan", () => {
    const standings = makeStandings();
    const matches = ALL_COMPLETE_MATCHES().map((m): Match =>
      m.id === "M-074" ? { ...m, awayTeamId: "TGR" } : m, // Grup G tidak boleh di M-074
    );
    const nodes = buildBracket(matches, standings, thirdsOf(standings));
    expect(nodeOf(nodes, 74).awayTeamId).toBe("TGR");
    expect(validateBracket(nodes).some((w) => w.includes("M-074") && w.includes("Grup G"))).toBe(true);
  });

  it("peserta resmi yang tidak cocok dengan pemenang sumber dilaporkan", () => {
    const { matches } = playOut({}, 88);
    const tampered = matches.map((m): Match =>
      m.id === "M-089" ? { ...m, homeTeamId: "ZZZ", awayTeamId: "YYY" } : m,
    );
    const standings = makeStandings();
    const nodes = buildBracket(tampered, standings, thirdsOf(standings));
    expect(nodeOf(nodes, 89).homeTeamId).toBe("ZZZ");
    const warnings = validateBracket(nodes);
    expect(warnings.some((w) => w.includes("BN-089") && w.includes("ZZZ"))).toBe(true);
  });

  it("laga selesai tetapi masih memuat placeholder: tanpa pemenang, ada peringatan", () => {
    const standings = makeStandings();
    const matches = ALL_COMPLETE_MATCHES().map((m): Match =>
      m.id === "M-073" ? { ...m, isFinished: true, homeScore: 1 } : m,
    );
    const nodes = buildBracket(matches, standings, thirdsOf(standings));
    expect(nodeOf(nodes, 73).winnerTeamId).toBeUndefined();
    expect(validateBracket(nodes).some((w) => w.includes("M-073") && w.includes("placeholder"))).toBe(true);
  });

  it("slot dengan kode tak dikenal memakai susunan resmi dan melapor", () => {
    const standings = makeStandings();
    const matches = [...groupStage([]), ...placeholderKnockout()].map((m): Match =>
      m.id === "M-073" ? { ...m, homeTeamId: "pending" } : m,
    );
    const nodes = buildBracket(matches, standings, thirdsOf(standings));
    expect(nodeOf(nodes, 73).homeSource.label).toBe("Runner-up Grup A");
    expect(validateBracket(nodes).some((w) => w.includes("M-073") && w.includes("pending") && w.includes("tidak dikenali"))).toBe(true);
  });

  it("placeholder pada data yang menyimpang dari susunan resmi dipakai dan dilaporkan", () => {
    const standings = makeStandings();
    const matches = [...groupStage([]), ...placeholderKnockout()].map((m): Match =>
      m.id === "M-073" ? { ...m, homeTeamId: "1A", awayTeamId: "2B" } : m,
    );
    const nodes = buildBracket(matches, standings, thirdsOf(standings));
    expect(nodeOf(nodes, 73).homeSource.label).toBe("Juara Grup A");
    expect(validateBracket(nodes).some((w) => w.includes("M-073") && w.includes("1A"))).toBe(true);
  });
});

// ---------------------------------------------------------------------
// Murni dan integritas
// ---------------------------------------------------------------------

describe("buildBracket: kemurnian", () => {
  it("tidak memutasi input (input dibekukan dalam)", () => {
    const standings = deepFreeze(makeStandings());
    const thirds = deepFreeze(thirdsOf(standings));
    const matches = deepFreeze(ALL_COMPLETE_MATCHES());
    expect(() => buildBracket(matches, standings, thirds)).not.toThrow();
    const nodes = buildBracket(matches, standings, thirds);
    expect(nodes).toHaveLength(32);
  });

  it("keluaran tidak berbagi referensi array dengan input", () => {
    const matches = ALL_COMPLETE_MATCHES();
    const standings = makeStandings();
    const nodes = buildBracket(matches, standings, thirdsOf(standings));
    nodes.reverse();
    expect(matches[matches.length - 1].id).toBe("M-104");
  });
});

describe("validateBracket: integritas", () => {
  const standings = makeStandings();
  const good = (): BracketNode[] =>
    buildBracket(ALL_COMPLETE_MATCHES(), standings, thirdsOf(standings));

  it("tepat 32 node, id unik, nextNodeId valid kecuali Final dan perebutan ketiga", () => {
    const nodes = good();
    expect(nodes).toHaveLength(32);
    expect(new Set(nodes.map((n) => n.id)).size).toBe(32);
    const ids = new Set(nodes.map((n) => n.id));
    for (const node of nodes) {
      if (node.stage === "FINAL" || node.stage === "THIRD_PLACE") {
        expect(node.nextNodeId).toBeUndefined();
      } else {
        expect(node.nextNodeId).toBeDefined();
        expect(ids.has(node.nextNodeId ?? "")).toBe(true);
      }
    }
    expect(validateBracket(nodes)).toEqual([]);
  });

  it("tidak ada siklus: mengikuti nextNodeId selalu berakhir di Final", () => {
    const nodes = good();
    const byId = new Map(nodes.map((n) => [n.id, n]));
    for (const start of nodes) {
      let current: BracketNode | undefined = start;
      let steps = 0;
      while (current?.nextNodeId !== undefined && steps <= 32) {
        current = byId.get(current.nextNodeId);
        steps += 1;
      }
      expect(steps).toBeLessThanOrEqual(5);
      if (start.stage !== "THIRD_PLACE") expect(current?.id).toBe("BN-104");
    }
  });

  it("melaporkan jumlah node salah dan id ganda", () => {
    const nodes = good();
    const broken = [...nodes.slice(0, 31), { ...nodes[0] }];
    const warnings = validateBracket(broken);
    expect(warnings.some((w) => w.includes("Jumlah node 32") === false && w.includes("Id node ganda"))).toBe(true);
    expect(validateBracket(nodes.slice(0, 30)).some((w) => w.includes("Jumlah node 30"))).toBe(true);
  });

  it("melaporkan nextNodeId yang menggantung dan siklus", () => {
    const nodes = good();
    const dangling = nodes.map((n) => (n.id === "BN-073" ? { ...n, nextNodeId: "BN-999" } : n));
    expect(validateBracket(dangling).some((w) => w.includes("BN-073") && w.includes("BN-999"))).toBe(true);

    const cyclic = nodes.map((n) => (n.id === "BN-104" ? { ...n, nextNodeId: "BN-073" } : n));
    const warnings = validateBracket(cyclic);
    expect(warnings.some((w) => w.includes("siklus"))).toBe(true);
  });

  it("melaporkan nextNodeId kosong pada babak yang harus berlanjut", () => {
    const nodes = good().map((n) => {
      if (n.id !== "BN-090") return n;
      const copy: BracketNode = { ...n };
      delete copy.nextNodeId;
      return copy;
    });
    expect(validateBracket(nodes).some((w) => w.includes("BN-090") && w.includes("nextNodeId kosong"))).toBe(true);
  });

  it("melaporkan pemenang yang bukan peserta dan tim ganda dalam satu babak", () => {
    const nodes = good();
    const bad = nodes.map((n) => {
      if (n.id === "BN-073") return { ...n, winnerTeamId: "QQQ" };
      if (n.id === "BN-074") return { ...n, homeTeamId: nodes[0].homeTeamId };
      return n;
    });
    const warnings = validateBracket(bad);
    expect(warnings.some((w) => w.includes("BN-073") && w.includes("QQQ"))).toBe(true);
    expect(warnings.some((w) => w.includes("lebih dari sekali"))).toBe(true);
  });
});

// ---------------------------------------------------------------------
// Integrasi dengan data nyata proyek (src/data/matches.json)
// ---------------------------------------------------------------------

describe("buildBracket: data nyata matches.json", () => {
  const matches = matchesJson as unknown as Match[];
  const teams = teamsJson as unknown as Team[];
  const standings: Partial<Record<GroupLetter, GroupStanding[]>> = {};
  for (const letter of LETTERS) {
    standings[letter] = calculateStandings(matches, teams, letter);
  }
  const nodes = buildBracket(matches, standings, calculateBestThirds(standings));

  it("membangun 32 node tanpa satu pun peringatan (susunan resmi cocok dengan data)", () => {
    expect(nodes).toHaveLength(32);
    expect(validateBracket(nodes)).toEqual([]);
  });

  it("memakai id tim asli dan menurunkan pemenang sampai Final", () => {
    const final = nodeOf(nodes, 104);
    expect(final.homeTeamId).toBe("ESP");
    expect(final.awayTeamId).toBe("ARG");
    expect(final.winnerTeamId).toBe("ESP");
    expect(nodeOf(nodes, 103).winnerTeamId).toBe("ENG");
  });

  it("pemenang lewat adu penalti pada data nyata (M-074 Jerman-Paraguay 1-1, 3-4)", () => {
    const node = nodeOf(nodes, 74);
    expect(node.homeTeamId).toBe("GER");
    expect(node.awayTeamId).toBe("PAR");
    expect(node.winnerTeamId).toBe("PAR");
  });

  it("peringkat ketiga nyata semuanya berada di slot yang mengizinkan grupnya", () => {
    const groupOf = new Map(teams.map((t) => [t.id, t.groupLetter]));
    for (const node of nodes.filter((n) => n.awaySource.kind === "THIRD_PLACE")) {
      const source = node.awaySource;
      if (source.kind !== "THIRD_PLACE") continue;
      const group = groupOf.get(node.awayTeamId ?? "");
      expect(group).toBeDefined();
      expect(source.candidateGroups).toContain(group);
    }
  });
});
