// Generator src/data/matches.json + players.json (Claude #4).
// Jalankan: node scripts/build-matches.mjs
// Sumber mentah: scripts/raw/*.json (openfootball/worldcup.json, cabang master, folder 2026).
import { readFileSync, writeFileSync } from "node:fs";

const rd = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const teams = rd("../src/data/teams.json");
const raw = rd("./raw/worldcup.json").matches;
const squads = rd("./raw/squads.json");
const stadiums = rd("./raw/stadiums.json").stadiums;

const teamIds = new Set(teams.map((t) => t.id));
const NAME_OVERRIDE = { "Bosnia & Herzegovina": "BIH", USA: "USA" };
const squadByName = new Map(squads.map((s) => [s.name, s]));
const codeOf = (n) => NAME_OVERRIDE[n] ?? squadByName.get(n)?.fifa_code;
const squadOf = new Map(squads.map((s) => [s.fifa_code, s]));

const norm = (s) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/ø/g, "o").replace(/đ/g, "d").replace(/ł/g, "l").replace(/ı/g, "i")
    .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

// Alias ejaan: nama di data laga -> nama di daftar skuad (kandidat tunggal; lihat docs/data-sources.md).
const ALIAS = {
  "IRN|Mohammad Mohebbi": "Mohammad Mohebi",
  "EGY|Mostafa Zico": "Mostafa Ziko",
  "URU|Maxi Araújo": "Maximiliano Araújo",
  "URU|Agustín Cano": "Agustín Canobbio",
  "JOR|Mousa Al-Tamari": "Musa Al-Taamari",
};
const aliasUsed = new Set();
const unresolved = [];
function findPlayer(code, name, ctx) {
  const sq = squadOf.get(code);
  if (ALIAS[`${code}|${name}`]) { aliasUsed.add(`${code}|${name} -> ${ALIAS[`${code}|${name}`]} (${ctx})`); name = ALIAS[`${code}|${name}`]; }
  const n = norm(name);
  let hits = sq.players.filter((p) => norm(p.name) === n);
  if (hits.length === 0) {
    const toks = n.split(" ");
    hits = sq.players.filter((p) => { const pt = norm(p.name).split(" "); return toks.every((t) => pt.includes(t)); });
  }
  if (hits.length === 0) {
    const last = n.split(" ").slice(-1)[0];
    hits = sq.players.filter((p) => norm(p.name).split(" ").includes(last));
  }
  if (hits.length !== 1) { unresolved.push({ code, name, ctx, candidates: hits.map((h) => h.name) }); return null; }
  return hits[0];
}

const pad = (n, w) => String(n).padStart(w, "0");
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

// 1. laga grup; sumber TIDAK memuat nomor resmi FIFA dan terurut per grup, jadi id diberikan
//    kronologis menurut kickoff UTC (seri: urutan sumber = huruf grup lalu urutan dalam grup).
const g = raw.filter((m) => m.group);
const matches = g.map((m, i) => ({
  src: m, srcIdx: i, home: codeOf(m.team1), away: codeOf(m.team2), letter: m.group.replace("Group ", ""),
  kickoff: toUtc(m.date, m.time),
}));
matches.sort((a, b) => a.kickoff.localeCompare(b.kickoff) || a.srcIdx - b.srcIdx);
matches.forEach((x, i) => { x.id = `M-${pad(i + 1, 3)}`; });
const kick = new Map(matches.map((x) => [x.id, x.kickoff]));

// 2. matchday per grup: urut kronologis, 2 laga pertama MD1, dst.
for (const L of "ABCDEFGHIJKL") {
  const ms = matches.filter((x) => x.letter === L);
  ms.forEach((x, i) => { x.matchday = Math.floor(i / 2) + 1; });
}

// 3. events + players
const players = new Map();
let eid = 0;
const out = matches.map((x) => {
  const m = x.src;
  const ev = [];
  const push = (list, side) => {
    for (const goal of list ?? []) {
      const own = !!goal.owngoal;
      const benefitCode = side === 1 ? x.home : x.away;
      const lossCode = side === 1 ? x.away : x.home;
      const code = own ? lossCode : benefitCode; // OWN_GOAL: pemain milik tim yang kebobolan
      const p = findPlayer(code, goal.name, x.id);
      if (!p) continue;
      const pid = `PL-${code}-${pad(p.number, 2)}`;
      if (!players.has(pid)) {
        players.set(pid, {
          id: pid, teamId: code, name: p.name, shortName: p.name.split(" ").slice(-1)[0],
          shirtNumber: p.number, position: p.pos, photoUrl: `/players/${pid.toLowerCase()}.webp`,
          stats: { appearances: 0, minutesPlayed: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        });
      }
      const mm = /^(\d+)(?:\+(\d+))?$/.exec(String(goal.minute));
      if (!mm) throw new Error("menit aneh " + goal.minute);
      const e = { minute: +mm[1], type: own ? "OWN_GOAL" : goal.penalty ? "PENALTY_GOAL" : "GOAL", teamId: code, playerId: pid };
      if (mm[2]) e.extraMinute = +mm[2];
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
  return {
    id: x.id, stage: "GROUP_STAGE", groupLetter: x.letter, matchday: x.matchday,
    kickoffTime: kick.get(x.id), venue: venueOf(m.ground),
    homeTeamId: x.home, awayTeamId: x.away,
    homeScore: m.score.ft[0], awayScore: m.score.ft[1], isFinished: true, events,
  };
});

if (unresolved.length) { console.log("PEMAIN TIDAK TERSELESAIKAN:", JSON.stringify(unresolved, null, 1)); process.exit(2); }
for (const x of out) for (const id of [x.homeTeamId, x.awayTeamId]) if (!teamIds.has(id)) throw new Error("tim tak ada: " + id);

const plist = [...players.values()].sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(new URL("../src/data/matches.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
writeFileSync(new URL("../src/data/players.json", import.meta.url), JSON.stringify(plist, null, 2) + "\n");
console.log("alias dipakai:", [...aliasUsed].join("; "));
console.log(`matches=${out.length} events=${eid} players=${plist.length}`);
