// Generator 32 laga fase gugur (M-073..M-104) + skuad penuh players.json (Claude #4, prompt 5).
// Jalankan SESUDAH build-matches.mjs: node scripts/build-knockout.mjs
// Idempotent: laga fase gugur lama di matches.json dibuang lalu dibangun ulang; 72 laga grup
// dan pemain yang sudah ada (prompt 4) dipertahankan APA ADANYA (id tidak diubah).
// Sumber mentah: scripts/raw/*.json (openfootball). Tidak ada data yang dikarang di sini.
import { readFileSync, writeFileSync } from "node:fs";

const rd = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const teams = rd("../src/data/teams.json");
const raw = rd("./raw/worldcup.json").matches.filter((m) => !m.group);
const squads = rd("./raw/squads.json");
const stadiums = rd("./raw/stadiums.json").stadiums;
const existingMatches = rd("../src/data/matches.json");
const existingPlayers = rd("../src/data/players.json");

const teamIds = new Set(teams.map((t) => t.id));
const NAME_OVERRIDE = { "Bosnia & Herzegovina": "BIH", USA: "USA" };
const squadByName = new Map(squads.map((s) => [s.name, s]));
const squadOf = new Map(squads.map((s) => [s.fifa_code, s]));
const codeOf = (n) => NAME_OVERRIDE[n] ?? squadByName.get(n)?.fifa_code;
const pad = (n, w) => String(n).padStart(w, "0");

const STAGE = {
  "Round of 32": "ROUND_OF_32", "Round of 16": "ROUND_OF_16", "Quarter-final": "QUARTER_FINALS",
  "Semi-final": "SEMI_FINALS", "Match for third place": "THIRD_PLACE", Final: "FINAL",
};

const norm = (s) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/ø/g, "o").replace(/đ/g, "d").replace(/ł/g, "l").replace(/ı/g, "i")
    .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

// Alias ejaan (nama di data laga -> nama di skuad); hanya dipakai bila kandidat tunggal.
const ALIAS = {
  "EGY|Mostafa Zico": "Mostafa Ziko", // alias yang sama dengan prompt 4 (M-040)
  "CPV|Diney Borges": "Diney", // skuad hanya memuat "Diney" (#3, DF); kandidat tunggal, perlu verifikasi manusia
};
const aliasUsed = [];
const unresolved = [];
function findPlayer(code, name, ctx) {
  const sq = squadOf.get(code);
  const key = `${code}|${name}`;
  if (ALIAS[key]) { aliasUsed.push(`${key} -> ${ALIAS[key]} (${ctx})`); name = ALIAS[key]; }
  const n = norm(name);
  let hits = sq.players.filter((p) => norm(p.name) === n);
  let how = "exact";
  if (hits.length === 0) {
    const toks = n.split(" ");
    hits = sq.players.filter((p) => { const pt = norm(p.name).split(" "); return toks.every((t) => pt.includes(t)); });
    how = "token";
  }
  if (hits.length === 0) {
    const last = n.split(" ").slice(-1)[0];
    hits = sq.players.filter((p) => norm(p.name).split(" ").includes(last));
    how = "nama-belakang";
  }
  if (hits.length !== 1) { unresolved.push({ code, name, ctx, candidates: hits.map((h) => h.name) }); return null; }
  if (how !== "exact") aliasUsed.push(`${code}|${name} -> ${hits[0].name} [${how}] (${ctx})`);
  return hits[0];
}

function toUtc(date, time) {
  const m = /^(\d{1,2}):(\d{2}) UTC([+-]\d{1,2})$/.exec(time);
  if (!m) throw new Error("format waktu tak dikenal: " + time);
  const ms = Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10), +m[1], +m[2]) - Number(m[3]) * 3600000;
  return new Date(ms).toISOString().replace(".000Z", "Z");
}
const venueOf = (ground) => {
  const s = stadiums.find((x) => x.city === ground);
  if (!s) throw new Error("stadion tak ditemukan: " + ground);
  return `${s.name}, ${s.city}`;
};

const groupMatches = existingMatches.filter((m) => m.stage === "GROUP_STAGE");
if (groupMatches.length !== 72) throw new Error("harus ada 72 laga grup, dapat " + groupMatches.length);
let eid = groupMatches.reduce((n, m) => n + m.events.length, 0);
const normalizedMinutes = [];

const knockout = raw.slice().sort((a, b) => a.num - b.num).map((m) => {
  const id = `M-${pad(m.num, 3)}`;
  const home = codeOf(m.team1), away = codeOf(m.team2);
  for (const c of [home, away]) if (!teamIds.has(c)) throw new Error(`${id}: tim tak ada di teams.json: ${c}`);
  const hasET = !!m.score.et;
  const [hs, as] = m.score.et ?? m.score.ft; // skor akhir = setelah waktu normal + perpanjangan
  const ev = [];
  const push = (list, side) => {
    for (const goal of list ?? []) {
      const own = !!goal.owngoal;
      const benefit = side === 1 ? home : away;
      const loss = side === 1 ? away : home;
      const code = own ? loss : benefit; // OWN_GOAL: pemain milik tim yang kebobolan (konvensi 3c)
      const p = findPlayer(code, goal.name, id);
      if (!p) continue;
      const mm = /^(\d+)(?:\+(\d+))?$/.exec(String(goal.minute));
      if (!mm) throw new Error(`${id}: menit aneh ${goal.minute}`);
      let minute = +mm[1], extra = mm[2] ? +mm[2] : undefined;
      if (!hasET && minute > 90 && extra === undefined) {
        // Laga tanpa perpanjangan di sumber tetapi menit > 90 ditulis polos: dinormalisasi ke 90+N (ASUMSI).
        normalizedMinutes.push(`${id}: "${goal.minute}" (${goal.name}) -> minute 90, extraMinute ${minute - 90}`);
        extra = minute - 90; minute = 90;
      }
      const e = {
        minute, type: own ? "OWN_GOAL" : goal.penalty ? "PENALTY_GOAL" : "GOAL",
        teamId: code, playerId: `PL-${code}-${pad(p.number, 2)}`,
      };
      if (extra !== undefined) e.extraMinute = extra;
      ev.push({ e, order: ev.length });
    }
  };
  push(m.goals1, 1);
  push(m.goals2, 2);
  ev.sort((a, b) => a.e.minute - b.e.minute || (a.e.extraMinute ?? 0) - (b.e.extraMinute ?? 0) || a.order - b.order);
  const events = ev.map(({ e }) => ({
    id: `E-${pad(++eid, 4)}`, minute: e.minute, ...(e.extraMinute ? { extraMinute: e.extraMinute } : {}),
    type: e.type, teamId: e.teamId, playerId: e.playerId,
  }));
  const rec = {
    id, stage: STAGE[m.round], kickoffTime: toUtc(m.date, m.time), venue: venueOf(m.ground),
    homeTeamId: home, awayTeamId: away, homeScore: hs, awayScore: as,
  };
  if (m.score.p) { rec.homePenaltyScore = m.score.p[0]; rec.awayPenaltyScore = m.score.p[1]; }
  rec.isFinished = true;
  rec.events = events;
  return rec;
});

if (unresolved.length) { console.log("PEMAIN TIDAK TERSELESAIKAN:", JSON.stringify(unresolved, null, 1)); process.exit(2); }

// ---- players.json: skuad penuh; entri lama dipertahankan persis (id tidak diubah)
const byId = new Map(existingPlayers.map((p) => [p.id, p]));
const zero = () => ({ appearances: 0, minutesPlayed: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 });
let added = 0;
for (const sq of squads) {
  for (const p of sq.players) {
    const id = `PL-${sq.fifa_code}-${pad(p.number, 2)}`;
    if (byId.has(id)) continue;
    byId.set(id, {
      id, teamId: sq.fifa_code, name: p.name, shortName: p.name.split(" ").slice(-1)[0],
      shirtNumber: p.number, position: p.pos, photoUrl: `/players/${id.toLowerCase()}.webp`, stats: zero(),
    });
    added++;
  }
}
const plist = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));

writeFileSync(new URL("../src/data/matches.json", import.meta.url), JSON.stringify([...groupMatches, ...knockout], null, 2) + "\n");
writeFileSync(new URL("../src/data/players.json", import.meta.url), JSON.stringify(plist, null, 2) + "\n");
console.log("pencocokan non-exact:", aliasUsed.length ? "\n  " + aliasUsed.join("\n  ") : "(tidak ada)");
console.log("menit dinormalisasi:", normalizedMinutes.length ? "\n  " + normalizedMinutes.join("\n  ") : "(tidak ada)");
console.log(`matches=${groupMatches.length + knockout.length} (fase gugur ${knockout.length}) events=${eid} players=${plist.length} (baru ${added})`);
