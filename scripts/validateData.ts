/**
 * Gerbang kualitas data statis — Platform Statistik Piala Dunia FIFA 2026.
 *
 * Acuan PRD: Bab 4.3 (Integritas Data & Aturan Validasi), dengan Bab 4.1 (kontrak
 * tipe), Bab 4.2 (contoh JSON), dan Bab 6.4 (adu penalti & gol bunuh diri).
 * Arti field mengikuti docs/data-conventions.md.
 *
 * Jalankan:
 *   npm run validate
 *   npm run validate -- --strict
 *   npm run validate -- --data-dir <folder>
 *
 * Skrip ini HANYA membaca. Ia tidak pernah mengubah berkas data.
 * Semua JSON dibaca sebagai `unknown`, dipersempit dengan type guard ke tipe
 * dari "@/types", dan tidak ada `any` di mana pun.
 */

import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, resolve, sep } from "node:path";
import type {
  GroupLetter,
  Match,
  MatchEvent,
  MatchStage,
  Player,
  Team,
} from "@/types";

// ---------------------------------------------------------------------------
// Katalog kode temuan
// ---------------------------------------------------------------------------

interface CodeInfo {
  readonly code: string;
  readonly title: string;
}

/** Awalan "E-" = ERROR (data pasti salah), "W-" = WARNING (mencurigakan/belum lengkap). */
const CODE_CATALOG: readonly CodeInfo[] = [
  { code: "E-STR-001", title: "Berkas tidak ditemukan, tidak terbaca, atau bukan JSON valid" },
  { code: "E-STR-002", title: "Isi berkas bukan array" },
  { code: "E-STR-003", title: "Elemen tidak sesuai tipe Team / Player / Match" },
  { code: "E-STR-004", title: "Event di dalam laga tidak sesuai tipe MatchEvent" },
  { code: "W-STR-001", title: "Field tambahan yang tidak ada di kontrak tipe" },

  { code: "E-FK-001", title: "players.json: teamId tidak ada di teams.json" },
  { code: "E-FK-002", title: "matches.json: homeTeamId/awayTeamId tidak ada di teams.json dan bukan placeholder resmi" },
  { code: "E-FK-003", title: "Placeholder bracket dipakai pada laga fase grup" },
  { code: "E-FK-004", title: "event.playerId tidak ada di players.json" },
  { code: "E-FK-005", title: "event.relatedPlayerId tidak ada di players.json" },
  { code: "E-FK-006", title: "event.teamId tidak ada di teams.json" },

  { code: "E-PH-001", title: "Placeholder W-Mnnn / L-Mnnn merujuk laga yang tidak ada atau bukan laga yang lebih awal" },
  { code: "E-PH-002", title: "Pola placeholder tidak diizinkan pada fase laga tersebut" },

  { code: "E-ID-001", title: "id tim tidak unik" },
  { code: "E-ID-002", title: "id pemain tidak unik" },
  { code: "E-ID-003", title: "id laga tidak unik" },
  { code: "E-ID-004", title: "id event tidak unik (harus unik global di seluruh laga)" },

  { code: "E-FMT-001", title: "id tim bukan 3 huruf kapital" },
  { code: "E-FMT-002", title: "id pemain tidak sesuai pola PL-XXX-NN" },
  { code: "E-FMT-003", title: "id laga tidak sesuai pola M-NNN (001–104)" },
  { code: "E-FMT-004", title: "id event tidak sesuai pola E-NNNN" },
  { code: "E-FMT-005", title: "id pemain tidak cocok dengan teamId dan nomor punggungnya" },
  { code: "E-FMT-006", title: "Team.code tidak sama dengan Team.id" },

  { code: "E-CNT-001", title: "Jumlah tim bukan 48" },
  { code: "E-CNT-002", title: "Jumlah laga bukan 104" },
  { code: "E-CNT-003", title: "Susunan grup bukan 12 grup (A–L) x 4 tim" },
  { code: "E-CNT-004", title: "Jumlah laga per fase tidak sesuai 72/16/8/4/2/1/1" },

  { code: "E-TIME-001", title: "kickoffTime bukan format ISO UTC berakhiran Z (YYYY-MM-DDTHH:mm:ssZ)" },
  { code: "E-TIME-002", title: "kickoffTime berpola benar tetapi bukan tanggal/jam yang valid" },

  { code: "E-STAT-001", title: "player.stats memuat angka bukan 0 (statistik hanya boleh hasil kalkulasi)" },

  { code: "E-PLR-001", title: "Nomor punggung ganda di dalam satu tim" },
  { code: "E-PLR-002", title: "Nomor punggung bukan bilangan bulat 1–99" },

  { code: "E-GRP-001", title: "Tim fase grup tidak bermain tepat 3 laga" },
  { code: "E-GRP-002", title: "Pasangan tim yang sama bertemu lebih dari sekali di fase grup" },
  { code: "E-GRP-003", title: "Tim pada laga grup bukan anggota grup laga tersebut" },
  { code: "E-GRP-004", title: "Matchday tim fase grup bukan tepat 1, 2, dan 3" },

  { code: "E-MTC-001", title: "homeTeamId sama dengan awayTeamId" },
  { code: "E-MTC-002", title: "Skor adu penalti ada pada laga fase grup" },
  { code: "E-MTC-003", title: "Skor adu penalti tidak berpasangan atau bukan bilangan bulat >= 0" },
  { code: "E-MTC-004", title: "Skor adu penalti ada tetapi skor laga tidak seri, atau kedua skor penalti sama" },
  { code: "E-MTC-005", title: "groupLetter/matchday tidak konsisten dengan fase laga" },
  { code: "E-MTC-006", title: "Laga dengan placeholder dilarang selesai, bernilai bukan 0-0, atau punya event/penalti" },
  { code: "E-MTC-007", title: "Skor laga bukan bilangan bulat >= 0" },
  { code: "E-MTC-008", title: "Laga belum selesai tetapi skor bukan 0-0 atau sudah punya event/penalti" },
  { code: "E-MTC-009", title: "Laga fase gugur selesai seri tanpa adu penalti (tidak ada pemenang)" },

  { code: "E-EVT-001", title: "event.teamId bukan salah satu dari dua tim laga" },
  { code: "E-EVT-002", title: "event.playerId bukan milik tim event.teamId" },
  { code: "E-EVT-003", title: "minute bukan bilangan bulat 1–120" },
  { code: "E-EVT-004", title: "Laga fase grup memuat event dengan minute > 90" },
  { code: "E-EVT-005", title: "extraMinute tidak valid (harus bilangan bulat >= 1 dan minute 45/90/105/120)" },
  { code: "E-EVT-006", title: "relatedPlayerId ada/tidak ada tidak sesuai jenis event" },
  { code: "E-EVT-007", title: "relatedPlayerId sama dengan playerId atau berasal dari tim lain" },

  { code: "W-SCR-001", title: "Skor laga tidak sama dengan jumlah gol dari events" },

  { code: "E-AST-001", title: "flagUrl/photoUrl bukan path relatif berawalan / di dalam public/" },
  { code: "W-AST-001", title: "Berkas bendera belum ada di public/" },
  { code: "W-AST-002", title: "Berkas foto pemain belum ada di public/" },
  { code: "W-AST-003", title: "Berkas bendera lebih dari 5 KB" },
];

const CATEGORY_TITLES: ReadonlyArray<readonly [string, string]> = [
  ["STR", "Struktur & tipe berkas"],
  ["FK", "Relasi antar-berkas (foreign key)"],
  ["PH", "Placeholder bracket"],
  ["ID", "Keunikan id"],
  ["FMT", "Format id"],
  ["CNT", "Jumlah & komposisi data"],
  ["TIME", "Waktu kickoff"],
  ["STAT", "Statistik pemain"],
  ["PLR", "Data pemain"],
  ["GRP", "Fase grup"],
  ["MTC", "Pertandingan"],
  ["EVT", "Event pertandingan"],
  ["SCR", "Skor vs event"],
  ["AST", "Aset di public/"],
];

// ---------------------------------------------------------------------------
// Konstanta domain
// ---------------------------------------------------------------------------

const GROUP_LETTERS: readonly GroupLetter[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
const CONFEDERATIONS: readonly Team["confederation"][] = ["UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC", "OFC"];
const POSITIONS: readonly Player["position"][] = ["GK", "DF", "MF", "FW"];
const MATCHDAYS: readonly (1 | 2 | 3)[] = [1, 2, 3];
const STAGES: readonly MatchStage[] = [
  "GROUP_STAGE",
  "ROUND_OF_32",
  "ROUND_OF_16",
  "QUARTER_FINALS",
  "SEMI_FINALS",
  "THIRD_PLACE",
  "FINAL",
];
const EVENT_TYPES: readonly MatchEvent["type"][] = [
  "GOAL",
  "PENALTY_GOAL",
  "OWN_GOAL",
  "YELLOW_CARD",
  "RED_CARD",
  "SUBSTITUTION",
];
const STAT_KEYS: readonly (keyof Player["stats"])[] = [
  "appearances",
  "minutesPlayed",
  "goals",
  "assists",
  "yellowCards",
  "redCards",
];

const EXPECTED_TEAMS = 48;
const EXPECTED_MATCHES = 104;
const EXPECTED_PER_GROUP = 4;
const EXPECTED_PER_STAGE: Readonly<Record<MatchStage, number>> = {
  GROUP_STAGE: 72,
  ROUND_OF_32: 16,
  ROUND_OF_16: 8,
  QUARTER_FINALS: 4,
  SEMI_FINALS: 2,
  THIRD_PLACE: 1,
  FINAL: 1,
};
const MATCHES_PER_GROUP_TEAM = 3;
const WARNING_LIST_LIMIT = 10;
const MAX_FLAG_BYTES = 5 * 1024; // 5 KB = 5120 byte (asumsi: 1 KB = 1024 byte)
const EXTRA_MINUTE_BASES: readonly number[] = [45, 90, 105, 120];

const RE_TEAM_ID = /^[A-Z]{3}$/;
const RE_PLAYER_ID = /^PL-([A-Z]{3})-(\d{2})$/;
const RE_MATCH_ID = /^M-(\d{3})$/;
const RE_EVENT_ID = /^E-\d{4,}$/;
const RE_KICKOFF = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

// Placeholder bracket resmi (docs/data-conventions.md bagian 10.1)
const RE_PH_GROUP_POSITION = /^[12][A-L]$/;
const RE_PH_THIRD = /^3rd-[A-L]{2,8}$/;
const RE_PH_WINNER = /^W-M(\d{3})$/;
const RE_PH_LOSER = /^L-M(\d{3})$/;

const isPlaceholder = (v: string): boolean =>
  RE_PH_GROUP_POSITION.test(v) || RE_PH_THIRD.test(v) || RE_PH_WINNER.test(v) || RE_PH_LOSER.test(v);

// ---------------------------------------------------------------------------
// Util umum
// ---------------------------------------------------------------------------

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function nonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim() !== "";
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function oneOf<T extends string | number>(list: readonly T[], v: unknown): v is T {
  return list.some((x) => x === v);
}

function show(v: unknown): string {
  return v === undefined ? "(tidak ada)" : JSON.stringify(v);
}

function pad(n: number, width: number): string {
  return String(n).padStart(width, "0");
}

function matchNumber(id: string): number {
  const m = RE_MATCH_ID.exec(id);
  return m ? Number(m[1]) : Number.NaN;
}

// ---------------------------------------------------------------------------
// Pengumpul temuan
// ---------------------------------------------------------------------------

type Severity = "ERROR" | "WARNING";

interface Finding {
  readonly code: string;
  readonly severity: Severity;
  readonly file: string;
  readonly location: string;
  readonly message: string;
}

const findings: Finding[] = [];
const knownCodes = new Set(CODE_CATALOG.map((c) => c.code));

function report(code: string, file: string, location: string, message: string): void {
  if (!knownCodes.has(code)) {
    throw new Error(`Kode temuan tidak terdaftar di CODE_CATALOG: ${code}`);
  }
  findings.push({ code, severity: code.startsWith("W-") ? "WARNING" : "ERROR", file, location, message });
}

// ---------------------------------------------------------------------------
// Argumen CLI
// ---------------------------------------------------------------------------

interface Options {
  dataDir: string;
  publicDir: string;
  knownGapsPath: string;
  strict: boolean;
  verbose: boolean;
  help: boolean;
  listCodes: boolean;
}

const USAGE = `Penggunaan: npm run validate -- [opsi]

Opsi:
  --data-dir <path>     Folder berisi teams.json, players.json, matches.json (default: src/data)
  --strict              Semua WARNING diperlakukan sebagai ERROR (kode keluar 1)
  --public-dir <path>   Folder aset statis untuk cek bendera/foto (default: public)
  --known-gaps <path>   Berkas pengecualian skor (default: docs/known-gaps.md)
  --verbose             Tampilkan semua WARNING (default: maksimal ${WARNING_LIST_LIMIT} per kode)
  --list-codes          Cetak daftar kode temuan lalu keluar
  --help                Tampilkan bantuan ini

Kode keluar: 0 = lolos, 1 = ada ERROR (atau WARNING saat --strict), 2 = salah penggunaan/kesalahan internal.`;

function parseArgs(argv: readonly string[]): Options | string {
  const opts: Options = {
    dataDir: "src/data",
    publicDir: "public",
    knownGapsPath: "docs/known-gaps.md",
    strict: false,
    verbose: false,
    help: false,
    listCodes: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const eq = arg.indexOf("=");
    const name = eq === -1 ? arg : arg.slice(0, eq);
    const inline = eq === -1 ? undefined : arg.slice(eq + 1);
    const takeValue = (): string | undefined => {
      if (inline !== undefined) return inline === "" ? undefined : inline;
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) return undefined;
      i++;
      return next;
    };
    switch (name) {
      case "--strict":
        opts.strict = true;
        break;
      case "--verbose":
        opts.verbose = true;
        break;
      case "--help":
      case "-h":
        opts.help = true;
        break;
      case "--list-codes":
        opts.listCodes = true;
        break;
      case "--data-dir":
      case "--public-dir":
      case "--known-gaps": {
        const value = takeValue();
        if (value === undefined) return `Opsi ${name} membutuhkan sebuah nilai (path).`;
        if (name === "--data-dir") opts.dataDir = value;
        else if (name === "--public-dir") opts.publicDir = value;
        else opts.knownGapsPath = value;
        break;
      }
      default:
        return `Opsi tidak dikenal: ${arg}`;
    }
  }
  return opts;
}

// ---------------------------------------------------------------------------
// Membaca JSON & type guard (JSON -> unknown -> tipe @/types)
// ---------------------------------------------------------------------------

type ReadResult = { readonly ok: true; readonly items: unknown[] } | { readonly ok: false };

function readJsonArray(dir: string, file: string): ReadResult {
  const path = resolve(dir, file);
  let text: string;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    report("E-STR-001", file, "(berkas)", `Berkas tidak ditemukan atau tidak bisa dibaca: ${path}`);
    return { ok: false };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    report("E-STR-001", file, "(berkas)", `Bukan JSON yang valid: ${detail}`);
    return { ok: false };
  }
  if (!Array.isArray(parsed)) {
    report("E-STR-002", file, "(akar JSON)", "Isi berkas harus berupa array.");
    return { ok: false };
  }
  const items: unknown[] = parsed;
  return { ok: true, items };
}

function teamProblems(x: unknown): string[] {
  if (!isRecord(x)) return ["elemen bukan objek"];
  const p: string[] = [];
  if (!nonEmptyString(x.id)) p.push(`id harus string tidak kosong, dapat ${show(x.id)}`);
  if (!nonEmptyString(x.name)) p.push(`name harus string tidak kosong, dapat ${show(x.name)}`);
  if (!nonEmptyString(x.code)) p.push(`code harus string tidak kosong, dapat ${show(x.code)}`);
  if (!nonEmptyString(x.flagUrl)) p.push(`flagUrl harus string tidak kosong, dapat ${show(x.flagUrl)}`);
  if (!oneOf(GROUP_LETTERS, x.groupLetter)) p.push(`groupLetter harus A–L, dapat ${show(x.groupLetter)}`);
  if (!oneOf(CONFEDERATIONS, x.confederation)) {
    p.push(`confederation harus salah satu ${CONFEDERATIONS.join("/")}, dapat ${show(x.confederation)}`);
  }
  return p;
}
const isTeam = (x: unknown): x is Team => teamProblems(x).length === 0;

function playerProblems(x: unknown): string[] {
  if (!isRecord(x)) return ["elemen bukan objek"];
  const p: string[] = [];
  if (!nonEmptyString(x.id)) p.push(`id harus string tidak kosong, dapat ${show(x.id)}`);
  if (!nonEmptyString(x.teamId)) p.push(`teamId harus string tidak kosong, dapat ${show(x.teamId)}`);
  if (!nonEmptyString(x.name)) p.push(`name harus string tidak kosong, dapat ${show(x.name)}`);
  if (!nonEmptyString(x.shortName)) p.push(`shortName harus string tidak kosong, dapat ${show(x.shortName)}`);
  if (!isFiniteNumber(x.shirtNumber)) p.push(`shirtNumber harus angka, dapat ${show(x.shirtNumber)}`);
  if (!oneOf(POSITIONS, x.position)) p.push(`position harus GK/DF/MF/FW, dapat ${show(x.position)}`);
  if (!nonEmptyString(x.photoUrl)) p.push(`photoUrl harus string tidak kosong, dapat ${show(x.photoUrl)}`);
  if (!isRecord(x.stats)) {
    p.push("stats harus objek");
  } else {
    for (const key of STAT_KEYS) {
      if (!isFiniteNumber(x.stats[key])) p.push(`stats.${key} harus angka, dapat ${show(x.stats[key])}`);
    }
  }
  return p;
}
const isPlayer = (x: unknown): x is Player => playerProblems(x).length === 0;

function eventProblems(x: unknown): string[] {
  if (!isRecord(x)) return ["elemen bukan objek"];
  const p: string[] = [];
  if (!nonEmptyString(x.id)) p.push(`id harus string tidak kosong, dapat ${show(x.id)}`);
  if (!isFiniteNumber(x.minute)) p.push(`minute harus angka, dapat ${show(x.minute)}`);
  if (x.extraMinute !== undefined && !isFiniteNumber(x.extraMinute)) {
    p.push(`extraMinute harus angka bila ada, dapat ${show(x.extraMinute)}`);
  }
  if (!oneOf(EVENT_TYPES, x.type)) p.push(`type tidak dikenal: ${show(x.type)}`);
  if (!nonEmptyString(x.teamId)) p.push(`teamId harus string tidak kosong, dapat ${show(x.teamId)}`);
  if (!nonEmptyString(x.playerId)) p.push(`playerId harus string tidak kosong, dapat ${show(x.playerId)}`);
  if (x.relatedPlayerId !== undefined && !nonEmptyString(x.relatedPlayerId)) {
    p.push(`relatedPlayerId harus string tidak kosong bila ada, dapat ${show(x.relatedPlayerId)}`);
  }
  return p;
}
const isMatchEvent = (x: unknown): x is MatchEvent => eventProblems(x).length === 0;

/** Bentuk Match tanpa `events`; events divalidasi satu per satu terpisah. */
type MatchHead = Omit<Match, "events">;

function matchHeadProblems(x: unknown): string[] {
  if (!isRecord(x)) return ["elemen bukan objek"];
  const p: string[] = [];
  if (!nonEmptyString(x.id)) p.push(`id harus string tidak kosong, dapat ${show(x.id)}`);
  if (!oneOf(STAGES, x.stage)) p.push(`stage tidak dikenal: ${show(x.stage)}`);
  if (x.groupLetter !== undefined && !oneOf(GROUP_LETTERS, x.groupLetter)) {
    p.push(`groupLetter harus A–L bila ada, dapat ${show(x.groupLetter)}`);
  }
  if (x.matchday !== undefined && !oneOf(MATCHDAYS, x.matchday)) {
    p.push(`matchday harus 1, 2, atau 3 bila ada, dapat ${show(x.matchday)}`);
  }
  if (typeof x.kickoffTime !== "string") p.push(`kickoffTime harus string, dapat ${show(x.kickoffTime)}`);
  if (!nonEmptyString(x.venue)) p.push(`venue harus string tidak kosong, dapat ${show(x.venue)}`);
  if (!nonEmptyString(x.homeTeamId)) p.push(`homeTeamId harus string tidak kosong, dapat ${show(x.homeTeamId)}`);
  if (!nonEmptyString(x.awayTeamId)) p.push(`awayTeamId harus string tidak kosong, dapat ${show(x.awayTeamId)}`);
  if (!isFiniteNumber(x.homeScore)) p.push(`homeScore harus angka, dapat ${show(x.homeScore)}`);
  if (!isFiniteNumber(x.awayScore)) p.push(`awayScore harus angka, dapat ${show(x.awayScore)}`);
  if (x.homePenaltyScore !== undefined && !isFiniteNumber(x.homePenaltyScore)) {
    p.push(`homePenaltyScore harus angka bila ada, dapat ${show(x.homePenaltyScore)}`);
  }
  if (x.awayPenaltyScore !== undefined && !isFiniteNumber(x.awayPenaltyScore)) {
    p.push(`awayPenaltyScore harus angka bila ada, dapat ${show(x.awayPenaltyScore)}`);
  }
  if (typeof x.isFinished !== "boolean") p.push(`isFinished harus boolean, dapat ${show(x.isFinished)}`);
  if (!Array.isArray(x.events)) p.push("events harus array");
  return p;
}
const isMatchHead = (x: unknown): x is MatchHead & { events: unknown[] } => matchHeadProblems(x).length === 0;

const TEAM_KEYS = ["id", "name", "code", "flagUrl", "groupLetter", "confederation"];
const PLAYER_KEYS = ["id", "teamId", "name", "shortName", "shirtNumber", "position", "photoUrl", "stats"];
const MATCH_KEYS = [
  "id", "stage", "groupLetter", "matchday", "kickoffTime", "venue", "homeTeamId", "awayTeamId",
  "homeScore", "awayScore", "homePenaltyScore", "awayPenaltyScore", "isFinished", "events",
];
const EVENT_KEYS = ["id", "minute", "extraMinute", "type", "teamId", "playerId", "relatedPlayerId"];

function warnExtraKeys(file: string, location: string, obj: Record<string, unknown>, allowed: readonly string[]): void {
  const extra = Object.keys(obj).filter((k) => !allowed.includes(k));
  if (extra.length > 0) {
    report("W-STR-001", file, location, `Field di luar kontrak tipe: ${extra.join(", ")}.`);
  }
}

interface Indexed<T> {
  readonly item: T;
  readonly index: number;
}

interface MatchView {
  readonly match: Match;
  readonly index: number;
  /** eventIndexes[i] = indeks asli events[i] di berkas (event rusak dilewati). */
  readonly eventIndexes: readonly number[];
}

function idLabel(raw: unknown, index: number): string {
  const id = isRecord(raw) && typeof raw.id === "string" ? raw.id : undefined;
  return id === undefined ? `indeks ${index}` : `${id} (indeks ${index})`;
}

function partition<T>(
  file: string,
  items: readonly unknown[],
  problemsOf: (x: unknown) => string[],
  guard: (x: unknown) => x is T,
  allowedKeys: readonly string[],
): Indexed<T>[] {
  const valid: Indexed<T>[] = [];
  items.forEach((raw, index) => {
    if (guard(raw)) {
      valid.push({ item: raw, index });
      if (isRecord(raw)) warnExtraKeys(file, idLabel(raw, index), raw, allowedKeys);
    } else {
      report("E-STR-003", file, idLabel(raw, index), `Tidak sesuai tipe: ${problemsOf(raw).join("; ")}.`);
    }
  });
  return valid;
}

function loadMatches(file: string, items: readonly unknown[]): MatchView[] {
  const views: MatchView[] = [];
  items.forEach((raw, index) => {
    if (!isMatchHead(raw)) {
      report("E-STR-003", file, idLabel(raw, index), `Tidak sesuai tipe Match: ${matchHeadProblems(raw).join("; ")}.`);
      return;
    }
    if (isRecord(raw)) warnExtraKeys(file, idLabel(raw, index), raw, MATCH_KEYS);
    const events: MatchEvent[] = [];
    const eventIndexes: number[] = [];
    raw.events.forEach((rawEvent, eventIndex) => {
      if (isMatchEvent(rawEvent)) {
        events.push(rawEvent);
        eventIndexes.push(eventIndex);
        if (isRecord(rawEvent)) {
          warnExtraKeys(file, `${raw.id} > ${rawEvent.id} (indeks ${eventIndex})`, rawEvent, EVENT_KEYS);
        }
      } else {
        report(
          "E-STR-004",
          file,
          `${raw.id} > ${idLabel(rawEvent, eventIndex)}`,
          `Event tidak sesuai tipe MatchEvent: ${eventProblems(rawEvent).join("; ")}.`,
        );
      }
    });
    views.push({ match: { ...raw, events }, index, eventIndexes });
  });
  return views;
}

// ---------------------------------------------------------------------------
// Pengecualian skor dari docs/known-gaps.md
// ---------------------------------------------------------------------------

interface ScoreExceptions {
  readonly ids: ReadonlySet<string>;
  readonly note: string;
}

/**
 * Hanya bagian berjudul "Pengecualian skor" yang dibaca. Tabel "Per laga" dan
 * daftar kekurangan lain di known-gaps.md TIDAK dianggap pengecualian, karena
 * itu mendaftar assist/kartu yang hilang, bukan selisih skor vs event.
 */
function loadScoreExceptions(path: string): ScoreExceptions {
  let text: string;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    return { ids: new Set(), note: `${path} tidak ditemukan; tidak ada pengecualian` };
  }
  const ids = new Set<string>();
  let level = 0;
  for (const line of text.split(/\r?\n/)) {
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const depth = heading[1].length;
      if (/pengecualian\s+skor/i.test(heading[2])) {
        level = depth;
      } else if (level !== 0 && depth <= level) {
        level = 0;
      }
      continue;
    }
    if (level !== 0) {
      for (const m of line.matchAll(/\bM-\d{3}\b/g)) ids.add(m[0]);
    }
  }
  const note =
    ids.size === 0
      ? `${path}: tidak ada bagian "Pengecualian skor"; 0 laga dikecualikan`
      : `${path}: ${ids.size} laga dikecualikan`;
  return { ids, note };
}

// ---------------------------------------------------------------------------
// Pengecekan
// ---------------------------------------------------------------------------

interface Data {
  readonly teamsRaw: readonly unknown[];
  readonly playersRaw: readonly unknown[];
  readonly matchesRaw: readonly unknown[];
  readonly teams: readonly Indexed<Team>[];
  readonly players: readonly Indexed<Player>[];
  readonly matches: readonly MatchView[];
  /** Semua id (string) pada berkas mentah, termasuk elemen yang bentuknya rusak. */
  readonly teamIds: ReadonlySet<string>;
  readonly playerIds: ReadonlySet<string>;
  readonly matchIds: ReadonlySet<string>;
  readonly teamById: ReadonlyMap<string, Team>;
  readonly playerById: ReadonlyMap<string, Player>;
}

function rawIds(items: readonly unknown[]): Set<string> {
  const out = new Set<string>();
  for (const it of items) if (isRecord(it) && typeof it.id === "string") out.add(it.id);
  return out;
}

function checkUniqueIds(file: string, items: readonly unknown[], code: string, label: string): void {
  const seen = new Map<string, number>();
  items.forEach((it, index) => {
    if (!isRecord(it) || typeof it.id !== "string") return;
    const first = seen.get(it.id);
    if (first === undefined) {
      seen.set(it.id, index);
    } else {
      report(code, file, `${it.id} (indeks ${index})`, `id ${label} "${it.id}" sudah dipakai di indeks ${first}.`);
    }
  });
}

function checkEventIdsUnique(file: string, matchesRaw: readonly unknown[]): void {
  const seen = new Map<string, string>();
  for (const m of matchesRaw) {
    if (!isRecord(m) || !Array.isArray(m.events)) continue;
    const matchId = typeof m.id === "string" ? m.id : "(tanpa id)";
    m.events.forEach((e: unknown, index: number) => {
      if (!isRecord(e) || typeof e.id !== "string") return;
      const where = `${matchId} > ${e.id} (indeks ${index})`;
      const first = seen.get(e.id);
      if (first === undefined) {
        seen.set(e.id, where);
      } else {
        report("E-ID-004", file, where, `id event "${e.id}" sudah dipakai di ${first}.`);
      }
    });
  }
}

function checkCounts(d: Data): void {
  if (d.teamsRaw.length !== EXPECTED_TEAMS) {
    report("E-CNT-001", "teams.json", "(jumlah)", `Jumlah tim harus ${EXPECTED_TEAMS}, dapat ${d.teamsRaw.length}.`);
  }
  if (d.matchesRaw.length !== EXPECTED_MATCHES) {
    report("E-CNT-002", "matches.json", "(jumlah)", `Jumlah laga harus ${EXPECTED_MATCHES}, dapat ${d.matchesRaw.length}.`);
  }
  const perGroup = new Map<string, number>();
  for (const t of d.teamsRaw) {
    if (isRecord(t) && oneOf(GROUP_LETTERS, t.groupLetter)) {
      perGroup.set(t.groupLetter, (perGroup.get(t.groupLetter) ?? 0) + 1);
    }
  }
  for (const letter of GROUP_LETTERS) {
    const n = perGroup.get(letter) ?? 0;
    if (n !== EXPECTED_PER_GROUP) {
      report("E-CNT-003", "teams.json", `Grup ${letter}`, `Grup ${letter} harus berisi ${EXPECTED_PER_GROUP} tim, dapat ${n}.`);
    }
  }
  const perStage = new Map<string, number>();
  for (const m of d.matchesRaw) {
    if (isRecord(m) && oneOf(STAGES, m.stage)) perStage.set(m.stage, (perStage.get(m.stage) ?? 0) + 1);
  }
  for (const stage of STAGES) {
    const n = perStage.get(stage) ?? 0;
    if (n !== EXPECTED_PER_STAGE[stage]) {
      report("E-CNT-004", "matches.json", `Fase ${stage}`, `Fase ${stage} harus ${EXPECTED_PER_STAGE[stage]} laga, dapat ${n}.`);
    }
  }
}

function checkTeams(d: Data): void {
  checkUniqueIds("teams.json", d.teamsRaw, "E-ID-001", "tim");
  for (const { item: t, index } of d.teams) {
    const loc = `${t.id} (indeks ${index})`;
    if (!RE_TEAM_ID.test(t.id)) report("E-FMT-001", "teams.json", loc, `id tim harus 3 huruf kapital A–Z, dapat "${t.id}".`);
    if (t.code !== t.id) report("E-FMT-006", "teams.json", loc, `code "${t.code}" harus sama dengan id "${t.id}".`);
  }
}

function isAssetPath(url: string): boolean {
  return url.startsWith("/") && !url.startsWith("//") && !url.includes("://") && !url.split("/").includes("..");
}

function checkPlayers(d: Data): void {
  const file = "players.json";
  checkUniqueIds(file, d.playersRaw, "E-ID-002", "pemain");
  const shirtOwner = new Map<string, string>();
  for (const { item: p, index } of d.players) {
    const loc = `${p.id} (indeks ${index})`;

    if (!d.teamIds.has(p.teamId)) {
      report("E-FK-001", file, loc, `teamId "${p.teamId}" tidak ada di teams.json.`);
    }

    const idMatch = RE_PLAYER_ID.exec(p.id);
    if (!idMatch) {
      report("E-FMT-002", file, loc, `id pemain harus berpola PL-XXX-NN (contoh PL-ARG-10), dapat "${p.id}".`);
    } else if (Number.isInteger(p.shirtNumber)) {
      const expected = `PL-${p.teamId}-${pad(p.shirtNumber, 2)}`;
      if (p.id !== expected) {
        report("E-FMT-005", file, loc, `id harus "${expected}" menurut teamId "${p.teamId}" dan shirtNumber ${p.shirtNumber}.`);
      }
    }

    if (!Number.isInteger(p.shirtNumber) || p.shirtNumber < 1 || p.shirtNumber > 99) {
      report("E-PLR-002", file, loc, `shirtNumber harus bilangan bulat 1–99, dapat ${show(p.shirtNumber)}.`);
    } else {
      const key = `${p.teamId}|${p.shirtNumber}`;
      const owner = shirtOwner.get(key);
      if (owner === undefined) shirtOwner.set(key, p.id);
      else report("E-PLR-001", file, loc, `Nomor punggung ${p.shirtNumber} di tim ${p.teamId} sudah dipakai ${owner}.`);
    }

    const nonZero = STAT_KEYS.filter((k) => p.stats[k] !== 0).map((k) => `${k}=${p.stats[k]}`);
    if (nonZero.length > 0) {
      report("E-STAT-001", file, loc, `stats harus 0 semua (statistik hanya hasil kalkulasi), dapat: ${nonZero.join(", ")}.`);
    }
  }
}

interface PlaceholderRule {
  readonly stages: readonly MatchStage[];
  readonly describe: string;
}

function checkPlaceholder(file: string, loc: string, side: string, value: string, v: MatchView, d: Data): void {
  const m = v.match;
  let rule: PlaceholderRule;
  let refId: string | undefined;
  let mustBeSemi = false;

  if (RE_PH_GROUP_POSITION.test(value) || RE_PH_THIRD.test(value)) {
    rule = { stages: ["ROUND_OF_32"], describe: "hanya boleh di ROUND_OF_32" };
  } else if (RE_PH_WINNER.test(value)) {
    rule = { stages: ["ROUND_OF_16", "QUARTER_FINALS", "SEMI_FINALS", "FINAL"], describe: "hanya boleh di ROUND_OF_16, QUARTER_FINALS, SEMI_FINALS, atau FINAL" };
    refId = `M-${value.slice(3)}`;
  } else {
    rule = { stages: ["THIRD_PLACE"], describe: "hanya boleh di THIRD_PLACE" };
    refId = `M-${value.slice(3)}`;
    mustBeSemi = true;
  }

  if (!rule.stages.includes(m.stage)) {
    report("E-PH-002", file, loc, `${side} "${value}" ${rule.describe}, tetapi laga ini berfase ${m.stage}.`);
  }
  if (refId !== undefined) {
    if (!d.matchIds.has(refId)) {
      report("E-PH-001", file, loc, `${side} "${value}" merujuk laga ${refId} yang tidak ada di matches.json.`);
    } else if (!(matchNumber(refId) < matchNumber(m.id))) {
      report("E-PH-001", file, loc, `${side} "${value}" harus merujuk laga bernomor lebih kecil dari ${m.id}.`);
    } else if (mustBeSemi) {
      const ref = d.matches.find((x) => x.match.id === refId);
      if (ref !== undefined && ref.match.stage !== "SEMI_FINALS") {
        report("E-PH-002", file, loc, `${side} "${value}" harus merujuk laga SEMI_FINALS, tetapi ${refId} berfase ${ref.match.stage}.`);
      }
    }
  }
}

function checkMatchFields(d: Data): void {
  const file = "matches.json";
  checkUniqueIds(file, d.matchesRaw, "E-ID-003", "laga");
  checkEventIdsUnique(file, d.matchesRaw);

  for (const v of d.matches) {
    const m = v.match;
    const loc = `${m.id} (indeks ${v.index})`;
    const isGroup = m.stage === "GROUP_STAGE";

    // Format id & waktu
    const num = matchNumber(m.id);
    if (!(num >= 1 && num <= EXPECTED_MATCHES)) {
      report("E-FMT-003", file, loc, `id laga harus M-001 sampai M-104, dapat "${m.id}".`);
    }
    if (!RE_KICKOFF.test(m.kickoffTime)) {
      report("E-TIME-001", file, loc, `kickoffTime "${m.kickoffTime}" harus berformat YYYY-MM-DDTHH:mm:ssZ (UTC, berakhiran Z).`);
    } else {
      const t = new Date(m.kickoffTime);
      if (Number.isNaN(t.getTime()) || `${t.toISOString().slice(0, 19)}Z` !== m.kickoffTime) {
        report("E-TIME-002", file, loc, `kickoffTime "${m.kickoffTime}" bukan tanggal/jam yang valid.`);
      }
    }

    // Relasi tim & placeholder
    if (m.homeTeamId === m.awayTeamId) {
      report("E-MTC-001", file, loc, `homeTeamId dan awayTeamId sama-sama "${m.homeTeamId}".`);
    }
    let hasPlaceholder = false;
    for (const [side, value] of [["homeTeamId", m.homeTeamId], ["awayTeamId", m.awayTeamId]] as const) {
      if (d.teamIds.has(value)) continue;
      if (isPlaceholder(value)) {
        hasPlaceholder = true;
        if (isGroup) {
          report("E-FK-003", file, loc, `${side} "${value}" adalah placeholder bracket, tetapi laga ini fase grup.`);
        } else {
          checkPlaceholder(file, loc, side, value, v, d);
        }
      } else {
        report("E-FK-002", file, loc, `${side} "${value}" tidak ada di teams.json dan bukan placeholder resmi.`);
      }
    }

    // Skor & penalti
    const scores: [string, number | undefined][] = [
      ["homeScore", m.homeScore],
      ["awayScore", m.awayScore],
    ];
    for (const [name, value] of scores) {
      if (value === undefined || !Number.isInteger(value) || value < 0) {
        report("E-MTC-007", file, loc, `${name} harus bilangan bulat >= 0, dapat ${show(value)}.`);
      }
    }
    const hp = m.homePenaltyScore;
    const ap = m.awayPenaltyScore;
    const hasPenalty = hp !== undefined || ap !== undefined;
    if (hasPenalty) {
      if (isGroup) {
        report("E-MTC-002", file, loc, "Laga fase grup dilarang memiliki skor adu penalti.");
      }
      const valid = (n: number | undefined): boolean => n !== undefined && Number.isInteger(n) && n >= 0;
      if (!valid(hp) || !valid(ap)) {
        report("E-MTC-003", file, loc, `homePenaltyScore (${show(hp)}) dan awayPenaltyScore (${show(ap)}) harus berpasangan dan bilangan bulat >= 0.`);
      } else if (m.homeScore !== m.awayScore || hp === ap) {
        report("E-MTC-004", file, loc, `Adu penalti ${hp}-${ap} pada skor ${m.homeScore}-${m.awayScore}: skor laga harus seri dan skor penalti tidak boleh sama.`);
      }
    }
    if (!isGroup && m.isFinished && !hasPenalty && m.homeScore === m.awayScore) {
      report("E-MTC-009", file, loc, `Laga fase gugur selesai seri ${m.homeScore}-${m.awayScore} tanpa adu penalti.`);
    }

    // Konsistensi fase
    if (isGroup) {
      if (m.groupLetter === undefined || m.matchday === undefined) {
        report("E-MTC-005", file, loc, "Laga fase grup wajib memiliki groupLetter dan matchday.");
      }
    } else if (m.groupLetter !== undefined || m.matchday !== undefined) {
      report("E-MTC-005", file, loc, `Laga ${m.stage} dilarang memiliki groupLetter/matchday.`);
    }

    // Status selesai / placeholder
    const empty = m.homeScore === 0 && m.awayScore === 0 && m.events.length === 0 && !hasPenalty;
    if (hasPlaceholder && (m.isFinished || !empty)) {
      report("E-MTC-006", file, loc, "Laga dengan placeholder harus belum selesai, skor 0-0, tanpa event dan tanpa penalti.");
    } else if (!m.isFinished && !empty) {
      report("E-MTC-008", file, loc, `Laga belum selesai harus 0-0 tanpa event/penalti, dapat skor ${m.homeScore}-${m.awayScore}, ${m.events.length} event.`);
    }
  }
}

function checkGroupStage(d: Data): void {
  const file = "matches.json";
  const played = new Map<string, number>();
  const matchdays = new Map<string, number[]>();
  const pairs = new Map<string, string>();

  for (const v of d.matches) {
    const m = v.match;
    if (m.stage !== "GROUP_STAGE") continue;
    const loc = `${m.id} (indeks ${v.index})`;
    for (const id of [m.homeTeamId, m.awayTeamId]) {
      played.set(id, (played.get(id) ?? 0) + 1);
      if (m.matchday !== undefined) matchdays.set(id, [...(matchdays.get(id) ?? []), m.matchday]);
      const team = d.teamById.get(id);
      if (team !== undefined && m.groupLetter !== undefined && team.groupLetter !== m.groupLetter) {
        report("E-GRP-003", file, loc, `Tim ${id} berada di grup ${team.groupLetter}, bukan grup ${m.groupLetter} milik laga ini.`);
      }
    }
    const key = [m.homeTeamId, m.awayTeamId].sort().join("-");
    const first = pairs.get(key);
    if (first === undefined) pairs.set(key, m.id);
    else report("E-GRP-002", file, loc, `Pasangan ${key} sudah bertemu di ${first}.`);
  }

  for (const { item: t } of d.teams) {
    const n = played.get(t.id) ?? 0;
    if (n !== MATCHES_PER_GROUP_TEAM) {
      report("E-GRP-001", file, `Tim ${t.id}`, `Tim ${t.id} harus bermain tepat ${MATCHES_PER_GROUP_TEAM} laga fase grup, dapat ${n}.`);
    } else {
      const days = [...(matchdays.get(t.id) ?? [])].sort((a, b) => a - b).join(",");
      if (days !== "1,2,3") {
        report("E-GRP-004", file, `Tim ${t.id}`, `Matchday tim ${t.id} harus 1,2,3, dapat ${days === "" ? "(kosong)" : days}.`);
      }
    }
  }
}

function checkEvents(d: Data, exceptions: ScoreExceptions): void {
  const file = "matches.json";
  for (const v of d.matches) {
    const m = v.match;
    let goalsHome = 0;
    let goalsAway = 0;

    m.events.forEach((e, i) => {
      const eventIndex = v.eventIndexes[i];
      const loc = `${m.id} > ${e.id} (indeks ${eventIndex})`;

      if (!RE_EVENT_ID.test(e.id)) report("E-FMT-004", file, loc, `id event harus berpola E-NNNN (minimal 4 digit), dapat "${e.id}".`);

      if (!d.teamIds.has(e.teamId)) report("E-FK-006", file, loc, `teamId "${e.teamId}" tidak ada di teams.json.`);
      const inMatch = e.teamId === m.homeTeamId || e.teamId === m.awayTeamId;
      if (!inMatch) {
        report("E-EVT-001", file, loc, `teamId "${e.teamId}" bukan salah satu tim laga (${m.homeTeamId} vs ${m.awayTeamId}).`);
      }

      if (!d.playerIds.has(e.playerId)) {
        report("E-FK-004", file, loc, `playerId "${e.playerId}" tidak ada di players.json.`);
      } else {
        const player = d.playerById.get(e.playerId);
        if (player !== undefined && player.teamId !== e.teamId) {
          report("E-EVT-002", file, loc, `Pemain ${e.playerId} milik tim ${player.teamId}, bukan ${e.teamId}.`);
        }
      }

      if (e.relatedPlayerId !== undefined && !d.playerIds.has(e.relatedPlayerId)) {
        report("E-FK-005", file, loc, `relatedPlayerId "${e.relatedPlayerId}" tidak ada di players.json.`);
      }

      if (!Number.isInteger(e.minute) || e.minute < 1 || e.minute > 120) {
        report("E-EVT-003", file, loc, `minute harus bilangan bulat 1–120, dapat ${e.minute}.`);
      } else if (m.stage === "GROUP_STAGE" && e.minute > 90) {
        report("E-EVT-004", file, loc, `Laga fase grup tidak punya perpanjangan waktu, tetapi minute = ${e.minute}.`);
      }
      if (e.extraMinute !== undefined) {
        if (!Number.isInteger(e.extraMinute) || e.extraMinute < 1 || !EXTRA_MINUTE_BASES.includes(e.minute)) {
          report("E-EVT-005", file, loc, `extraMinute ${e.extraMinute} dengan minute ${e.minute} tidak valid (minute harus 45/90/105/120, extraMinute >= 1).`);
        }
      }

      const allowsRelated = e.type === "GOAL" || e.type === "SUBSTITUTION";
      if (e.type === "SUBSTITUTION" && e.relatedPlayerId === undefined) {
        report("E-EVT-006", file, loc, "SUBSTITUTION wajib memiliki relatedPlayerId (pemain yang keluar).");
      } else if (!allowsRelated && e.relatedPlayerId !== undefined) {
        report("E-EVT-006", file, loc, `${e.type} dilarang memiliki relatedPlayerId.`);
      }
      if (e.relatedPlayerId !== undefined) {
        const related = d.playerById.get(e.relatedPlayerId);
        if (e.relatedPlayerId === e.playerId) {
          report("E-EVT-007", file, loc, "relatedPlayerId tidak boleh sama dengan playerId.");
        } else if (related !== undefined && related.teamId !== e.teamId) {
          report("E-EVT-007", file, loc, `relatedPlayerId ${e.relatedPlayerId} milik tim ${related.teamId}, bukan ${e.teamId}.`);
        }
      }

      // Hitung gol untuk perbandingan skor (OWN_GOAL menguntungkan lawan).
      if (e.type === "GOAL" || e.type === "PENALTY_GOAL") {
        if (e.teamId === m.homeTeamId) goalsHome++;
        else if (e.teamId === m.awayTeamId) goalsAway++;
      } else if (e.type === "OWN_GOAL") {
        if (e.teamId === m.homeTeamId) goalsAway++;
        else if (e.teamId === m.awayTeamId) goalsHome++;
      }
    });

    if (m.isFinished && !exceptions.ids.has(m.id) && (goalsHome !== m.homeScore || goalsAway !== m.awayScore)) {
      report(
        "W-SCR-001",
        file,
        `${m.id} (indeks ${v.index})`,
        `Skor ${m.homeScore}-${m.awayScore} tidak sama dengan jumlah gol dari events ${goalsHome}-${goalsAway}.`,
      );
    }
  }
}

function checkAssets(d: Data, publicDir: string): void {
  const root = resolve(publicDir);
  const locate = (url: string): string | undefined => {
    if (!isAssetPath(url)) return undefined;
    const full = resolve(root, `.${url}`);
    return full === root || full.startsWith(root + sep) ? full : undefined;
  };

  for (const { item: t, index } of d.teams) {
    const loc = `${t.id} (indeks ${index})`;
    const full = locate(t.flagUrl);
    if (full === undefined) {
      report("E-AST-001", "teams.json", loc, `flagUrl "${t.flagUrl}" harus path relatif berawalan "/" di dalam public/.`);
    } else if (!existsSync(full) || !statSync(full).isFile()) {
      report("W-AST-001", "teams.json", loc, `Bendera belum ada: public${t.flagUrl}`);
    } else if (statSync(full).size > MAX_FLAG_BYTES) {
      report("W-AST-003", "teams.json", loc, `Bendera public${t.flagUrl} berukuran ${(statSync(full).size / 1024).toFixed(1)} KB (batas 5 KB).`);
    }
  }
  for (const { item: p, index } of d.players) {
    const loc = `${p.id} (indeks ${index})`;
    const full = locate(p.photoUrl);
    if (full === undefined) {
      report("E-AST-001", "players.json", loc, `photoUrl "${p.photoUrl}" harus path relatif berawalan "/" di dalam public/.`);
    } else if (!existsSync(full) || !statSync(full).isFile()) {
      report("W-AST-002", "players.json", loc, `Foto belum ada: public${p.photoUrl}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Laporan
// ---------------------------------------------------------------------------

function categoryOf(code: string): string {
  return code.split("-")[1] ?? "?";
}

interface Effective extends Finding {
  /** Tingkat setelah memperhitungkan --strict. */
  readonly level: Severity;
}

function printReport(opts: Options, data: { teams: number; players: number; matches: number } | undefined, exceptionNote: string): number {
  const effective: Effective[] = findings.map((f) => ({ ...f, level: opts.strict ? "ERROR" : f.severity }));
  const errors = effective.filter((f) => f.level === "ERROR");
  const warnings = effective.filter((f) => f.level === "WARNING");
  const promoted = opts.strict ? findings.filter((f) => f.severity === "WARNING").length : 0;

  const out: string[] = [];
  out.push("VALIDASI DATA PIALA DUNIA FIFA 2026");
  out.push(`Folder data     : ${opts.dataDir}`);
  out.push(`Folder public   : ${opts.publicDir}`);
  out.push(`Mode            : ${opts.strict ? "STRICT (WARNING dihitung sebagai ERROR)" : "normal"}`);
  if (data !== undefined) {
    out.push(`Isi data        : ${data.teams} tim, ${data.players} pemain, ${data.matches} laga`);
    out.push(`Pengecualian    : ${exceptionNote}`);
  }
  out.push("");

  out.push("RINGKASAN PER KATEGORI");
  out.push(`${"Kategori".padEnd(40)}${"ERROR".padStart(7)}${"WARNING".padStart(9)}`);
  for (const [key, title] of CATEGORY_TITLES) {
    const e = errors.filter((f) => categoryOf(f.code) === key).length;
    const w = warnings.filter((f) => categoryOf(f.code) === key).length;
    out.push(`${`${title} (${key})`.padEnd(40)}${String(e).padStart(7)}${String(w).padStart(9)}`);
  }
  out.push(`${"TOTAL".padEnd(40)}${String(errors.length).padStart(7)}${String(warnings.length).padStart(9)}`);
  if (promoted > 0) out.push(`(${promoted} dari ERROR di atas adalah WARNING yang dinaikkan oleh --strict)`);
  out.push("");

  const order = (a: Effective, b: Effective): number => (a.code < b.code ? -1 : a.code > b.code ? 1 : 0);
  const line = (f: Effective): string => `[${f.code}] ${f.file} > ${f.location}: ${f.message}`;

  out.push(`ERROR (${errors.length})`);
  if (errors.length === 0) out.push("  (tidak ada)");
  const sortedErrors = [...errors].sort(order);
  const shownCount = new Map<string, number>();
  let hidden = 0;
  for (const f of sortedErrors) {
    // ERROR asli tidak pernah disembunyikan; hanya WARNING yang dinaikkan --strict yang dipangkas.
    const limited = f.severity === "WARNING" && !opts.verbose;
    const n = (shownCount.get(f.code) ?? 0) + 1;
    shownCount.set(f.code, n);
    if (limited && n > WARNING_LIST_LIMIT) {
      hidden++;
      continue;
    }
    out.push(`  ${line(f)}`);
  }
  out.push("");

  out.push(`WARNING (${warnings.length})`);
  if (warnings.length === 0) out.push("  (tidak ada)");
  const shownWarn = new Map<string, number>();
  for (const f of [...warnings].sort(order)) {
    const n = (shownWarn.get(f.code) ?? 0) + 1;
    shownWarn.set(f.code, n);
    if (!opts.verbose && n > WARNING_LIST_LIMIT) {
      hidden++;
      continue;
    }
    out.push(`  ${line(f)}`);
  }
  if (hidden > 0) {
    out.push("");
    out.push(`(${hidden} temuan WARNING disembunyikan dari daftar, maksimal ${WARNING_LIST_LIMIT} per kode; jumlah di ringkasan tetap lengkap. Gunakan --verbose untuk menampilkan semuanya.)`);
  }
  out.push("");

  const failed = errors.length > 0;
  out.push(`HASIL: ${failed ? "GAGAL" : "LULUS"} — ${errors.length} ERROR, ${warnings.length} WARNING (kode keluar ${failed ? 1 : 0})`);
  console.log(out.join("\n"));
  return failed ? 1 : 0;
}

// ---------------------------------------------------------------------------
// Program utama
// ---------------------------------------------------------------------------

function main(): number {
  const parsed = parseArgs(process.argv.slice(2));
  if (typeof parsed === "string") {
    console.error(`${parsed}\n\n${USAGE}`);
    return 2;
  }
  const opts = parsed;
  if (opts.help) {
    console.log(USAGE);
    return 0;
  }
  if (opts.listCodes) {
    for (const c of CODE_CATALOG) console.log(`${c.code.padEnd(10)} ${c.title}`);
    return 0;
  }

  const teamsFile = readJsonArray(opts.dataDir, "teams.json");
  const playersFile = readJsonArray(opts.dataDir, "players.json");
  const matchesFile = readJsonArray(opts.dataDir, "matches.json");
  if (!teamsFile.ok || !playersFile.ok || !matchesFile.ok) {
    console.log("Pengecekan relasi dilewati karena ada berkas data yang tidak bisa dibaca.\n");
    return printReport(opts, undefined, "");
  }

  const teams = partition("teams.json", teamsFile.items, teamProblems, isTeam, TEAM_KEYS);
  const players = partition("players.json", playersFile.items, playerProblems, isPlayer, PLAYER_KEYS);
  const matches = loadMatches("matches.json", matchesFile.items);

  const data: Data = {
    teamsRaw: teamsFile.items,
    playersRaw: playersFile.items,
    matchesRaw: matchesFile.items,
    teams,
    players,
    matches,
    teamIds: rawIds(teamsFile.items),
    playerIds: rawIds(playersFile.items),
    matchIds: rawIds(matchesFile.items),
    teamById: new Map(teams.map((t) => [t.item.id, t.item])),
    playerById: new Map(players.map((p) => [p.item.id, p.item])),
  };
  const exceptions = loadScoreExceptions(opts.knownGapsPath);

  checkCounts(data);
  checkTeams(data);
  checkPlayers(data);
  checkMatchFields(data);
  checkGroupStage(data);
  checkEvents(data, exceptions);
  checkAssets(data, opts.publicDir);

  return printReport(
    opts,
    { teams: teamsFile.items.length, players: playersFile.items.length, matches: matchesFile.items.length },
    exceptions.note,
  );
}

try {
  process.exitCode = main();
} catch (e) {
  const detail = e instanceof Error ? (e.stack ?? e.message) : String(e);
  console.error(`Kesalahan internal pada ${basename(process.argv[1] ?? "validateData.ts")}:\n${detail}`);
  process.exitCode = 2;
}
