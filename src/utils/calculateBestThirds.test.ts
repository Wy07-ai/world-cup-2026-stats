import { describe, expect, it } from "vitest";
import type { GroupLetter, GroupStanding } from "@/types";
import {
  BEST_THIRD_QUALIFY_COUNT,
  calculateBestThirds,
  isQualifiedThird,
} from "@/utils/calculateBestThirds";

// ---------------------------------------------------------------------
// Fixture deterministik
// ---------------------------------------------------------------------

const LETTERS: GroupLetter[] = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
];

interface Spec {
  played?: number;
  points: number;
  gf: number;
  ga: number;
  fairPlay?: number;
}

function row(teamId: string, spec: Spec): GroupStanding {
  const played = spec.played ?? 3;
  return {
    teamId,
    played,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: spec.gf,
    goalsAgainst: spec.ga,
    goalDifference: spec.gf - spec.ga,
    points: spec.points,
    fairPlayPoints: spec.fairPlay ?? 0,
  };
}

/** Grup 4 tim terurut; hanya peringkat ketiga (indeks 2) yang dikendalikan. */
function makeGroup(letter: GroupLetter, third: Spec): GroupStanding[] {
  const played = third.played ?? 3;
  return [
    row(`${letter}1`, { played, points: 9, gf: 6, ga: 0 }),
    row(`${letter}2`, { played, points: 6, gf: 4, ga: 2 }),
    row(`${letter}3`, third),
    row(`${letter}4`, { played, points: 0, gf: 0, ga: 6 }),
  ];
}

function build(
  specs: Partial<Record<GroupLetter, Spec>>,
): Partial<Record<GroupLetter, GroupStanding[]>> {
  const result: Partial<Record<GroupLetter, GroupStanding[]>> = {};
  for (const letter of LETTERS) {
    const spec = specs[letter];
    if (spec !== undefined) result[letter] = makeGroup(letter, spec);
  }
  return result;
}

/** 12 peringkat ketiga beragam; semua selesai. */
const DIVERSE: Record<GroupLetter, Spec> = {
  A: { points: 4, gf: 4, ga: 3 },
  B: { points: 3, gf: 3, ga: 3 },
  C: { points: 6, gf: 5, ga: 4 },
  D: { points: 1, gf: 1, ga: 4 },
  E: { points: 4, gf: 5, ga: 3 },
  F: { points: 3, gf: 2, ga: 4 },
  G: { points: 4, gf: 4, ga: 3, fairPlay: -2 },
  H: { points: 2, gf: 2, ga: 3 },
  I: { points: 3, gf: 4, ga: 4 },
  J: { points: 0, gf: 0, ga: 5 },
  K: { points: 3, gf: 3, ga: 2 },
  L: { points: 2, gf: 3, ga: 3 },
};

// ---------------------------------------------------------------------
// Tes
// ---------------------------------------------------------------------

describe("BEST_THIRD_QUALIFY_COUNT", () => {
  it("bernilai 8", () => {
    expect(BEST_THIRD_QUALIFY_COUNT).toBe(8);
  });
});

describe("calculateBestThirds: 12 grup beragam", () => {
  const entries = calculateBestThirds(build(DIVERSE));

  it("menghasilkan 12 entri dengan tepat 8 qualified dan 4 tidak", () => {
    expect(entries).toHaveLength(12);
    expect(entries.filter((e) => e.qualified)).toHaveLength(8);
    expect(entries.filter((e) => !e.qualified)).toHaveLength(4);
  });

  it("rank 1 sampai 12 berurutan tanpa celah; qualified tepat untuk rank 1-8", () => {
    expect(entries.map((e) => e.rank)).toEqual(
      Array.from({ length: 12 }, (_, i) => i + 1),
    );
    for (const e of entries) expect(e.qualified).toBe(e.rank <= 8);
  });

  it("urutan mengikuti poin, GD, GF, fair play, lalu huruf grup", () => {
    // C (6 poin) paling atas. Tiga tim 4 poin: E (GD+2) di depan A dan G
    // (GD+1, GF sama); A di depan G karena fair play G lebih buruk.
    expect(entries.slice(0, 4).map((e) => e.groupLetter)).toEqual([
      "C",
      "E",
      "A",
      "G",
    ]);
    // Tim 3 poin: K (GD +1), lalu I (GD 0, GF 4) di depan B (GD 0, GF 3), lalu F (GD -2).
    expect(entries.slice(4, 8).map((e) => e.groupLetter)).toEqual([
      "K",
      "I",
      "B",
      "F",
    ]);
    expect(entries.slice(8).map((e) => e.groupLetter)).toEqual([
      "L",
      "H",
      "D",
      "J",
    ]);
  });

  it("membawa data GroupStanding peringkat ketiga dan groupLetter yang benar", () => {
    for (const e of entries) {
      expect(e.teamId).toBe(`${e.groupLetter}3`);
    }
    const c = entries[0];
    expect(c.points).toBe(6);
    expect(c.goalsFor).toBe(5);
  });

  it("seluruh isProvisional salah karena semua grup tuntas", () => {
    expect(entries.every((e) => e.isProvisional === false)).toBe(true);
  });
});

describe("calculateBestThirds: imbang total", () => {
  const tied: Spec = { points: 3, gf: 3, ga: 3, fairPlay: -2 };
  const all = build(
    Object.fromEntries(LETTERS.map((l) => [l, tied])) as Record<
      GroupLetter,
      Spec
    >,
  );

  it("jatuh ke urutan huruf grup A sampai L", () => {
    const entries = calculateBestThirds(all);
    expect(entries.map((e) => e.groupLetter)).toEqual(LETTERS);
    expect(entries.filter((e) => e.qualified).map((e) => e.groupLetter)).toEqual(
      LETTERS.slice(0, 8),
    );
  });

  it("stabil: urutan sama walau kunci input disusun terbalik", () => {
    const forward = calculateBestThirds(all);
    const reversed: Partial<Record<GroupLetter, GroupStanding[]>> = {};
    for (const letter of [...LETTERS].reverse()) reversed[letter] = all[letter];
    expect(calculateBestThirds(reversed)).toEqual(forward);
    expect(calculateBestThirds(all)).toEqual(forward);
  });

  it("fair play lebih dekat ke nol mengalahkan huruf grup", () => {
    const withClean = build({
      ...Object.fromEntries(LETTERS.map((l) => [l, tied])),
      L: { ...tied, fairPlay: 0 },
    } as Record<GroupLetter, Spec>);
    const entries = calculateBestThirds(withClean);
    expect(entries[0].groupLetter).toBe("L");
    expect(entries[1].groupLetter).toBe("A");
  });
});

describe("calculateBestThirds: kasus parsial", () => {
  it("hanya 5 grup tersedia: tidak error, hanya 5 entri, semua qualified (<= 8)", () => {
    const five = build({
      A: DIVERSE.A,
      B: DIVERSE.B,
      C: DIVERSE.C,
      D: DIVERSE.D,
      E: DIVERSE.E,
    });
    const entries = calculateBestThirds(five);
    expect(entries).toHaveLength(5);
    expect(entries.map((e) => e.rank)).toEqual([1, 2, 3, 4, 5]);
    expect(entries.every((e) => e.qualified)).toBe(true);
  });

  it("qualified maksimal 8 walau grup tersedia lebih banyak, mis. 10 grup", () => {
    const ten = build(
      Object.fromEntries(
        LETTERS.slice(0, 10).map((l) => [l, DIVERSE[l]]),
      ) as Record<GroupLetter, Spec>,
    );
    const entries = calculateBestThirds(ten);
    expect(entries).toHaveLength(10);
    expect(entries.filter((e) => e.qualified)).toHaveLength(8);
  });

  it("sebagian grup lengkap: isProvisional benar hanya untuk grup yang belum tuntas", () => {
    const mixed = build({
      A: DIVERSE.A,
      B: { ...DIVERSE.B, played: 2 },
      C: DIVERSE.C,
      D: { ...DIVERSE.D, played: 0 },
    });
    const entries = calculateBestThirds(mixed);
    const byGroup = new Map(entries.map((e) => [e.groupLetter, e]));
    expect(byGroup.get("A")?.isProvisional).toBe(false);
    expect(byGroup.get("B")?.isProvisional).toBe(true);
    expect(byGroup.get("C")?.isProvisional).toBe(false);
    expect(byGroup.get("D")?.isProvisional).toBe(true);
  });

  it("isProvisional benar bila tim lain (bukan peringkat ketiga) belum main 3 laga", () => {
    const group = makeGroup("A", { points: 3, gf: 2, ga: 2 });
    group[3] = row("A4", { played: 2, points: 0, gf: 0, ga: 3 });
    const entries = calculateBestThirds({ A: group });
    expect(entries[0].isProvisional).toBe(true);
  });

  it("seluruh grup belum main: semua isProvisional benar", () => {
    const fresh = build(
      Object.fromEntries(
        LETTERS.map((l) => [l, { played: 0, points: 0, gf: 0, ga: 0 }]),
      ) as Record<GroupLetter, Spec>,
    );
    const entries = calculateBestThirds(fresh);
    expect(entries).toHaveLength(12);
    expect(entries.every((e) => e.isProvisional)).toBe(true);
    expect(entries.map((e) => e.groupLetter)).toEqual(LETTERS);
  });

  it("grup dengan kurang dari 3 tim dilewati tanpa error", () => {
    const entries = calculateBestThirds({
      A: [row("A1", { points: 3, gf: 1, ga: 0 })],
      B: makeGroup("B", DIVERSE.B),
    });
    expect(entries).toHaveLength(1);
    expect(entries[0].groupLetter).toBe("B");
  });
});

describe("calculateBestThirds: kemurnian dan input kosong", () => {
  it("tidak memutasi input", () => {
    const input = build(DIVERSE);
    const snapshot = structuredClone(input);
    const entries = calculateBestThirds(input);
    expect(input).toEqual(snapshot);
    // Entri adalah objek baru, bukan referensi baris input.
    const original = input.C?.[2];
    expect(entries[0]).not.toBe(original);
    expect(original).not.toHaveProperty("rank");
  });

  it("objek kosong menghasilkan array kosong", () => {
    expect(calculateBestThirds({})).toEqual([]);
  });

  it("array kosong pada tiap grup menghasilkan array kosong", () => {
    expect(calculateBestThirds({ A: [], B: [] })).toEqual([]);
  });
});

describe("isQualifiedThird", () => {
  const entries = calculateBestThirds(build(DIVERSE));

  it("true untuk tim di 8 besar", () => {
    expect(isQualifiedThird("C3", entries)).toBe(true);
  });

  it("false untuk tim tersingkir", () => {
    expect(isQualifiedThird("J3", entries)).toBe(false);
  });

  it("false untuk tim yang tidak ada pada entries", () => {
    expect(isQualifiedThird("ZZZ", entries)).toBe(false);
    expect(isQualifiedThird("A3", [])).toBe(false);
  });
});
