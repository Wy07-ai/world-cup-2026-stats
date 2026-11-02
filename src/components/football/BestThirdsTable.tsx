/**
 * BestThirdsTable (Server Component: murni tampilan).
 *
 * Acuan PRD: Bab 6.2 (8 dari 12 tim peringkat ketiga lolos ke Babak 32 Besar)
 * dan Bab 4.1 (tipe ThirdPlaceEntry hasil kalkulasi).
 *
 * Menampilkan 12 entri keluaran calculateBestThirds apa adanya, dengan urutan
 * dan penanda `qualified` / `isProvisional` dari fungsi itu. Tidak ada
 * perhitungan di sini. Batas antara peringkat 8 dan 9 diberi garis putus-putus
 * (penanda non-warna) selain Badge teks Lolos / Tersingkir.
 */
import { Badge } from "@/components/ui/Badge";
import { SafeImage } from "@/components/ui/SafeImage";
import { t, tf } from "@/content/microcopy";
import { cn } from "@/lib/utils";
import type { Team, ThirdPlaceEntry } from "@/types";

export interface BestThirdsTableProps {
  /** Keluaran calculateBestThirds (terurut dari peringkat 1). */
  entries: readonly ThirdPlaceEntry[];
  teamsById: Readonly<Record<string, Team>>;
  className?: string;
}

function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

const NUM_HEAD = "px-2 py-2 text-center text-caption font-semibold text-fg-secondary";

export function BestThirdsTable({ entries, teamsById, className }: BestThirdsTableProps) {
  return (
    <div
      role="region"
      tabIndex={0}
      aria-label={t("aria.bestThirds.table")}
      className={cn(
        "relative overflow-x-auto rounded-xl border border-line bg-surface shadow-card focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-cyan-ink",
        className,
      )}
    >
      <table className="w-full min-w-[40rem] border-collapse text-body-sm">
        <caption className="sr-only">{t("aria.bestThirds.table")}</caption>
        <thead className="bg-surface-muted">
          <tr>
            <th scope="col" title={t("standings.col.rank.tooltip")} className={cn(NUM_HEAD, "sticky left-0 z-20 w-10 min-w-10 bg-surface-muted")}>
              <span aria-hidden="true">{t("standings.col.rank")}</span>
              <span className="sr-only">{t("standings.col.rank.tooltip")}</span>
            </th>
            <th scope="col" className={cn(NUM_HEAD, "sticky left-10 z-20 w-44 min-w-44 bg-surface-muted text-left shadow-[1px_0_0_var(--line)]")}>
              {t("standings.col.team")}
            </th>
            {(
              [
                ["standings.col.played", "standings.col.played.tooltip"],
                ["standings.col.goalDifference", "standings.col.goalDifference.tooltip"],
                ["standings.col.goalsFor", "standings.col.goalsFor.tooltip"],
                ["standings.col.points", "standings.col.points.tooltip"],
              ] as const
            ).map(([label, tooltip]) => (
              <th key={label} scope="col" title={t(tooltip)} className={NUM_HEAD}>
                <span aria-hidden="true">{t(label)}</span>
                <span className="sr-only">{t(tooltip)}</span>
              </th>
            ))}
            <th scope="col" className={cn(NUM_HEAD, "min-w-44 text-left")}>
              {t("standings.col.status")}
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const team = teamsById[entry.teamId];
            const name = team?.name ?? entry.teamId;
            // Garis batas tepat sebelum peringkat pertama yang tidak lolos.
            const previous = entries.find((e) => e.rank === entry.rank - 1);
            const isCutoff = previous?.qualified === true && !entry.qualified;
            const bg = entry.qualified
              ? "bg-surface bg-[linear-gradient(var(--success-bg),var(--success-bg))]"
              : "bg-surface";
            return (
              <tr
                key={entry.teamId}
                className={cn(
                  "border-t",
                  isCutoff ? "border-t-2 border-dashed border-line-strong" : "border-line",
                )}
              >
                <td className={cn("sticky left-0 z-10 w-10 min-w-10 px-2 py-2 text-center font-semibold tabular-nums", bg, entry.qualified && "shadow-[inset_4px_0_0_var(--success-solid)]")}>
                  {entry.rank}
                </td>
                <th scope="row" className={cn("sticky left-10 z-10 w-44 min-w-44 max-w-44 px-2 py-2 text-left font-medium shadow-[1px_0_0_var(--line)]", bg)}>
                  <span className="flex min-w-0 items-center gap-2">
                    <SafeImage
                      src={team?.flagUrl ?? ""}
                      alt={tf("aria.flag", { teamName: name })}
                      width={24}
                      height={16}
                      fallbackType="flag"
                      className="h-4 w-6 shrink-0 rounded-[2px] object-cover"
                    />
                    <span className="flex min-w-0 flex-col leading-tight">
                      <span className="truncate" title={name}>{name}</span>
                      <span className="text-caption font-normal text-fg-muted">
                        {tf("nav.groupTab", { letter: entry.groupLetter })}
                      </span>
                    </span>
                  </span>
                </th>
                <td className={cn("px-2 py-2 text-center tabular-nums", bg)}>{entry.played}</td>
                <td className={cn("px-2 py-2 text-center tabular-nums", bg)}>{formatSigned(entry.goalDifference)}</td>
                <td className={cn("px-2 py-2 text-center tabular-nums", bg)}>{entry.goalsFor}</td>
                <td className={cn("px-2 py-2 text-center font-bold tabular-nums", bg)}>{entry.points}</td>
                <td className={cn("px-2 py-2", bg)}>
                  <span className="inline-flex flex-wrap items-center gap-1.5">
                    <Badge variant={entry.qualified ? "success" : "danger"}>
                      {entry.qualified ? t("status.qualified") : t("status.eliminated")}
                    </Badge>
                    {entry.isProvisional ? (
                      <span title={t("status.provisional.tooltip")} className="text-caption text-fg-muted">
                        {t("status.provisional")}
                      </span>
                    ) : null}
                    {isCutoff ? <span className="sr-only">{t("groups.bestThirds.cutoff")}</span> : null}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
