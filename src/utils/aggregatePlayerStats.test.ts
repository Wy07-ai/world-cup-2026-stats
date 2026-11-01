import { describe, expect, it } from "vitest";
import type { Match, MatchEvent, Player } from "@/types";
import {
  aggregatePlayerStats,
  aggregatePlayerStatsDetailed,
  calculateMatchDuration,
  enrichPlayers,
  getTopScorers,
} from "@/utils/aggregatePlayerStats";

function makePlayer(id: string, overrides: Partial<Player> = {}): Player {
  return {
    id,
    teamId: "AAA",
    name: id,
    shortName: id,
    shirtNumber: 1,
    position: "FW",
    photoUrl: "/players/placeholder.svg",
    stats: { appearances: 0, minutesPlayed: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
    ...overrides,
  };
}

let eventCounter = 0;
function makeEvent(
  type: MatchEvent["type"],
  minute: number,
  playerId: string,
  extra: Partial<MatchEvent> = {},
): MatchEvent {
  eventCounter += 1;
  return {
    id: `E-${String(eventCounter).padStart(4, "0")}`,
    minute,
    type,
    teamId: "AAA",
    playerId,
    ...extra,
  };
}

function makeMatch(events: MatchEvent[], overrides: Partial<Match> = {}): Match {
  return {
    id: "M-001",
    stage: "GROUP_STAGE",
    groupLetter: "A",
    matchday: 1,
    kickoffTime: "2026-06-11T19:00:00Z",
    venue: "Test Stadium",
    homeTeamId: "AAA",
    awayTeamId: "BBB",
    homeScore: 0,
    awayScore: 0,
    isFinished: true,
    events,
    ...overrides,
  };
}

const p1 = makePlayer("P1");
const p2 = makePlayer("P2");
const p3 = makePlayer("P3");
const players = [p1, p2, p3];

function statsOf(playerId: string, matches: Match[], list: Player[] = players) {
  const found = aggregatePlayerStats(list, matches).find((s) => s.playerId === playerId);
  if (!found) throw new Error(`stats ${playerId} tidak ditemukan`);
  return found;
}

describe("calculateMatchDuration", () => {
  it("laga tanpa event berdurasi 90 menit", () => {
    expect(calculateMatchDuration(makeMatch([]))).toBe(90);
  });

  it("injury time 90+4 membuat durasi 94 menit (terbesar yang dipakai)", () => {
    const match = makeMatch([
      makeEvent("GOAL", 90, "P1", { extraMinute: 2 }),
      makeEvent("GOAL", 90, "P2", { extraMinute: 4 }),
    ]);
    expect(calculateMatchDuration(match)).toBe(94);
  });

  it("tambahan waktu babak pertama (45+5) tidak menambah durasi", () => {
    const match = makeMatch([makeEvent("GOAL", 45, "P1", { extraMinute: 5 })]);
    expect(calculateMatchDuration(match)).toBe(90);
  });

  it("laga dengan perpanjangan dibatasi 120, termasuk 120+5", () => {
    const match = makeMatch(
      [makeEvent("GOAL", 105, "P1"), makeEvent("GOAL", 120, "P2", { extraMinute: 5 })],
      { stage: "ROUND_OF_16", groupLetter: undefined, matchday: undefined },
    );
    expect(calculateMatchDuration(match)).toBe(120);
  });

  it("adu penalti menandakan perpanjangan sudah dimainkan (120) walau tanpa event", () => {
    const match = makeMatch([], {
      stage: "ROUND_OF_16",
      groupLetter: undefined,
      matchday: undefined,
      homePenaltyScore: 4,
      awayPenaltyScore: 3,
    });
    expect(calculateMatchDuration(match)).toBe(120);
  });
});

describe("aggregatePlayerStats: menit bermain", () => {
  it("pemain bermain penuh dengan event 90+4 berdurasi 94 menit", () => {
    const match = makeMatch([makeEvent("GOAL", 90, "P1", { extraMinute: 4 })]);
    const stats = statsOf("P1", [match]);
    expect(stats.minutesPlayed).toBe(94);
    expect(stats.appearances).toBe(1);
  });

  it("laga dengan perpanjangan membatasi menit di 120", () => {
    const match = makeMatch(
      [makeEvent("GOAL", 100, "P1"), makeEvent("GOAL", 120, "P1", { extraMinute: 5 })],
      { stage: "ROUND_OF_16", groupLetter: undefined, matchday: undefined },
    );
    expect(statsOf("P1", [match]).minutesPlayed).toBe(120);
  });

  it("pemain pengganti bermain dari menit masuk; yang digantikan dari 0 sampai keluar", () => {
    const match = makeMatch([
      makeEvent("SUBSTITUTION", 60, "P2", { relatedPlayerId: "P1" }),
    ]);
    expect(statsOf("P1", [match])).toMatchObject({ appearances: 1, minutesPlayed: 60 });
    expect(statsOf("P2", [match])).toMatchObject({ appearances: 1, minutesPlayed: 30 });
  });

  it("kartu merah menghentikan menit bermain", () => {
    const match = makeMatch([makeEvent("RED_CARD", 70, "P1")]);
    expect(statsOf("P1", [match]).minutesPlayed).toBe(70);
  });

  it("pemain yang tidak muncul di event tidak dianggap tampil (keterbatasan data lineup)", () => {
    const match = makeMatch([makeEvent("GOAL", 10, "P1")]);
    expect(statsOf("P3", [match])).toMatchObject({ appearances: 0, minutesPlayed: 0 });
  });

  it("penerima assist dianggap tampil", () => {
    const match = makeMatch([makeEvent("GOAL", 10, "P1", { relatedPlayerId: "P2" })]);
    expect(statsOf("P2", [match]).appearances).toBe(1);
  });
});

describe("aggregatePlayerStats: gol, assist, kartu", () => {
  it("gol bunuh diri tidak masuk gol pemain, tetapi pemainnya tetap tampil", () => {
    const match = makeMatch([makeEvent("OWN_GOAL", 30, "P1")]);
    const stats = statsOf("P1", [match]);
    expect(stats.goals).toBe(0);
    expect(stats.appearances).toBe(1);
  });

  it("gol penalti waktu normal dihitung sebagai gol dan tidak menghasilkan assist", () => {
    const match = makeMatch([
      makeEvent("PENALTY_GOAL", 55, "P1", { relatedPlayerId: "P2" }),
    ]);
    expect(statsOf("P1", [match]).goals).toBe(1);
    expect(statsOf("P2", [match]).assists).toBe(0);
  });

  it("GOAL dengan relatedPlayerId menambah assist", () => {
    const match = makeMatch([makeEvent("GOAL", 12, "P1", { relatedPlayerId: "P2" })]);
    expect(statsOf("P2", [match]).assists).toBe(1);
    expect(statsOf("P1", [match]).assists).toBe(0);
  });

  it("event bermenit di atas 120 diabaikan seluruhnya dan menghasilkan peringatan", () => {
    const ignored = makeEvent("GOAL", 121, "P1");
    const match = makeMatch([ignored, makeEvent("GOAL", 120, "P2")]);
    const result = aggregatePlayerStatsDetailed(players, [match]);
    const s1 = result.stats.find((s) => s.playerId === "P1");
    expect(s1).toMatchObject({ goals: 0, appearances: 0 });
    expect(result.stats.find((s) => s.playerId === "P2")?.goals).toBe(1);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toMatchObject({
      code: "EVENT_MINUTE_OUT_OF_RANGE",
      eventId: ignored.id,
    });
  });

  it("onWarning dipanggil untuk setiap peringatan", () => {
    const seen: string[] = [];
    aggregatePlayerStats(players, [makeMatch([makeEvent("GOAL", 150, "P1")])], {
      onWarning: (w) => seen.push(w.code),
    });
    expect(seen).toEqual(["EVENT_MINUTE_OUT_OF_RANGE"]);
  });

  it("kartu dihitung literal: dua kuning dan satu merah = yellowCards 2, redCards 1", () => {
    const match = makeMatch([
      makeEvent("YELLOW_CARD", 20, "P1"),
      makeEvent("YELLOW_CARD", 60, "P1"),
      makeEvent("RED_CARD", 60, "P1"),
    ]);
    const stats = statsOf("P1", [match]);
    expect(stats.yellowCards).toBe(2);
    expect(stats.redCards).toBe(1);
  });

  it("hanya laga isFinished yang dihitung", () => {
    const match = makeMatch([makeEvent("GOAL", 10, "P1")], { isFinished: false });
    expect(statsOf("P1", [match])).toMatchObject({ goals: 0, appearances: 0 });
  });

  it("pemain tak dikenal di event diabaikan dengan peringatan UNKNOWN_PLAYER", () => {
    const match = makeMatch([makeEvent("GOAL", 10, "ZZZ")]);
    const result = aggregatePlayerStatsDetailed(players, [match]);
    expect(result.warnings.map((w) => w.code)).toEqual(["UNKNOWN_PLAYER"]);
    expect(result.stats.every((s) => s.goals === 0)).toBe(true);
  });

  it("menjumlahkan beberapa laga dan mengembalikan satu entri per pemain berurutan", () => {
    const m1 = makeMatch([makeEvent("GOAL", 10, "P1")], { id: "M-001" });
    const m2 = makeMatch([makeEvent("GOAL", 20, "P1")], { id: "M-002" });
    const result = aggregatePlayerStats(players, [m1, m2]);
    expect(result.map((s) => s.playerId)).toEqual(["P1", "P2", "P3"]);
    expect(result[0]).toMatchObject({ goals: 2, appearances: 2, minutesPlayed: 180, teamId: "AAA" });
  });
});

describe("enrichPlayers", () => {
  it("mengembalikan salinan dengan stats terisi tanpa memutasi masukan", () => {
    const input = [makePlayer("P1"), makePlayer("P2")];
    const snapshot = JSON.parse(JSON.stringify(input)) as Player[];
    const match = makeMatch([makeEvent("GOAL", 10, "P1", { relatedPlayerId: "P2" })]);
    const enriched = enrichPlayers(input, [match]);

    expect(input).toEqual(snapshot);
    expect(enriched).not.toBe(input);
    expect(enriched[0]).not.toBe(input[0]);
    expect(enriched[0].stats).toMatchObject({ goals: 1, appearances: 1, minutesPlayed: 90 });
    expect(enriched[1].stats.assists).toBe(1);
  });
});

describe("getTopScorers", () => {
  function scorer(id: string, goals: number, assists: number, minutes: number, name = id): Player {
    return makePlayer(id, {
      name,
      stats: { appearances: 3, minutesPlayed: minutes, goals, assists, yellowCards: 0, redCards: 0 },
    });
  }

  it("tiga pemain bergol sama: urut assist terbanyak, lalu menit paling sedikit", () => {
    const a = scorer("A", 5, 1, 300);
    const b = scorer("B", 5, 3, 400);
    const c = scorer("C", 5, 1, 250);
    const result = getTopScorers([a, b, c], 3);
    expect(result.map((p) => p.id)).toEqual(["B", "C", "A"]);
  });

  it("nama alfabetis menjadi pemutus terakhir", () => {
    const x = scorer("X", 2, 0, 200, "Zed");
    const y = scorer("Y", 2, 0, 200, "Abe");
    expect(getTopScorers([x, y], 2).map((p) => p.name)).toEqual(["Abe", "Zed"]);
  });

  it("pemain bergol 0 tidak ikut; limit membatasi; limit tidak valid menghasilkan kosong", () => {
    const list = [scorer("A", 0, 5, 100), scorer("B", 2, 0, 100), scorer("C", 1, 0, 100)];
    expect(getTopScorers(list, 5).map((p) => p.id)).toEqual(["B", "C"]);
    expect(getTopScorers(list, 1).map((p) => p.id)).toEqual(["B"]);
    expect(getTopScorers(list, 0)).toEqual([]);
    expect(getTopScorers(list, Number.NaN)).toEqual([]);
  });

  it("tidak memutasi urutan masukan", () => {
    const list = [scorer("A", 1, 0, 100), scorer("B", 3, 0, 100)];
    getTopScorers(list, 2);
    expect(list.map((p) => p.id)).toEqual(["A", "B"]);
  });
});
