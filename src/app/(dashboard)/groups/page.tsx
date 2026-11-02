/**
 * Halaman Grup (Server Component, SSG).
 *
 * Acuan PRD: Bab 5.2 dan 5.3 (GroupStandingTable, MatchRow, tab Grup A-L
 * sticky), Bab 6.1 dan 6.2 (klasemen dan Best 3rd), serta Bab 2.1 (data
 * statis diolah saat build).
 *
 * Semua angka berasal dari calculateStandings dan calculateBestThirds yang
 * dipanggil di sini, di server. Halaman ini hanya merangkai: memetakan tim
 * menurut id, menyusun laga per matchday, lalu merender 12 panel untuk dioper
 * ke GroupTabs (client) sebagai props.
 */
import type { Metadata } from "next";
import { BestThirdsTable } from "@/components/football/BestThirdsTable";
import { GroupPanel, type MatchdayGroup } from "@/components/football/GroupPanel";
import { GroupTabs } from "@/components/football/GroupTabs";
import { t } from "@/content/microcopy";
import matchesJson from "@/data/matches.json";
import teamsJson from "@/data/teams.json";
import type { GroupLetter, GroupStanding, Match, Team } from "@/types";
import { calculateBestThirds } from "@/utils/calculateBestThirds";
import { calculateStandings } from "@/utils/calculateStandings";

export const metadata: Metadata = {
  title: t("page.groups.title"),
  description: t("page.groups.meta"),
};

const GROUP_LETTERS: readonly GroupLetter[] = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
];

/** Laga fase grup satu grup, urut kickoff (ISO UTC), dikelompokkan per matchday. */
function buildMatchdays(matches: readonly Match[], letter: GroupLetter): MatchdayGroup[] {
  const ofGroup = matches
    .filter((match) => match.stage === "GROUP_STAGE" && match.groupLetter === letter)
    .sort(
      (a, b) =>
        a.kickoffTime.localeCompare(b.kickoffTime) || a.id.localeCompare(b.id),
    );

  const byMatchday = new Map<number, Match[]>();
  for (const match of ofGroup) {
    const day = match.matchday ?? 0;
    byMatchday.set(day, [...(byMatchday.get(day) ?? []), match]);
  }
  return [...byMatchday.entries()]
    .sort(([a], [b]) => a - b)
    .map(([matchday, list]) => ({ matchday, matches: list }));
}

export default function GroupsPage() {
  // Berkas JSON diketik longgar oleh TypeScript; bentuknya dijamin oleh
  // `npm run validate` (pola yang sama dipakai tes proyek).
  const matches = matchesJson as unknown as Match[];
  const teams = teamsJson as unknown as Team[];

  const teamsById: Record<string, Team> = {};
  for (const team of teams) teamsById[team.id] = team;

  const standingsByGroup: Partial<Record<GroupLetter, GroupStanding[]>> = {};
  for (const letter of GROUP_LETTERS) {
    standingsByGroup[letter] = calculateStandings(matches, teams, letter);
  }
  const thirdPlaceEntries = calculateBestThirds(standingsByGroup);

  const panels = GROUP_LETTERS.map((letter) => ({
    letter,
    panel: (
      <GroupPanel
        groupLetter={letter}
        standings={standingsByGroup[letter] ?? []}
        thirdPlaceEntries={thirdPlaceEntries}
        teamsById={teamsById}
        matchdays={buildMatchdays(matches, letter)}
      />
    ),
  }));

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <header>
        <h1 className="font-display text-h1 font-bold uppercase tracking-wide md:text-h1-lg">
          {t("groups.hero.title")}
        </h1>
        <p className="mt-2 max-w-2xl text-body text-fg-secondary">
          {t("groups.intro")}
        </p>
      </header>

      <GroupTabs panels={panels} />

      <section aria-labelledby="best-thirds-heading">
        <h2
          id="best-thirds-heading"
          className="font-display text-h2 font-bold uppercase tracking-wide md:text-h2-lg"
        >
          {t("groups.bestThirds.title")}
        </h2>
        <p className="mb-3 mt-1 text-body-sm text-fg-secondary">
          {t("groups.bestThirds.intro")}
        </p>
        <BestThirdsTable entries={thirdPlaceEntries} teamsById={teamsById} />
      </section>
    </div>
  );
}
