import { describe, expect, it } from "vitest";
import type { GroupLetter, Match, MatchEvent, Team } from "@/types";
import {
  calculateStandings,
  getFairPlayPoints,
} from "@/utils/calculateStandings";

// ---------------------------------------------------------------------
// Fixture deterministik
// ---------------------------------------------------------------------

function makeTeam(id: string, name: string, groupLetter: GroupLetter = "A"): Team {
  return {
    id,
    name,
    code: id,
    flagUrl: `/flags/${id.toLowerCase()}.svg`,
    groupLetter,
    confederation: "UEFA",
  };
}

// Nama sengaja berbeda urutan dari kode agar alfabetis (nama) teruji.
const ALP = makeTeam("ALP", "Alpha");
const BRA = makeTeam("BRA", "Bravo");
const CHA = makeTeam("CHA", "Charlie");
const DEL = makeTeam("DEL", "Delta");
const TEAMS: Team[] = [DEL, CHA, BRA, ALP]; // urutan input sengaja diacak

let counter = 0;

function makeMatch(
  home: Team,
  away: Team,
  homeScore: number,
  awayScore: number,
  overrides: Partial<Match> = {},
): Match {
  counter += 1;
  return {
    id: `M-${String(counter).padStart(3, "0")}`,
    stage: "GROUP_STAGE",
    groupLetter: "A",
    matchday: 1,
    kickoffTime: "2026-06-11T19:00:00Z",
    venue: "Stadion Uji",
    homeTeamId: home.id,
    awayTeamId: away.id,
    homeScore,
    awayScore,
    isFinished: true,
    events: [],
    ...overrides,
  };
}

let eventCounter = 0;

function ev(
  type: MatchEvent["type"],
  team: Team,
  playerNumber: number,
  minute = 30,
): MatchEvent {
  eventCounter += 1;
  return {
    id: `E-${String(eventCounter).padStart(4, "0")}`,
    minute,
    type,
    teamId: team.id,
    playerId: `PL-${team.id}-${String(playerNumber).padStart(2, "0")}`,
  };
}

function ids(rows: { teamId: string }[]): string[] {
  return rows.map((row) => row.teamId);
}

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null) {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

// ---------------------------------------------------------------------
// getFairPlayPoints
// ---------------------------------------------------------------------

describe("getFairPlayPoints", () => {
  it("kuning saja = -1 per kartu (pemain berbeda dijumlahkan)", () => {
    expect(getFairPlayPoints([ev("YELLOW_CARD", ALP, 4)])).toBe(-1);
    expect(
      getFairPlayPoints([ev("YELLOW_CARD", ALP, 4), ev("YELLOW_CARD", ALP, 5)]),
    ).toBe(-2);
  });

  it("dua kuning berujung merah = -3 (menggantikan dua kuning)", () => {
    expect(
      getFairPlayPoints([
        ev("YELLOW_CARD", ALP, 4, 20),
        ev("YELLOW_CARD", ALP, 4, 70),
        ev("RED_CARD", ALP, 4, 70),
      ]),
    ).toBe(-3);
  });

  it("merah langsung = -4", () => {
    expect(getFairPlayPoints([ev("RED_CARD", ALP, 4)])).toBe(-4);
  });

  it("satu kuning lalu merah langsung = -5", () => {
    expect(
      getFairPlayPoints([
        ev("YELLOW_CARD", ALP, 4, 20),
        ev("RED_CARD", ALP, 4, 80),
      ]),
    ).toBe(-5);
  });

  it("tanpa kartu = 0; event non-kartu diabaikan; filter teamId bekerja", () => {
    expect(getFairPlayPoints([])).toBe(0);
    expect(getFairPlayPoints([ev("GOAL", ALP, 9), ev("SUBSTITUTION", ALP, 12)])).toBe(0);

    const mixed = [ev("RED_CARD", ALP, 4), ev("YELLOW_CARD", BRA, 7)];
    expect(getFairPlayPoints(mixed)).toBe(-5);
    expect(getFairPlayPoints(mixed, "ALP")).toBe(-4);
    expect(getFairPlayPoints(mixed, "BRA")).toBe(-1);
  });
});

// ---------------------------------------------------------------------
// calculateStandings
// ---------------------------------------------------------------------

describe("calculateStandings", () => {
  it("kasus normal: urutan akhir jelas dan seluruh kolom benar", () => {
    const matches = [
      makeMatch(ALP, BRA, 2, 0),
      makeMatch(CHA, DEL, 1, 1),
      makeMatch(ALP, CHA, 1, 0),
      makeMatch(BRA, DEL, 0, 3),
      makeMatch(ALP, DEL, 0, 0),
      makeMatch(BRA, CHA, 2, 1),
    ];

    const table = calculateStandings(matches, TEAMS, "A");

    expect(ids(table)).toEqual(["ALP", "DEL", "BRA", "CHA"]);
    expect(table[0]).toEqual({
      teamId: "ALP",
      played: 3,
      won: 2,
      drawn: 1,
      lost: 0,
      goalsFor: 3,
      goalsAgainst: 0,
      goalDifference: 3,
      points: 7,
      fairPlayPoints: 0,
    });
    expect(table[1]).toMatchObject({ teamId: "DEL", points: 5, goalsFor: 4, goalsAgainst: 1 });
    expect(table[2]).toMatchObject({ teamId: "BRA", points: 3, won: 1, lost: 2, goalDifference: -4 });
    expect(table[3]).toMatchObject({ teamId: "CHA", points: 1, drawn: 1, lost: 2 });
    for (const row of table) {
      expect(row.won + row.drawn + row.lost).toBe(row.played);
    }
  });

  it("seri total: semua 1-1 jatuh ke fair play lalu alfabetis, stabil", () => {
    const build = (): Match[] => [
      // ALP dapat 1 kuning (-1); DEL dapat merah langsung (-4); BRA dan CHA bersih.
      makeMatch(ALP, BRA, 1, 1, { events: [ev("YELLOW_CARD", ALP, 3)] }),
      makeMatch(CHA, DEL, 1, 1, { events: [ev("RED_CARD", DEL, 6)] }),
      makeMatch(ALP, CHA, 1, 1),
      makeMatch(BRA, DEL, 1, 1),
      makeMatch(ALP, DEL, 1, 1),
      makeMatch(BRA, CHA, 1, 1),
    ];

    const first = calculateStandings(build(), TEAMS, "A");
    const second = calculateStandings(build(), TEAMS, "A");

    // Poin, GD, GF, dan H2H identik untuk keempat tim.
    for (const row of first) {
      expect(row).toMatchObject({ points: 3, goalDifference: 0, goalsFor: 3 });
    }
    // BRA dan CHA sama-sama 0 -> alfabetis; lalu ALP (-1); lalu DEL (-4).
    expect(ids(first)).toEqual(["BRA", "CHA", "ALP", "DEL"]);
    expect(second).toEqual(first);

    // Urutan input laga dan tim tidak memengaruhi hasil.
    const reversed = calculateStandings([...build()].reverse(), [...TEAMS].reverse(), "A");
    expect(ids(reversed)).toEqual(ids(first));
  });

  it("seri total tanpa kartu sama sekali: murni alfabetis nama tim", () => {
    const matches = [
      makeMatch(ALP, BRA, 1, 1),
      makeMatch(CHA, DEL, 1, 1),
      makeMatch(ALP, CHA, 1, 1),
      makeMatch(BRA, DEL, 1, 1),
      makeMatch(ALP, DEL, 1, 1),
      makeMatch(BRA, CHA, 1, 1),
    ];
    expect(ids(calculateStandings(matches, TEAMS, "A"))).toEqual(["ALP", "BRA", "CHA", "DEL"]);
  });

  it("H2H menentukan: dua tim identik pada poin, GD, GF; pemenang langsung unggul", () => {
    // BRA mengalahkan ALP, tetapi nama Alpha lebih awal secara alfabetis,
    // sehingga hanya H2H (bukan alfabetis) yang bisa menempatkan BRA di atas.
    const matches = [
      makeMatch(BRA, ALP, 1, 0),
      makeMatch(BRA, CHA, 0, 1),
      makeMatch(ALP, CHA, 1, 0),
      makeMatch(BRA, DEL, 0, 0),
      makeMatch(ALP, DEL, 0, 0),
      makeMatch(CHA, DEL, 3, 0),
    ];

    const table = calculateStandings(matches, TEAMS, "A");
    const alp = table.find((r) => r.teamId === "ALP");
    const bra = table.find((r) => r.teamId === "BRA");

    expect(alp).toMatchObject({ points: 4, goalDifference: 0, goalsFor: 1 });
    expect(bra).toMatchObject({ points: 4, goalDifference: 0, goalsFor: 1 });
    expect(ids(table)).toEqual(["CHA", "BRA", "ALP", "DEL"]);
  });

  it("fair play menentukan ketika H2H seri; tim dengan nilai lebih dekat ke nol unggul", () => {
    const matches = [
      // ALP dan BRA seri, ALP menerima 1 kuning; BRA bersih.
      makeMatch(ALP, BRA, 1, 1, { events: [ev("YELLOW_CARD", ALP, 2)] }),
      makeMatch(ALP, CHA, 1, 0),
      makeMatch(BRA, CHA, 1, 0),
      makeMatch(ALP, DEL, 1, 0),
      makeMatch(BRA, DEL, 1, 0),
      makeMatch(DEL, CHA, 1, 0),
    ];

    const table = calculateStandings(matches, TEAMS, "A");

    expect(table[0]).toMatchObject({ teamId: "BRA", fairPlayPoints: 0, points: 7 });
    expect(table[1]).toMatchObject({ teamId: "ALP", fairPlayPoints: -1, points: 7 });
    expect(ids(table)).toEqual(["BRA", "ALP", "DEL", "CHA"]);
  });

  it("gol bunuh diri tidak dihitung dua kali (GF hanya dari skor)", () => {
    // Skor 2-1: ALP mencetak 1 gol sendiri + 1 gol bunuh diri BRA. BRA 1 gol.
    // Bila events ikut dihitung, GF ALP akan menjadi 3 atau 4.
    const events: MatchEvent[] = [
      ev("GOAL", ALP, 9, 10),
      ev("OWN_GOAL", BRA, 5, 40),
      ev("GOAL", BRA, 11, 77),
    ];
    const table = calculateStandings(
      [makeMatch(ALP, BRA, 2, 1, { events })],
      TEAMS,
      "A",
    );

    const alp = table.find((r) => r.teamId === "ALP");
    const bra = table.find((r) => r.teamId === "BRA");
    expect(alp).toMatchObject({ goalsFor: 2, goalsAgainst: 1, goalDifference: 1 });
    expect(bra).toMatchObject({ goalsFor: 1, goalsAgainst: 2, goalDifference: -1 });
  });

  it("gol bunuh diri tunggal masuk GF tim lawan, bukan tim pembuatnya", () => {
    const events: MatchEvent[] = [ev("OWN_GOAL", BRA, 5, 40)];
    const table = calculateStandings(
      [makeMatch(ALP, BRA, 1, 0, { events })],
      TEAMS,
      "A",
    );
    expect(table.find((r) => r.teamId === "ALP")).toMatchObject({ goalsFor: 1, goalsAgainst: 0 });
    expect(table.find((r) => r.teamId === "BRA")).toMatchObject({ goalsFor: 0, goalsAgainst: 1 });
  });

  it("skor adu penalti tidak pernah dihitung", () => {
    const table = calculateStandings(
      [makeMatch(ALP, BRA, 1, 1, { homePenaltyScore: 5, awayPenaltyScore: 4 })],
      TEAMS,
      "A",
    );
    expect(table.find((r) => r.teamId === "ALP")).toMatchObject({ drawn: 1, points: 1, goalsFor: 1 });
    expect(table.find((r) => r.teamId === "BRA")).toMatchObject({ drawn: 1, points: 1, goalsFor: 1 });
  });

  it("laga belum selesai, fase gugur, dan grup lain diabaikan tanpa error", () => {
    const other = [makeTeam("ZZA", "Zeta", "B"), makeTeam("ZZB", "Zulu", "B")];
    const matches = [
      makeMatch(ALP, BRA, 5, 0, { isFinished: false }),
      makeMatch(ALP, BRA, 4, 0, { stage: "ROUND_OF_32", groupLetter: undefined, matchday: undefined }),
      makeMatch(other[0], other[1], 3, 0, { groupLetter: "B" }),
      makeMatch(CHA, DEL, 2, 1),
    ];

    const table = calculateStandings(matches, [...TEAMS, ...other], "A");

    expect(table).toHaveLength(4);
    expect(table.find((r) => r.teamId === "ALP")).toMatchObject({ played: 0, points: 0, goalsFor: 0 });
    expect(table.find((r) => r.teamId === "CHA")).toMatchObject({ played: 1, points: 3, goalsFor: 2 });
    expect(table.find((r) => r.teamId === "ZZA")).toBeUndefined();
  });

  it("grup tanpa laga selesai: 4 tim bernilai 0 dalam urutan alfabetis", () => {
    const table = calculateStandings([], TEAMS, "A");

    expect(ids(table)).toEqual(["ALP", "BRA", "CHA", "DEL"]);
    for (const row of table) {
      expect(row).toMatchObject({
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        fairPlayPoints: 0,
      });
    }
  });

  it("input tidak dimutasi (deep freeze + snapshot)", () => {
    const matches = [
      makeMatch(ALP, BRA, 2, 0, { events: [ev("YELLOW_CARD", BRA, 3)] }),
      makeMatch(CHA, DEL, 1, 1),
      makeMatch(ALP, CHA, 1, 1),
    ];
    const teams = [...TEAMS];
    const before = JSON.stringify({ matches, teams });

    deepFreeze(matches);
    deepFreeze(teams);

    expect(() => calculateStandings(matches, teams, "A")).not.toThrow();
    expect(JSON.stringify({ matches, teams })).toBe(before);
  });
});
