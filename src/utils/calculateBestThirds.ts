import type { GroupLetter, GroupStanding, ThirdPlaceEntry } from "@/types";
import { compareByPointsGdGf, descending } from "@/utils/calculateStandings";

/**
 * Peringkat tiga terbaik (Best 3rd Place).
 *
 * Acuan: Master PRD Bab 6.2 (algoritma kelolosan peringkat tiga terbaik),
 * Bab 6.1 (kriteria tie-breaker) dan tipe ThirdPlaceEntry pada Bab 4.1.
 *
 * Fungsi ini adalah SATU-SATUNYA tempat keputusan "8 dari 12 peringkat
 * ketiga lolos" dibuat. GroupStandingTable (baris kuning "Kandidat Best 3rd")
 * dan buildBracket wajib membaca hasilnya, bukan menghitung sendiri.
 *
 * Fungsi murni: tidak memutasi input, tidak memakai Date atau angka acak.
 * Klasemen per grup TIDAK dihitung ulang di sini; input harus sudah terurut
 * keluaran calculateStandings (indeks 2 = peringkat ketiga).
 *
 * ---------------------------------------------------------------------
 * URUTAN PEMISAH (lintas grup)
 * ---------------------------------------------------------------------
 *   1. poin
 *   2. selisih gol (GD)
 *   3. gol memasukkan (GF)
 *   4. fair play (makin mendekati nol makin baik)
 *   5. pemutus deterministik terakhir: urutan huruf grup A sampai L
 *
 * Kriteria 1-3 memakai pembanding yang sama dengan calculateStandings
 * (compareByPointsGdGf) agar tidak ada logika ganda.
 *
 * MENGAPA HEAD-TO-HEAD DILEWATI
 * Tim-tim peringkat ketiga berasal dari grup berbeda sehingga tidak pernah
 * bertemu di fase grup; tidak ada laga untuk membentuk mini-tabel H2H. PRD
 * Bab 6.2 juga menyatakan kriteria H2H otomatis dilewati pada tahap ini.
 *
 * KETERBATASAN YANG DIKETAHUI (belum dimodelkan)
 * FIFA dapat memakai kriteria lain setelah fair play, misalnya peringkat
 * dunia FIFA atau undian. Keduanya tidak ada pada data proyek ini, sehingga
 * urutan huruf grup dipakai sebagai pengganti yang stabil dan deterministik.
 * Pada kasus imbang total, hasilnya bisa berbeda dari keputusan FIFA.
 */

/** Jumlah peringkat ketiga yang lolos ke Babak 32 Besar (PRD Bab 6.2). */
export const BEST_THIRD_QUALIFY_COUNT = 8;

/** Indeks peringkat ketiga pada klasemen grup yang sudah terurut. */
const THIRD_PLACE_INDEX = 2;

/** Jumlah laga fase grup per tim; di bawah ini grup dianggap belum tuntas. */
const GROUP_MATCHES_PER_TEAM = 3;

/** Urutan huruf grup untuk pemutus terakhir (A sampai L). */
const GROUP_ORDER: readonly GroupLetter[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
];

interface ThirdCandidate {
  readonly groupLetter: GroupLetter;
  readonly standing: GroupStanding;
  readonly isProvisional: boolean;
}

function compareCandidates(a: ThirdCandidate, b: ThirdCandidate): number {
  return (
    compareByPointsGdGf(a.standing, b.standing) ||
    descending(a.standing.fairPlayPoints, b.standing.fairPlayPoints) ||
    GROUP_ORDER.indexOf(a.groupLetter) - GROUP_ORDER.indexOf(b.groupLetter)
  );
}

/**
 * Menyusun tabel peringkat ketiga lintas grup.
 *
 * Perilaku parsial: grup yang tidak ada pada input (atau yang berisi kurang
 * dari 3 tim) dilewati tanpa error. Peringkat dihitung dari grup yang
 * tersedia; `qualified` berarti "posisi saat ini masuk 8 besar" dan UI
 * membedakannya lewat `isProvisional`, yaitu benar bila ada tim pada grup
 * asal yang belum memainkan 3 laga.
 *
 * @param standingsByGroup klasemen per grup yang sudah terurut
 *        (keluaran calculateStandings); tidak diubah.
 * @returns array baru berisi 0 sampai 12 entri terurut dari rank 1.
 */
export function calculateBestThirds(
  standingsByGroup: Partial<Record<GroupLetter, GroupStanding[]>>,
): ThirdPlaceEntry[] {
  const candidates: ThirdCandidate[] = [];

  for (const groupLetter of GROUP_ORDER) {
    const standings = standingsByGroup[groupLetter];
    if (standings === undefined) continue;

    const third = standings[THIRD_PLACE_INDEX];
    if (third === undefined) continue;

    candidates.push({
      groupLetter,
      standing: third,
      isProvisional: standings.some(
        (row) => row.played < GROUP_MATCHES_PER_TEAM,
      ),
    });
  }

  return candidates.sort(compareCandidates).map(
    (candidate, index): ThirdPlaceEntry => ({
      ...candidate.standing,
      groupLetter: candidate.groupLetter,
      rank: index + 1,
      qualified: index < BEST_THIRD_QUALIFY_COUNT,
      isProvisional: candidate.isProvisional,
    }),
  );
}

/**
 * Apakah tim ini sedang berada di 8 besar peringkat ketiga.
 * Untuk GroupStandingTable; tim yang tidak ada di `entries` menghasilkan false.
 */
export function isQualifiedThird(
  teamId: string,
  entries: readonly ThirdPlaceEntry[],
): boolean {
  return entries.some((entry) => entry.teamId === teamId && entry.qualified);
}
