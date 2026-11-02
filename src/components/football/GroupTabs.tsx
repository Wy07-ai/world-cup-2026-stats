"use client";
// "use client": tab aktif disinkronkan dengan store Zustand (activeGroup) dan
// hash URL (#grup-c), yang membutuhkan window, hashchange, dan history.
//
// Acuan PRD: Bab 3.4 (tab grup aktif disimpan di Zustand), Bab 5.3 (tab Grup
// A sampai L sticky), dan Bab 2.1 (SSG): seluruh 12 panel dirender di server
// lalu dioper lewat props `panels`; komponen ini TIDAK memuat data apa pun.
// `renderAllPanels` membuat ke-12 panel ada di HTML awal (tidak aktif =
// atribut hidden), sehingga konten semua grup terbaca mesin pencari.

import { useCallback, useEffect, useMemo, type ReactNode } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { t, tf } from "@/content/microcopy";
import { selectActiveGroup, selectSetActiveGroup, useUIStore } from "@/store/useUIStore";
import type { GroupLetter } from "@/types";

export interface GroupTabPanel {
  letter: GroupLetter;
  /** Isi panel yang sudah dirender di server. */
  panel: ReactNode;
}

export interface GroupTabsProps {
  panels: readonly GroupTabPanel[];
}

const HASH_PATTERN = /^#grup-([a-l])$/i;

function hashFor(letter: GroupLetter): string {
  return `#grup-${letter.toLowerCase()}`;
}

export function GroupTabs({ panels }: GroupTabsProps) {
  const activeGroup = useUIStore(selectActiveGroup);
  const setActiveGroup = useUIStore(selectSetActiveGroup);

  const letters = useMemo(() => panels.map((item) => item.letter), [panels]);
  const items = useMemo(
    () =>
      panels.map((item) => ({
        id: item.letter,
        label: tf("nav.groupTab", { letter: item.letter }),
        panel: item.panel,
      })),
    [panels],
  );

  const toGroupLetter = useCallback(
    (value: string): GroupLetter | null =>
      letters.find((letter) => letter === value.toUpperCase()) ?? null,
    [letters],
  );

  // Tautan langsung: #grup-c membuka Grup C saat dimuat dan saat hash berubah.
  useEffect(() => {
    const applyHash = () => {
      const found = HASH_PATTERN.exec(window.location.hash);
      const letter = found ? toGroupLetter(found[1]) : null;
      if (letter) setActiveGroup(letter);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [setActiveGroup, toGroupLetter]);

  const handleChange = useCallback(
    (id: string) => {
      const letter = toGroupLetter(id);
      if (!letter) return;
      setActiveGroup(letter);
      // replaceState: ganti tab tidak menumpuk riwayat; hash tetap bisa disalin.
      window.history.replaceState(window.history.state, "", hashFor(letter));
    },
    [setActiveGroup, toGroupLetter],
  );

  return (
    <Tabs
      items={items}
      ariaLabel={t("aria.groups.tabs")}
      value={activeGroup}
      onValueChange={handleChange}
      renderAllPanels
    />
  );
}
