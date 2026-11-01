import { describe, expect, it } from "vitest";
import type { Match } from "@/types";
import {
  formatKickoff,
  formatMinute,
  formatScore,
  getMatchStatus,
  truncateName,
} from "@/utils/formatters";

/** Pabrik fixture Match bertipe penuh; semua nilai tetap (deterministik). */
function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: "M-001",
    stage: "GROUP_STAGE",
    groupLetter: "A",
    matchday: 1,
    kickoffTime: "2026-06-11T19:00:00Z",
    venue: "Estadio Azteca, Mexico City",
    homeTeamId: "MEX",
    awayTeamId: "RSA",
    homeScore: 0,
    awayScore: 0,
    isFinished: false,
    events: [],
    ...overrides,
  };
}

const KICKOFF = "2026-06-11T19:00:00Z";

describe("formatKickoff", () => {
  it("default id-ID dan Asia/Jakarta: 11 Jun 19:00 UTC menjadi 12 Jun 02.00", () => {
    expect(formatKickoff(KICKOFF)).toBe("Jum, 12 Jun, 02.00");
  });

  it("menghasilkan dua zona waktu berbeda dari instan yang sama", () => {
    expect(formatKickoff(KICKOFF, "id-ID", "Asia/Jakarta")).toBe(
      "Jum, 12 Jun, 02.00",
    );
    expect(formatKickoff(KICKOFF, "id-ID", "America/New_York")).toBe(
      "Kam, 11 Jun, 15.00",
    );
  });

  it("mengikuti locale yang diminta", () => {
    expect(formatKickoff(KICKOFF, "en-US", "America/New_York")).toBe(
      "Thu, Jun 11, 15:00",
    );
  });

  it("tepi: tengah malam tampil 00.xx, bukan 24.xx", () => {
    expect(formatKickoff("2026-06-11T17:05:00Z", "id-ID", "Asia/Jakarta")).toBe(
      "Jum, 12 Jun, 00.05",
    );
  });

  it("tepi: pergantian tahun mengikuti zona waktu", () => {
    expect(formatKickoff("2026-12-31T20:00:00Z", "id-ID", "Asia/Jakarta")).toBe(
      "Jum, 1 Jan, 03.00",
    );
  });

  it("tepi: offset eksplisit dan milidetik diterima", () => {
    expect(
      formatKickoff("2026-06-12T02:00:00.000+07:00", "id-ID", "Asia/Jakarta"),
    ).toBe("Jum, 12 Jun, 02.00");
  });

  it("tidak valid: mengembalikan '-' tanpa melempar error", () => {
    const invalid: string[] = [
      "",
      "bukan tanggal",
      "2026-06-11", // tanpa jam dan zona
      "2026-06-11T19:00:00", // tanpa zona: bergantung zona sistem
      "2026-02-30T10:00:00Z", // tanggal tidak ada
      "2026-06-11T24:00:00Z", // jam 24 tidak diterima
      "2026-13-01T00:00:00Z", // bulan 13
    ];
    for (const value of invalid) {
      expect(() => formatKickoff(value)).not.toThrow();
      expect(formatKickoff(value)).toBe("-");
    }
  });

  it("tidak valid: nilai bukan string saat runtime tetap '-'", () => {
    expect(formatKickoff(undefined as unknown as string)).toBe("-");
    expect(formatKickoff(null as unknown as string)).toBe("-");
  });

  it("tidak valid: zona waktu atau locale tidak dikenali menjadi '-'", () => {
    expect(formatKickoff(KICKOFF, "id-ID", "Bukan/Zona")).toBe("-");
    expect(formatKickoff(KICKOFF, "xx-invalid-locale-!!", "Asia/Jakarta")).toBe(
      "-",
    );
  });
});

describe("formatMinute", () => {
  it("normal: menit biasa", () => {
    expect(formatMinute(23)).toBe("23");
  });

  it("normal: menit tambahan", () => {
    expect(formatMinute(90, 4)).toBe("90+4");
    expect(formatMinute(45, 2)).toBe("45+2");
    expect(formatMinute(120, 1)).toBe("120+1");
  });

  it("tepi: extraMinute 0 atau undefined dianggap tidak ada", () => {
    expect(formatMinute(90, 0)).toBe("90");
    expect(formatMinute(90, undefined)).toBe("90");
  });

  it("tepi: batas menit 1 dan 120", () => {
    expect(formatMinute(1)).toBe("1");
    expect(formatMinute(120)).toBe("120");
  });

  it("tidak valid: minute bukan bilangan bulat >= 1 menjadi '-'", () => {
    expect(formatMinute(NaN)).toBe("-");
    expect(formatMinute(0)).toBe("-");
    expect(formatMinute(-5)).toBe("-");
    expect(formatMinute(12.5)).toBe("-");
    expect(formatMinute(Infinity)).toBe("-");
  });

  it("tidak valid: extraMinute rusak dianggap tidak ada", () => {
    expect(formatMinute(90, NaN)).toBe("90");
    expect(formatMinute(90, -2)).toBe("90");
    expect(formatMinute(90, 1.5)).toBe("90");
  });
});

describe("formatScore", () => {
  it("normal: laga selesai", () => {
    expect(
      formatScore(makeMatch({ isFinished: true, homeScore: 2, awayScore: 1 })),
    ).toBe("2 - 1");
  });

  it("tepi: 0 - 0 tetap tampil sebagai skor bila laga selesai", () => {
    expect(formatScore(makeMatch({ isFinished: true }))).toBe("0 - 0");
  });

  it("adu penalti: skor tambahan dengan format (h-a pen)", () => {
    expect(
      formatScore(
        makeMatch({
          stage: "QUARTER_FINALS",
          groupLetter: undefined,
          matchday: undefined,
          isFinished: true,
          homeScore: 1,
          awayScore: 1,
          homePenaltyScore: 4,
          awayPenaltyScore: 3,
        }),
      ),
    ).toBe("1 - 1 (4-3 pen)");
  });

  it("adu penalti: tuan rumah kalah di penalti, 0 penalti tetap tampil", () => {
    expect(
      formatScore(
        makeMatch({
          isFinished: true,
          homeScore: 0,
          awayScore: 0,
          homePenaltyScore: 0,
          awayPenaltyScore: 3,
        }),
      ),
    ).toBe("0 - 0 (0-3 pen)");
  });

  it("tepi: skor penalti hanya terisi sebelah diabaikan", () => {
    expect(
      formatScore(
        makeMatch({
          isFinished: true,
          homeScore: 1,
          awayScore: 1,
          homePenaltyScore: 4,
        }),
      ),
    ).toBe("1 - 1");
  });

  it("laga belum selesai: 'vs', walau skor dan penalti berisi nilai", () => {
    expect(formatScore(makeMatch())).toBe("vs");
    expect(
      formatScore(
        makeMatch({
          isFinished: false,
          homeScore: 3,
          awayScore: 2,
          homePenaltyScore: 4,
          awayPenaltyScore: 3,
        }),
      ),
    ).toBe("vs");
  });

  it("tidak valid: skor rusak pada laga selesai menjadi '-' tanpa error", () => {
    const bad = makeMatch({ isFinished: true, homeScore: NaN, awayScore: 1 });
    expect(() => formatScore(bad)).not.toThrow();
    expect(formatScore(bad)).toBe("-");
    expect(
      formatScore(makeMatch({ isFinished: true, homeScore: -1, awayScore: 0 })),
    ).toBe("-");
    expect(
      formatScore(makeMatch({ isFinished: true, homeScore: 1.5, awayScore: 0 })),
    ).toBe("-");
  });

  it("tidak memutasi input", () => {
    const match = makeMatch({ isFinished: true, homeScore: 2, awayScore: 1 });
    const snapshot = structuredClone(match);
    formatScore(match);
    expect(match).toEqual(snapshot);
  });
});

describe("getMatchStatus", () => {
  it("normal: laga selesai menjadi 'FT'", () => {
    expect(
      getMatchStatus(makeMatch({ isFinished: true, homeScore: 2, awayScore: 0 })),
    ).toBe("FT");
  });

  it("normal: laga belum selesai menjadi jam kickoff (default Asia/Jakarta)", () => {
    expect(getMatchStatus(makeMatch())).toBe("Jum, 12 Jun, 02.00");
  });

  it("zona waktu dan locale dapat diganti lewat options", () => {
    expect(getMatchStatus(makeMatch(), { timeZone: "America/New_York" })).toBe(
      "Kam, 11 Jun, 15.00",
    );
    expect(
      getMatchStatus(makeMatch(), { locale: "en-US", timeZone: "Asia/Jakarta" }),
    ).toBe("Fri, Jun 12, 02:00");
  });

  it("tepi: 'FT' tidak bergantung pada options", () => {
    expect(
      getMatchStatus(makeMatch({ isFinished: true }), {
        timeZone: "America/New_York",
      }),
    ).toBe("FT");
  });

  it("tepi: laga lampau yang belum isFinished tetap menampilkan jam (tanpa jam sistem)", () => {
    expect(
      getMatchStatus(makeMatch({ kickoffTime: "2020-01-01T00:00:00Z" })),
    ).toBe("Rab, 1 Jan, 07.00");
  });

  it("tidak valid: kickoffTime rusak pada laga belum selesai menjadi '-'", () => {
    expect(getMatchStatus(makeMatch({ kickoffTime: "rusak" }))).toBe("-");
  });

  it("tidak valid: zona waktu tidak dikenali menjadi '-'", () => {
    expect(getMatchStatus(makeMatch(), { timeZone: "Bukan/Zona" })).toBe("-");
  });
});

describe("truncateName", () => {
  it("normal: dipotong dengan elipsis dan total panjang tepat max", () => {
    const result = truncateName("Cristiano Ronaldo", 10);
    expect(result).toBe("Cristia...");
    expect(Array.from(result)).toHaveLength(10);
  });

  it("normal: nama yang lebih pendek dikembalikan apa adanya", () => {
    expect(truncateName("Messi", 10)).toBe("Messi");
  });

  it("tepi: panjang tepat sama dengan max tidak dipotong", () => {
    expect(truncateName("Mbappe", 6)).toBe("Mbappe");
  });

  it("tepi: max 4 (terkecil yang masih memakai elipsis)", () => {
    expect(truncateName("Neymar", 4)).toBe("N...");
  });

  it("tepi: max < 4 dipotong tanpa elipsis dan tanpa error", () => {
    expect(truncateName("Neymar", 3)).toBe("Ney");
    expect(truncateName("Neymar", 1)).toBe("N");
  });

  it("tepi: max 0, negatif, atau NaN menghasilkan string kosong", () => {
    expect(truncateName("Neymar", 0)).toBe("");
    expect(truncateName("Neymar", -3)).toBe("");
    expect(truncateName("Neymar", NaN)).toBe("");
  });

  it("tepi: max desimal dibulatkan ke bawah; Infinity tidak memotong", () => {
    expect(truncateName("Cristiano Ronaldo", 10.9)).toBe("Cristia...");
    expect(truncateName("Cristiano Ronaldo", Infinity)).toBe(
      "Cristiano Ronaldo",
    );
  });

  it("tepi: string kosong", () => {
    expect(truncateName("", 5)).toBe("");
  });

  it("aksara non-ASCII: tidak memecah surrogate pair (emoji / aksara langka)", () => {
    const result = truncateName("😀😀😀😀😀😀", 5);
    expect(result).toBe("😀😀...");
    expect(Array.from(result)).toHaveLength(5);
    expect(truncateName("𠮷𠮷𠮷𠮷𠮷", 3)).toBe("𠮷𠮷𠮷");
  });

  it("aksara non-ASCII: tidak memecah huruf + tanda diakritik gabungan", () => {
    const decomposed = "Jose\u0301 Mari\u0301a Gimenez"; // é dan í sebagai 2 code point
    expect(truncateName(decomposed, 8)).toBe("Jose\u0301 ...");
    expect(truncateName("Müller", 5)).toBe("Mü...");
  });

  it("aksara non-Latin: Jepang dan Arab dihitung per karakter", () => {
    expect(truncateName("久保建英選手", 5)).toBe("久保...");
    expect(truncateName("محمد صلاح", 6)).toBe("محم...");
  });

  it("tidak valid: bukan string saat runtime menghasilkan string kosong", () => {
    expect(truncateName(undefined as unknown as string, 5)).toBe("");
    expect(truncateName(null as unknown as string, 5)).toBe("");
  });
});
