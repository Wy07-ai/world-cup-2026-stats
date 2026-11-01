/*
 * Tidak memakai "use client": berkas ini tidak merender apa pun dan hanya
 * diimpor oleh komponen client. Akses localStorage terjadi secara malas lewat
 * `persist`, bukan saat modul dievaluasi di server.
 *
 * Acuan PRD: Bab 3.4 (Zustand untuk Dark Mode, tab grup aktif, dan filter
 * pencarian pemain) dan Bab 8.2 (filter tidak boleh memicu re-render komponen
 * lain; karena itu tersedia selector kecil di bawah).
 */
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type PersistStorage,
} from "zustand/middleware";
import type { GroupLetter, PlayerPosition } from "@/types";
import { THEME_STORAGE_KEY, type Theme } from "./themeStorage";

export type { Theme } from "./themeStorage";

/** Filter posisi; "ALL" = semua posisi (selaras dengan PlayerFilter.position). */
export type PositionFilter = "ALL" | PlayerPosition;

/** Filter tim; "ALL" = semua tim, selain itu Team.id (selaras dengan PlayerFilter.teamId). */
export type TeamFilter = "ALL" | string;

interface UIState {
  theme: Theme;
  activeGroup: GroupLetter;
  playerSearch: string;
  positionFilter: PositionFilter;
  teamFilter: TeamFilter;
}

interface UIActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setActiveGroup: (group: GroupLetter) => void;
  setPlayerSearch: (query: string) => void;
  setPositionFilter: (position: PositionFilter) => void;
  setTeamFilter: (teamId: TeamFilter) => void;
  /** Mengosongkan pencarian, posisi, dan tim sekaligus. */
  resetPlayerFilters: () => void;
}

export type UIStore = UIState & UIActions;

/** Hanya `theme` yang disimpan ke localStorage. */
type PersistedUIState = Pick<UIState, "theme">;

/**
 * localStorage + JSON, dengan satu tambahan: penulisan dilewati bila isinya
 * sama dengan penulisan terakhir. `persist` menulis pada SETIAP perubahan state,
 * jadi tanpa ini setiap ketikan di kolom pencarian akan menulis ulang tema.
 */
function createThemeStorage(): PersistStorage<PersistedUIState> | undefined {
  const base = createJSONStorage<PersistedUIState>(() => localStorage);
  if (!base) return undefined;

  let lastWritten: string | undefined;
  return {
    getItem: base.getItem,
    removeItem: base.removeItem,
    setItem: (name, value) => {
      const serialized = JSON.stringify(value);
      if (serialized === lastWritten) return;
      lastWritten = serialized;
      return base.setItem(name, value);
    },
  };
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: "light",
      activeGroup: "A",
      playerSearch: "",
      positionFilter: "ALL",
      teamFilter: "ALL",

      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
      setActiveGroup: (activeGroup) => set({ activeGroup }),
      setPlayerSearch: (playerSearch) => set({ playerSearch }),
      setPositionFilter: (positionFilter) => set({ positionFilter }),
      setTeamFilter: (teamFilter) => set({ teamFilter }),
      resetPlayerFilters: () =>
        set({ playerSearch: "", positionFilter: "ALL", teamFilter: "ALL" }),
    }),
    {
      name: THEME_STORAGE_KEY,
      version: 1,
      storage: createThemeStorage(),
      partialize: (state): PersistedUIState => ({ theme: state.theme }),
      // Tema dibaca dari <html class="dark"> oleh ThemeSync (yang sudah diputuskan
      // skrip inline sebelum render pertama). Jika `persist` ikut membaca
      // localStorage saat store dibuat, nilai awal client berbeda dari server
      // dan memicu hydration mismatch.
      skipHydration: true,
    },
  ),
);

// ---------------------------------------------------------------------------
// Selector kecil: pakai `useUIStore(selectX)` agar komponen hanya berlangganan
// satu potongan state. Aksi bersifat stabil (referensinya tidak berubah), jadi
// memilih aksi tidak pernah memicu re-render.
// ---------------------------------------------------------------------------
export const selectTheme = (state: UIStore): Theme => state.theme;
export const selectActiveGroup = (state: UIStore): GroupLetter =>
  state.activeGroup;
export const selectPlayerSearch = (state: UIStore): string =>
  state.playerSearch;
export const selectPositionFilter = (state: UIStore): PositionFilter =>
  state.positionFilter;
export const selectTeamFilter = (state: UIStore): TeamFilter =>
  state.teamFilter;

export const selectSetTheme = (state: UIStore) => state.setTheme;
export const selectToggleTheme = (state: UIStore) => state.toggleTheme;
export const selectSetActiveGroup = (state: UIStore) => state.setActiveGroup;
export const selectSetPlayerSearch = (state: UIStore) => state.setPlayerSearch;
export const selectSetPositionFilter = (state: UIStore) =>
  state.setPositionFilter;
export const selectSetTeamFilter = (state: UIStore) => state.setTeamFilter;
export const selectResetPlayerFilters = (state: UIStore) =>
  state.resetPlayerFilters;
