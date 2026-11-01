import { describe, expect, it } from "vitest";
import type { Player } from "@/types";
import {
  buildPlayerRadarData,
  calculatePlayerRating,
  getCardPenalty,
  getTournamentMaxStats,
} from "@/utils/playerMetrics";

function makePlayer(position: Player["position"], stats: Partial<Player["stats"]> = {}): Player {
  return {
    id: "PL-AAA-01",
    teamId: "AAA",
    name: "Test",
    shortName: "Test",
    shirtNumber: 1,
    position,
    photoUrl: "/players/placeholder.svg",
    stats: { appearances: 0, minutesPlayed: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, ...stats },
  };
}

describe("getTournamentMaxStats", () => {
  it("mengambil maksimum tiap metrik dan nol untuk daftar kosong", () => {
    const max = getTournamentMaxStats([
      makePlayer("FW", { goals: 5, assists: 1, appearances: 3, minutesPlayed: 270, yellowCards: 1 }),
      makePlayer("MF", { goals: 2, assists: 4, appearances: 7, minutesPlayed: 600, redCards: 1 }),
    ]);
    expect(max).toEqual({ goals: 5, assists: 4, appearances: 7, minutesPlayed: 600, cardPenalty: 3 });
    expect(getTournamentMaxStats([])).toEqual({ goals: 0, assists: 0, appearances: 0, minutesPlayed: 0, cardPenalty: 0 });
  });
});

describe("buildPlayerRadarData", () => {
  it("memiliki lima sumbu berurutan dengan fullMark 100", () => {
    const data = buildPlayerRadarData(makePlayer("FW"), getTournamentMaxStats([]));
    expect(data.map((d) => d.metric)).toEqual(["Gol", "Assist", "Penampilan", "Menit", "Disiplin"]);
    expect(data.every((d) => d.fullMark === 100)).toBe(true);
  });

  it("maksimum 0 tidak menghasilkan NaN dan semua nilai 0 sampai 100", () => {
    const zeroMax = getTournamentMaxStats([]);
    const data = buildPlayerRadarData(makePlayer("FW", { goals: 3 }), zeroMax);
    for (const datum of data) {
      expect(Number.isNaN(datum.value)).toBe(false);
      expect(datum.value).toBeGreaterThanOrEqual(0);
      expect(datum.value).toBeLessThanOrEqual(100);
    }
    expect(data.slice(0, 4).map((d) => d.value)).toEqual([0, 0, 0, 0]);
  });

  it("menormalisasi terhadap maksimum turnamen dan Disiplin adalah kebalikan beban kartu", () => {
    const top = makePlayer("FW", { goals: 8, assists: 4, appearances: 7, minutesPlayed: 630, yellowCards: 2 });
    const half = makePlayer("MF", { goals: 4, assists: 2, appearances: 7, minutesPlayed: 315 });
    const max = getTournamentMaxStats([top, half]);
    expect(buildPlayerRadarData(top, max).map((d) => d.value)).toEqual([100, 100, 100, 100, 0]);
    expect(buildPlayerRadarData(half, max).map((d) => d.value)).toEqual([50, 50, 100, 50, 100]);
  });

  it("nilai tetap 0 sampai 100 walau stat melebihi maksimum, negatif, atau NaN", () => {
    const weird = makePlayer("FW", { goals: 99, assists: -4, minutesPlayed: Number.NaN, redCards: 50 });
    const data = buildPlayerRadarData(weird, getTournamentMaxStats([makePlayer("FW", { goals: 5, redCards: 1 })]));
    for (const datum of data) {
      expect(Number.isNaN(datum.value)).toBe(false);
      expect(datum.value).toBeGreaterThanOrEqual(0);
      expect(datum.value).toBeLessThanOrEqual(100);
    }
  });

  it("tidak memutasi masukan", () => {
    const player = makePlayer("FW", { goals: 2 });
    const snapshot = JSON.stringify(player);
    buildPlayerRadarData(player, getTournamentMaxStats([player]));
    expect(JSON.stringify(player)).toBe(snapshot);
  });
});

describe("getCardPenalty", () => {
  it("1 x kuning + 3 x merah (kartu literal)", () => {
    expect(getCardPenalty(makePlayer("DF", { yellowCards: 2, redCards: 1 }))).toBe(5);
  });
});

describe("calculatePlayerRating", () => {
  it("pemain tanpa statistik mendapat batas bawah 40", () => {
    expect(calculatePlayerRating(makePlayer("FW"))).toBe(40);
  });

  it("selalu di antara 40 dan 99", () => {
    expect(calculatePlayerRating(makePlayer("FW", { goals: 100, assists: 100, minutesPlayed: 9999 }))).toBe(99);
    expect(calculatePlayerRating(makePlayer("DF", { redCards: 50 }))).toBe(40);
  });

  it("gol lebih berbobot untuk FW daripada DF", () => {
    const fw = calculatePlayerRating(makePlayer("FW", { goals: 3 }));
    const df = calculatePlayerRating(makePlayer("DF", { goals: 3 }));
    expect(fw).toBe(55);
    expect(df).toBe(49);
    expect(fw).toBeGreaterThan(df);
  });

  it("menghitung rumus: 40 + 5 x 2 gol + 3.5 x 1 assist + 1 x (180 / 90) - 1 kuning = 54.5 dibulatkan 55", () => {
    expect(
      calculatePlayerRating(makePlayer("FW", { goals: 2, assists: 1, minutesPlayed: 180, yellowCards: 1 })),
    ).toBe(55);
  });
});
