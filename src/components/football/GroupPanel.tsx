/**
 * GroupPanel (Server Component): isi satu tab grup, yaitu klasemen dan enam
 * laga yang dikelompokkan per matchday.
 *
 * Acuan PRD: Bab 5.2 (GroupStandingTable dan MatchRow) dan Bab 3.3 (Server
 * Component sebagai default). Semua data datang dari props; tidak ada
 * perhitungan di sini.
 */
import { EmptyState } from "@/components/ui/EmptyState";
import { t, tf } from "@/content/microcopy";
import type {
  GroupLetter,
  GroupStanding,
  Match,
  Team,
  ThirdPlaceEntry,
} from "@/types";
import { GroupStandingTable } from "./GroupStandingTable";
import { MatchRow } from "./MatchRow";

/** Laga satu matchday, sudah terurut menurut kickoff oleh pemanggil. */
export interface MatchdayGroup {
  matchday: number;
  matches: readonly Match[];
}

export interface GroupPanelProps {
  groupLetter: GroupLetter;
  standings: readonly GroupStanding[];
  thirdPlaceEntries: readonly ThirdPlaceEntry[];
  teamsById: Readonly<Record<string, Team>>;
  matchdays: readonly MatchdayGroup[];
}

export function GroupPanel({
  groupLetter,
  standings,
  thirdPlaceEntries,
  teamsById,
  matchdays,
}: GroupPanelProps) {
  if (standings.length === 0) {
    return (
      <EmptyState
        title={t("empty.groups.title")}
        message={t("empty.groups.body")}
        headingAs="h2"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="mb-3 font-display text-h3 font-semibold uppercase tracking-wide">
          {tf("aria.standings.table", { letter: groupLetter })}
        </h2>
        <GroupStandingTable
          groupLetter={groupLetter}
          standings={standings}
          thirdPlaceEntries={thirdPlaceEntries}
          teamsById={teamsById}
        />
      </section>

      <section>
        <h2 className="mb-3 font-display text-h3 font-semibold uppercase tracking-wide">
          {t("groups.matches.title")} {tf("nav.groupTab", { letter: groupLetter })}
        </h2>
        <div className="flex flex-col gap-4">
          {matchdays.map((day) => (
            <div key={day.matchday}>
              <h3 className="mb-2 text-body-sm font-semibold text-fg-secondary">
                {tf("match.matchday", { number: day.matchday })}
              </h3>
              <ul className="flex flex-col gap-2">
                {day.matches.map((match) => (
                  <li key={match.id}>
                    <MatchRow
                      match={match}
                      homeTeam={teamsById[match.homeTeamId]}
                      awayTeam={teamsById[match.awayTeamId]}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
