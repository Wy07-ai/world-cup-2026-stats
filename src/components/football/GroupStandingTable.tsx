/**
 * GroupStandingTable (Server Component: murni tampilan).
 *
 * Acuan PRD: Bab 5.2 (tabel klasemen dapat di-scroll menyamping di HP; baris
 * peringkat 1-2 hijau, peringkat 3 kuning kandidat Best 3rd) dan Bab 6.2
 * (keputusan lolos atau tidak dibuat oleh calculateBestThirds).
 *
 * Komponen ini TIDAK menghitung apa pun. `standings` adalah keluaran
 * calculateStandings (sudah terurut) dan `thirdPlaceEntries` adalah keluaran
 * calculateBestThirds; keduanya dihitung di server oleh pemanggil.
 *
 * Aksen baris tidak bergantung pada warna saja: ada bilah tepi kiri, Badge
 * bertuliskan status, dan teks sr-only. Kolom Peringkat dan Tim menempel
 * (sticky) di kiri; latar sel dibuat buram (surface + lapisan aksen) supaya
 * angka yang tergulir tidak tembus.
 */
import type { ReactNode } from "react";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { SafeImage } from "@/components/ui/SafeImage";
import { t, tf, type MicrocopyKey } from "@/content/microcopy";
import { cn } from "@/lib/utils";
import type {
  GroupLetter,
  GroupStanding,
  Team,
  ThirdPlaceEntry,
} from "@/types";
import { isQualifiedThird } from "@/utils/calculateBestThirds";

export interface GroupStandingTableProps {
  groupLetter: GroupLetter;
  /** Keluaran calculateStandings(matches, teams, groupLetter), terurut. */
  standings: readonly GroupStanding[];
  /** Keluaran calculateBestThirds(...) untuk 12 grup. */
  thirdPlaceEntries: readonly ThirdPlaceEntry[];
  /** Peta id tim ke Team (pemetaan tanpa rumus). */
  teamsById: Readonly<Record<string, Team>>;
  className?: string;
}

type RowKind = "qualified" | "bestThird" | "neutral";

/** Lapisan aksen di atas latar `surface` agar sel sticky tetap buram. */
const ROW_BG: Record<RowKind, string> = {
  qualified:
    "bg-surface bg-[linear-gradient(var(--success-bg),var(--success-bg))]",
  bestThird:
    "bg-surface bg-[linear-gradient(var(--warning-bg),var(--warning-bg))]",
  neutral: "bg-surface",
};

/** Bilah tepi kiri sebagai penanda non-warna-saja (bentuk) pada sel pertama. */
const ROW_BAR: Record<RowKind, string> = {
  qualified: "shadow-[inset_4px_0_0_var(--success-solid)]",
  bestThird: "shadow-[inset_4px_0_0_var(--warning-solid)]",
  neutral: "",
};

function rowKindOf(rankIndex: number): RowKind {
  if (rankIndex < 2) return "qualified";
  if (rankIndex === 2) return "bestThird";
  return "neutral";
}

const STAT_COLUMNS: ReadonlyArray<{
  key: "played" | "won" | "drawn" | "lost" | "goalsFor" | "goalsAgainst" | "goalDifference" | "points";
  label: MicrocopyKey;
  tooltip: MicrocopyKey;
}> = [
  { key: "played", label: "standings.col.played", tooltip: "standings.col.played.tooltip" },
  { key: "won", label: "standings.col.won", tooltip: "standings.col.won.tooltip" },
  { key: "drawn", label: "standings.col.drawn", tooltip: "standings.col.drawn.tooltip" },
  { key: "lost", label: "standings.col.lost", tooltip: "standings.col.lost.tooltip" },
  { key: "goalsFor", label: "standings.col.goalsFor", tooltip: "standings.col.goalsFor.tooltip" },
  { key: "goalsAgainst", label: "standings.col.goalsAgainst", tooltip: "standings.col.goalsAgainst.tooltip" },
  { key: "goalDifference", label: "standings.col.goalDifference", tooltip: "standings.col.goalDifference.tooltip" },
  { key: "points", label: "standings.col.points", tooltip: "standings.col.points.tooltip" },
];

/** Selisih gol tampil dengan tanda: +3, 0, -2 (format tampilan saja). */
function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

interface RowStatus {
  variant: BadgeVariant;
  label: string;
  srText: string | null;
  provisional: boolean;
}

/**
 * Teks dan varian Badge untuk satu baris. Hanya MEMBACA hasil
 * calculateBestThirds (isQualifiedThird + isProvisional); tidak menghitung.
 */
function getRowStatus(
  kind: RowKind,
  teamId: string,
  groupProvisional: boolean,
  thirdPlaceEntries: readonly ThirdPlaceEntry[],
): RowStatus | null {
  if (kind === "qualified") {
    return groupProvisional
      ? { variant: "info", label: t("status.provisional"), srText: t("aria.row.qualified"), provisional: true }
      : { variant: "success", label: t("status.qualified"), srText: t("aria.row.qualified"), provisional: false };
  }
  if (kind === "bestThird") {
    const qualified = isQualifiedThird(teamId, thirdPlaceEntries);
    if (groupProvisional) {
      return { variant: "warning", label: t("status.bestThirdCandidate"), srText: t("aria.row.bestThird"), provisional: true };
    }
    return qualified
      ? { variant: "success", label: t("status.qualifiedAsBestThird"), srText: t("aria.row.bestThird"), provisional: false }
      : { variant: "danger", label: t("status.eliminated"), srText: t("aria.row.bestThird"), provisional: false };
  }
  return null;
}

function HeaderCell({
  children,
  title,
  className,
  srLabel,
}: {
  children: ReactNode;
  title?: string;
  className?: string;
  srLabel?: string;
}) {
  return (
    <th
      scope="col"
      title={title}
      className={cn(
        "px-2 py-2 text-center text-caption font-semibold text-fg-secondary",
        className,
      )}
    >
      <span aria-hidden={srLabel ? "true" : undefined}>{children}</span>
      {srLabel ? <span className="sr-only">{srLabel}</span> : null}
    </th>
  );
}

export function GroupStandingTable({
  groupLetter,
  standings,
  thirdPlaceEntries,
  teamsById,
  className,
}: GroupStandingTableProps) {
  const groupEntry = thirdPlaceEntries.find(
    (entry) => entry.groupLetter === groupLetter,
  );
  // Grup dianggap sementara bila ada entri peringkat 3 yang provisional.
  const groupProvisional = groupEntry?.isProvisional ?? false;

  return (
    <div className={cn("min-w-0", className)}>
      <div
        role="region"
        tabIndex={0}
        aria-label={tf("aria.standings.table", { letter: groupLetter })}
        className="relative overflow-x-auto rounded-xl border border-line bg-surface shadow-card focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-cyan-ink"
      >
        <table className="w-full min-w-[40rem] border-collapse text-body-sm">
          <caption className="sr-only">
            {tf("aria.standings.table", { letter: groupLetter })}
          </caption>
          <thead className="bg-surface-muted">
            <tr>
              <HeaderCell
                title={t("standings.col.rank.tooltip")}
                srLabel={t("standings.col.rank.tooltip")}
                className="sticky left-0 z-20 w-10 min-w-10 bg-surface-muted"
              >
                {t("standings.col.rank")}
              </HeaderCell>
              <HeaderCell
                className="sticky left-10 z-20 w-40 min-w-40 bg-surface-muted text-left shadow-[1px_0_0_var(--line)]"
              >
                {t("standings.col.team")}
              </HeaderCell>
              {STAT_COLUMNS.map((column) => (
                <HeaderCell
                  key={column.key}
                  title={t(column.tooltip)}
                  srLabel={t(column.tooltip)}
                  className={column.key === "points" ? "text-fg" : undefined}
                >
                  {t(column.label)}
                </HeaderCell>
              ))}
              <HeaderCell className="min-w-44 text-left">
                {t("standings.col.status")}
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, index) => {
              const kind = rowKindOf(index);
              const team = teamsById[row.teamId];
              const name = team?.name ?? row.teamId;
              const status = getRowStatus(
                kind,
                row.teamId,
                groupProvisional,
                thirdPlaceEntries,
              );
              return (
                <tr key={row.teamId} className="border-t border-line">
                  <td
                    className={cn(
                      "sticky left-0 z-10 w-10 min-w-10 px-2 py-2 text-center font-semibold tabular-nums",
                      ROW_BG[kind],
                      ROW_BAR[kind],
                    )}
                  >
                    {index + 1}
                  </td>
                  <th
                    scope="row"
                    className={cn(
                      "sticky left-10 z-10 w-40 min-w-40 max-w-40 px-2 py-2 text-left font-medium shadow-[1px_0_0_var(--line)]",
                      ROW_BG[kind],
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <SafeImage
                        src={team?.flagUrl ?? ""}
                        alt={tf("aria.flag", { teamName: name })}
                        width={24}
                        height={16}
                        fallbackType="flag"
                        className="h-4 w-6 shrink-0 rounded-[2px] object-cover"
                      />
                      <span className="min-w-0 truncate" title={name}>
                        {name}
                      </span>
                    </span>
                  </th>
                  {STAT_COLUMNS.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-2 py-2 text-center tabular-nums",
                        ROW_BG[kind],
                        column.key === "points" && "font-bold text-fg",
                      )}
                    >
                      {column.key === "goalDifference"
                        ? formatSigned(row[column.key])
                        : row[column.key]}
                    </td>
                  ))}
                  <td className={cn("px-2 py-2", ROW_BG[kind])}>
                    {status ? (
                      <span className="inline-flex flex-wrap items-center gap-1.5">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        {status.srText !== null ? (
                          <span className="sr-only">{status.srText}</span>
                        ) : null}
                        {status.provisional && status.variant !== "info" ? (
                          <span
                            title={t("status.provisional.tooltip")}
                            className="text-caption text-fg-muted"
                          >
                            {t("status.provisional")}
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul
        aria-label={t("groups.legend.title")}
        className="mt-3 flex flex-col gap-1.5 text-caption text-fg-secondary sm:flex-row sm:flex-wrap sm:gap-x-5"
      >
        <li className="flex items-start gap-2">
          <span
            aria-hidden="true"
            className="mt-0.5 inline-block h-3.5 w-3.5 shrink-0 rounded-sm border-l-4 border-success bg-success-bg"
          />
          <span>{t("groups.legend.qualified")}</span>
        </li>
        <li className="flex items-start gap-2">
          <span
            aria-hidden="true"
            className="mt-0.5 inline-block h-3.5 w-3.5 shrink-0 rounded-sm border-l-4 border-warning bg-warning-bg"
          />
          <span>{t("groups.legend.bestThird")}</span>
        </li>
      </ul>
    </div>
  );
}
