/**
 * MatchRow (Server Component: murni tampilan, tanpa state atau event).
 *
 * Acuan PRD: Bab 5.2 (MatchRow: kickoff atau FT, bendera Tim A vs Tim B, skor
 * tim pemenang berwarna hijau) dan Bab 5.4 (hover:scale-105 hanya untuk
 * elemen yang dapat diklik; baris ini tidak mengarah ke mana pun, jadi tidak
 * ada efek skala).
 *
 * Teks status dan skor memakai getMatchStatus dan formatScore dari
 * `@/utils/formatters`. Angka skor dirender per sisi supaya skor pemenang
 * bisa diberi warna hijau DAN huruf tebal (penanda non-warna) plus teks
 * sr-only "Pemenang".
 */
import { SafeImage } from "@/components/ui/SafeImage";
import { tf, t } from "@/content/microcopy";
import { cn } from "@/lib/utils";
import type { Match, Team } from "@/types";
import { formatScore, getMatchStatus } from "@/utils/formatters";

export interface MatchRowProps {
  match: Match;
  /** Tim kandang; bila tidak ada, id tim dipakai sebagai nama. */
  homeTeam?: Team;
  /** Tim tandang; bila tidak ada, id tim dipakai sebagai nama. */
  awayTeam?: Team;
  className?: string;
}

type Side = "home" | "away";

/**
 * Sisi pemenang untuk TAMPILAN (warna skor). Skor adu penalti dipakai bila
 * skor normal imbang dan skor penalti lengkap. Ini perbandingan angka yang
 * sudah ada pada data, bukan rumus klasemen.
 */
function getWinnerSide(match: Match): Side | null {
  if (!match.isFinished) return null;
  if (match.homeScore !== match.awayScore) {
    return match.homeScore > match.awayScore ? "home" : "away";
  }
  const { homePenaltyScore: hp, awayPenaltyScore: ap } = match;
  if (hp !== undefined && ap !== undefined && hp !== ap) {
    return hp > ap ? "home" : "away";
  }
  return null;
}

/** Bagian "(4-3 pen)" dari formatScore, atau null bila tidak ada adu penalti. */
function getPenaltyText(match: Match): string | null {
  const found = /\((\d+-\d+ pen)\)$/.exec(formatScore(match));
  return found ? found[1] : null;
}

interface TeamSideProps {
  side: Side;
  name: string;
  flagUrl: string | undefined;
}

function TeamSide({ side, name, flagUrl }: TeamSideProps) {
  const flag = (
    <SafeImage
      src={flagUrl ?? ""}
      alt={tf("aria.flag", { teamName: name })}
      width={20}
      height={14}
      fallbackType="flag"
      className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover"
    />
  );
  const label = (
    <span className="min-w-0 truncate text-body-sm font-medium" title={name}>
      {name}
    </span>
  );
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-1.5",
        side === "home" && "justify-end text-right",
      )}
    >
      {side === "home" ? (
        <>
          {label}
          {flag}
        </>
      ) : (
        <>
          {flag}
          {label}
        </>
      )}
    </div>
  );
}

export function MatchRow({ match, homeTeam, awayTeam, className }: MatchRowProps) {
  const homeName = homeTeam?.name ?? match.homeTeamId;
  const awayName = awayTeam?.name ?? match.awayTeamId;
  const status = getMatchStatus(match);
  const winner = getWinnerSide(match);
  const penalty = getPenaltyText(match);

  const scoreClass = (side: Side) =>
    cn(
      "font-display text-h3 tabular-nums",
      winner === side
        ? "font-bold text-success-fg"
        : "font-normal text-fg-secondary",
    );

  const summary = match.isFinished
    ? tf("aria.matchScore", {
        homeTeam: homeName,
        homeScore: match.homeScore,
        awayTeam: awayName,
        awayScore: match.awayScore,
      })
    : `${homeName} ${t("match.versus")} ${awayName}`;

  return (
    <div
      role="group"
      aria-label={summary}
      className={cn(
        "grid items-center gap-x-1.5 gap-y-1 rounded-lg border border-line bg-surface px-2.5 py-2 sm:gap-x-2 sm:px-3",
        // Laga selesai: "FT" pendek, tinggal satu kolom sempit di semua lebar.
        // Laga belum selesai: waktu kickoff panjang, jadi di layar sempit
        // diletakkan di baris sendiri di atas tim.
        match.isFinished
          ? "grid-cols-[1.5rem_minmax(0,1fr)_auto_minmax(0,1fr)] sm:grid-cols-[2rem_minmax(0,1fr)_auto_minmax(0,1fr)]"
          : "grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:grid-cols-[8.5rem_minmax(0,1fr)_auto_minmax(0,1fr)]",
        className,
      )}
    >
      <span
        title={match.isFinished ? t("status.fullTime.tooltip") : undefined}
        className={cn(
          "text-caption font-semibold text-fg-muted",
          !match.isFinished && "col-span-full sm:col-span-1",
        )}
      >
        {match.isFinished ? t("status.fullTime") : status}
      </span>

      <TeamSide side="home" name={homeName} flagUrl={homeTeam?.flagUrl} />

      <div className="flex min-w-[3rem] sm:min-w-[4.25rem] flex-col items-center leading-none">
        {match.isFinished ? (
          <span className="inline-flex items-baseline gap-1.5">
            <span className={scoreClass("home")}>
              {match.homeScore}
              {winner === "home" ? (
                <span className="sr-only"> ({t("status.winner")})</span>
              ) : null}
            </span>
            <span aria-hidden="true" className="text-fg-muted">
              –
            </span>
            <span className={scoreClass("away")}>
              {match.awayScore}
              {winner === "away" ? (
                <span className="sr-only"> ({t("status.winner")})</span>
              ) : null}
            </span>
          </span>
        ) : (
          <span className="text-body-sm font-semibold text-fg-muted">
            {t("match.versus")}
          </span>
        )}
        {penalty !== null ? (
          <span className="mt-1 text-caption text-fg-muted">{penalty}</span>
        ) : null}
      </div>

      <TeamSide side="away" name={awayName} flagUrl={awayTeam?.flagUrl} />
    </div>
  );
}
