# Komponen Football dan Halaman Grup (`src/components/football/`)

Pemilik: Claude #2 (Frontend & UI Specialist).

**Acuan PRD:** Bab 5.2 (MatchRow dan GroupStandingTable), Bab 5.3 (tab Grup A-L sticky), Bab 5.4 (Skeleton dan hover hanya pada elemen klik), dengan Bab 6.1 dan 6.2 sebagai sumber logika (dihitung Claude #3, hanya ditampilkan di sini).

> Catatan: `docs/master-prd.md` di repo masih berkas PLACEHOLDER. Acuan di atas diambil dari `master-prd-world-cup-2026-lengkap.docx`.

| Komponen | Berkas | Client? | Props utama |
|---|---|---|---|
| MatchRow | `MatchRow.tsx` | Tidak | `match: Match`, `homeTeam?: Team`, `awayTeam?: Team` |
| GroupStandingTable | `GroupStandingTable.tsx` | Tidak | `groupLetter`, `standings: GroupStanding[]`, `thirdPlaceEntries: ThirdPlaceEntry[]`, `teamsById: Record<string, Team>` |
| BestThirdsTable | `BestThirdsTable.tsx` | Tidak | `entries: ThirdPlaceEntry[]`, `teamsById` |
| GroupPanel | `GroupPanel.tsx` | Tidak | `groupLetter`, `standings`, `thirdPlaceEntries`, `teamsById`, `matchdays: { matchday, matches }[]` |
| GroupTabs | `GroupTabs.tsx` | **Ya** (store + hash URL) | `panels: { letter: GroupLetter; panel: ReactNode }[]` |

Halaman: `src/app/(dashboard)/groups/page.tsx` (Server Component, statis) dan `loading.tsx` (skeleton).

## Aturan tampilan

- Tidak ada rumus di komponen. Urutan dan keputusan lolos berasal dari `calculateStandings` dan `calculateBestThirds`; komponen hanya membaca (`isQualifiedThird`, `ThirdPlaceEntry.isProvisional`).
- Baris peringkat 1-2 hijau, peringkat 3 kuning (kandidat Best 3rd), peringkat 4 netral. Warna selalu disertai bilah tepi kiri, Badge teks, dan teks sr-only.
- Badge baris peringkat 3: `isProvisional` benar menjadi "Kandidat Best 3rd"; bila grup tuntas, "Lolos sebagai Best 3rd" (`qualified`) atau "Tersingkir".
- Kolom Peringkat dan Tim menempel di kiri; sel sticky memakai latar buram (surface + lapisan aksen).
- Wadah scroll tabel wajib `relative`, supaya elemen `sr-only` di dalamnya ikut terpotong dan tidak melebarkan halaman.
- MatchRow tidak dapat diklik, jadi tanpa `hover:scale-105`.
- Tautan langsung: `/groups#grup-c`. Ganti tab memakai `history.replaceState` (tidak menumpuk riwayat).
