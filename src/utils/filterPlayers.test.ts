import { describe, expect, it } from "vitest";
import type { Player } from "@/types";
import { filterPlayers, normalizeSearchText } from "@/utils/filterPlayers";

function makePlayer(id: string, teamId: string, name: string, shortName: string, position: Player["position"]): Player {
  return {
    id,
    teamId,
    name,
    shortName,
    shirtNumber: 1,
    position,
    photoUrl: "/players/placeholder.svg",
    stats: { appearances: 0, minutesPlayed: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  };
}

const players: Player[] = [
  makePlayer("PL-FRA-10", "FRA", "Kylian Mbappé", "K. Mbappé", "FW"),
  makePlayer("PL-FRA-04", "FRA", "Dayot Upamecano", "D. Upamecano", "DF"),
  makePlayer("PL-ARG-10", "ARG", "Lionel Messi", "L. Messi", "FW"),
  makePlayer("PL-ARG-01", "ARG", "Emiliano Martínez", "E. Martínez", "GK"),
  makePlayer("PL-NOR-10", "NOR", "Martin Ødegaard", "M. Ødegaard", "MF"),
];

describe("filterPlayers", () => {
  const all = { query: "", position: "ALL", teamId: "ALL" } as const;

  it('pencarian "mbappe" menemukan "Mbappé" (tanpa diakritik, tanpa peka huruf)', () => {
    expect(filterPlayers(players, { ...all, query: "mbappe" }).map((p) => p.id)).toEqual(["PL-FRA-10"]);
    expect(filterPlayers(players, { ...all, query: "MBAPPÉ" }).map((p) => p.id)).toEqual(["PL-FRA-10"]);
  });

  it("cocok pada shortName dan mengabaikan spasi di awal dan akhir", () => {
    expect(filterPlayers(players, { ...all, query: "  l. messi  " }).map((p) => p.id)).toEqual(["PL-ARG-10"]);
  });

  it("huruf yang tak terurai NFD tetap cocok: odegaard menemukan Ødegaard", () => {
    expect(filterPlayers(players, { ...all, query: "odegaard" }).map((p) => p.id)).toEqual(["PL-NOR-10"]);
  });

  it("kombinasi posisi dan tim", () => {
    const result = filterPlayers(players, { query: "", position: "FW", teamId: "FRA" });
    expect(result.map((p) => p.id)).toEqual(["PL-FRA-10"]);
    expect(filterPlayers(players, { query: "mart", position: "GK", teamId: "ARG" }).map((p) => p.id)).toEqual(["PL-ARG-01"]);
    expect(filterPlayers(players, { query: "mart", position: "FW", teamId: "ARG" })).toEqual([]);
  });

  it("query kosong atau hanya spasi mengembalikan semua, urutan sama dengan masukan", () => {
    expect(filterPlayers(players, all).map((p) => p.id)).toEqual(players.map((p) => p.id));
    expect(filterPlayers(players, { ...all, query: "   " })).toHaveLength(players.length);
  });

  it("hasil kosong mengembalikan array kosong", () => {
    expect(filterPlayers(players, { ...all, query: "tidak ada pemain ini" })).toEqual([]);
  });

  it("tidak memutasi masukan", () => {
    const snapshot = JSON.stringify(players);
    filterPlayers(players, { query: "m", position: "ALL", teamId: "ALL" });
    expect(JSON.stringify(players)).toBe(snapshot);
  });
});

describe("normalizeSearchText", () => {
  it("menormalkan diakritik, huruf besar, dan spasi", () => {
    expect(normalizeSearchText("  Mbappé   Lottin ")).toBe("mbappe lottin");
  });
});
