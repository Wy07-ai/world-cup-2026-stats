import type { Match } from "@/types";

/**
 * Formatter tampilan untuk pertandingan. Semua fungsi di berkas ini murni:
 * tidak memutasi input, tidak membaca jam sistem (tanpa Date.now() atau
 * new Date() tanpa argumen), dan tidak bergantung pada zona waktu sistem.
 *
 * Aturan umum: input yang tidak valid TIDAK melempar error. Tempat kosong
 * ditampilkan sebagai string strip ("-"), kecuali dinyatakan lain.
 */

/** Teks pengganti untuk nilai yang tidak dapat ditampilkan. */
const PLACEHOLDER = "-";

const DEFAULT_LOCALE = "id-ID";
const DEFAULT_TIME_ZONE = "Asia/Jakarta";

const ISO_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/;

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

/**
 * Mengubah string ISO 8601 menjadi epoch milidetik, atau null bila tidak valid.
 *
 * Lebih ketat daripada Date.parse: wajib berformat lengkap dengan "Z" atau
 * offset eksplisit (format tanpa zona bergantung pada zona waktu sistem), dan
 * tanggal yang "meluber" seperti 2026-02-30 atau jam 24:00 ditolak.
 */
function parseIso(iso: unknown): number | null {
  if (typeof iso !== "string") return null;
  const m = ISO_PATTERN.exec(iso);
  if (m === null) return null;

  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const hour = Number(m[4]);
  const minute = Number(m[5]);
  const second = Number(m[6]);
  const zone = m[7];

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  if (hour > 23 || minute > 59 || second > 59) return null;
  if (zone !== "Z") {
    const offsetHour = Number(zone.slice(1, 3));
    const offsetMinute = Number(zone.slice(4, 6));
    if (offsetHour > 23 || offsetMinute > 59) return null;
  }

  const time = Date.parse(iso);
  return Number.isNaN(time) ? null : time;
}

/**
 * Memformat waktu tendangan awal ke zona waktu dan locale tertentu.
 *
 * Bentuk keluaran: "{hari singkat}, {tanggal} {bulan singkat}, {jam}.{menit}"
 * untuk id-ID, jam 24 jam (00-23). Bentuk persisnya mengikuti data locale ICU.
 * String ISO tidak valid, locale tidak valid, atau zona waktu tidak valid
 * menghasilkan "-" (tidak melempar error).
 *
 * @example formatKickoff("2026-06-11T19:00:00Z") // "Jum, 12 Jun, 02.00"
 * @example formatKickoff("2026-06-11T19:00:00Z", "id-ID", "America/New_York") // "Kam, 11 Jun, 15.00"
 */
export function formatKickoff(
  iso: string,
  locale: string = DEFAULT_LOCALE,
  timeZone: string = DEFAULT_TIME_ZONE,
): string {
  const time = parseIso(iso);
  if (time === null) return PLACEHOLDER;

  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone,
    }).format(time);
  } catch {
    // RangeError: locale atau timeZone tidak dikenali.
    return PLACEHOLDER;
  }
}

/**
 * Memformat menit event. Menit biasa menjadi "23"; menit tambahan menjadi
 * "90+4". `extraMinute` bernilai 0, undefined, negatif, bukan bilangan bulat,
 * atau NaN diperlakukan sebagai tidak ada. Bila `minute` sendiri bukan
 * bilangan bulat >= 1, hasilnya "-".
 *
 * @example formatMinute(23) // "23"
 * @example formatMinute(90, 4) // "90+4"
 */
export function formatMinute(minute: number, extraMinute?: number): string {
  if (!Number.isInteger(minute) || minute < 1) return PLACEHOLDER;
  if (
    extraMinute !== undefined &&
    Number.isInteger(extraMinute) &&
    extraMinute > 0
  ) {
    return `${minute}+${extraMinute}`;
  }
  return String(minute);
}

function isScore(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

/**
 * Memformat skor laga. Laga belum selesai menjadi "vs". Laga selesai menjadi
 * "2 - 1"; bila skor adu penalti keduanya ada, ditambahkan " (4-3 pen)".
 * Skor adu penalti yang hanya terisi sebelah diabaikan. Skor utama yang
 * bukan bilangan bulat >= 0 pada laga selesai (data rusak) menjadi "-".
 *
 * @example formatScore(match) // "2 - 1"
 * @example formatScore(matchPenalti) // "1 - 1 (4-3 pen)"
 */
export function formatScore(match: Match): string {
  if (!match.isFinished) return "vs";
  if (!isScore(match.homeScore) || !isScore(match.awayScore)) {
    return PLACEHOLDER;
  }

  const base = `${match.homeScore} - ${match.awayScore}`;
  if (isScore(match.homePenaltyScore) && isScore(match.awayPenaltyScore)) {
    return `${base} (${match.homePenaltyScore}-${match.awayPenaltyScore} pen)`;
  }
  return base;
}

/**
 * Teks status laga untuk MatchRow: "FT" bila sudah selesai, selain itu waktu
 * kickoff terformat. Tidak membaca jam sistem, sehingga laga yang sudah lewat
 * jadwal tetapi belum `isFinished` tetap menampilkan jam kickoff (tidak ada
 * status "LIVE" di fungsi ini).
 *
 * @example getMatchStatus(selesai) // "FT"
 * @example getMatchStatus(belumMain) // "Jum, 12 Jun, 02.00"
 */
export function getMatchStatus(
  match: Match,
  options?: { locale?: string; timeZone?: string },
): string {
  if (match.isFinished) return "FT";
  return formatKickoff(match.kickoffTime, options?.locale, options?.timeZone);
}

const ELLIPSIS = "...";

/** Memecah teks menjadi karakter yang tampak (grapheme), aman untuk aksara non-ASCII. */
function toGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    return Array.from(
      new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text),
      (part) => part.segment,
    );
  }
  return Array.from(text); // cadangan: per code point
}

/**
 * Memotong nama dengan "..." sehingga total panjang (dalam karakter tampak)
 * tidak melebihi `max`. Nama yang cukup pendek dikembalikan apa adanya.
 * Bila `max` < 4, dipotong tanpa elipsis (elipsis tidak muat). `max` desimal
 * dibulatkan ke bawah; `max` <= 0 atau NaN menghasilkan "". Nama bukan string
 * menghasilkan "".
 *
 * @example truncateName("Cristiano Ronaldo", 10) // "Cristia..."
 * @example truncateName("Messi", 3) // "Mes"
 */
export function truncateName(name: string, max: number): string {
  if (typeof name !== "string") return "";
  if (Number.isNaN(max)) return "";
  const limit = Math.floor(max);
  if (limit <= 0) return "";

  const chars = toGraphemes(name);
  if (chars.length <= limit) return name;
  if (limit < ELLIPSIS.length + 1) return chars.slice(0, limit).join("");
  return chars.slice(0, limit - ELLIPSIS.length).join("") + ELLIPSIS;
}
