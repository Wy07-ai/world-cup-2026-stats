import type { Player } from "@/types";

/**
 * Filter pencarian halaman Pemain.
 *
 * Acuan: Master PRD Bab 7.2 (Claude #3 memegang filter pencarian) dan Bab 8.1
 * (pencarian tanpa hasil harus menghasilkan daftar kosong untuk Empty State).
 *
 * Murni: tidak memutasi masukan; urutan keluaran mengikuti urutan masukan.
 */

/** Kriteria filter pemain. */
export interface PlayerFilter {
  /** Kata kunci; kosong atau hanya spasi berarti tanpa filter nama. */
  query: string;
  /** "ALL" berarti semua posisi. */
  position: "ALL" | Player["position"];
  /** Id tim, atau "ALL" untuk semua tim. */
  teamId: string | "ALL";
}

/**
 * Huruf yang tidak terurai oleh normalisasi NFD (bukan huruf dasar + tanda
 * diakritik), tetapi lazim dalam nama pemain. Dipetakan agar "Odegaard"
 * menemukan "Ødegaard".
 */
const NON_DECOMPOSABLE: Readonly<Record<string, string>> = {
  ø: "o",
  đ: "d",
  ł: "l",
  ı: "i",
  ß: "ss",
  æ: "ae",
  œ: "oe",
};

/**
 * Normalisasi teks untuk pencarian: NFD, buang tanda diakritik, huruf kecil,
 * petakan huruf khusus, rapikan spasi (awal, akhir, dan berlebih di tengah).
 */
export function normalizeSearchText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[øđłıßæœ]/g, (char) => NON_DECOMPOSABLE[char] ?? char)
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Saring pemain berdasarkan kata kunci (cocok sebagian pada `name` atau
 * `shortName`, tidak peka huruf besar-kecil dan diakritik), posisi, dan tim.
 */
export function filterPlayers(
  players: Player[],
  filter: PlayerFilter,
): Player[] {
  const query = normalizeSearchText(filter.query);

  return players.filter((player) => {
    if (filter.position !== "ALL" && player.position !== filter.position) {
      return false;
    }
    if (filter.teamId !== "ALL" && player.teamId !== filter.teamId) {
      return false;
    }
    if (query === "") return true;
    return (
      normalizeSearchText(player.name).includes(query) ||
      normalizeSearchText(player.shortName).includes(query)
    );
  });
}
