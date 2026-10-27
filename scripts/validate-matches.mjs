// Validasi src/data/matches.json + players.json (Claude #4). Jalankan: node scripts/validate-matches.mjs
import { readFileSync } from "node:fs";

const rd = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const teams = rd("../src/data/teams.json");
// Skrip ini hanya memvalidasi 72 laga fase grup (prompt 4); validasi penuh 104 laga: scripts/validate-data.mjs
const matches = rd("../src/data/matches.json").filter((m) => m.stage === "GROUP_STAGE");
const players = rd("../src/data/players.json");
const raw = rd("./raw/worldcup.json").matches.filter((m) => m.group);
const squads = rd("./raw/squads.json");
const OVR = { "Bosnia & Herzegovina": "BIH", USA: "USA" };
const codeOf = (n) => OVR[n] ?? squads.find((s) => s.name === n)?.fifa_code;
const rawByPair = new Map(raw.map((r) => [[r.group.slice(-1), codeOf(r.team1), codeOf(r.team2)].join("|"), r]));

const errors = [];
const check = (ok, msg) => { if (!ok) errors.push(msg); };
const teamById = new Map(teams.map((t) => [t.id, t]));
const playerById = new Map(players.map((p) => [p.id, p]));

// ---- players.json
check(playerById.size === players.length, "id pemain duplikat");
for (const p of players) {
  check(/^PL-[A-Z]{3}-\d{2}$/.test(p.id), `id pemain salah pola: ${p.id}`);
  check(p.id === `PL-${p.teamId}-${String(p.shirtNumber).padStart(2, "0")}`, `id tidak cocok teamId/nomor: ${p.id}`);
  check(teamById.has(p.teamId), `teamId pemain tak ada: ${p.id}`);
  check(["GK", "DF", "MF", "FW"].includes(p.position), `posisi salah: ${p.id}`);
  check(/^\/players\/.+\.webp$/.test(p.photoUrl), `photoUrl bukan .webp: ${p.id}`);
  check(Object.values(p.stats).every((v) => v === 0) && Object.keys(p.stats).length === 6, `stats harus nol: ${p.id}`);
  check(Object.keys(p).sort().join() === "id,name,photoUrl,position,shirtNumber,shortName,stats,teamId", `field tak sesuai tipe Player: ${p.id}`);
}

// ---- matches.json
check(matches.length === 72, `jumlah laga harus 72, dapat ${matches.length}`);
const perGroup = {}, perTeam = {}, pairs = new Set(), mdByTeam = {};
const evIds = []; let prevKick = "";
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
matches.forEach((m, i) => {
  const w = `[${m.id}]`;
  check(m.id === `M-${String(i + 1).padStart(3, "0")}`, `${w} id tidak berurutan`);
  check(m.stage === "GROUP_STAGE", `${w} stage salah`);
  check("ABCDEFGHIJKL".includes(m.groupLetter), `${w} groupLetter salah`);
  check([1, 2, 3].includes(m.matchday), `${w} matchday salah`);
  check(ISO.test(m.kickoffTime) && !Number.isNaN(new Date(m.kickoffTime).getTime()), `${w} kickoffTime tidak valid: ${m.kickoffTime}`);
  check(m.kickoffTime >= prevKick, `${w} kickoff tidak kronologis terhadap id sebelumnya`); prevKick = m.kickoffTime;
  check(/^.+, .+$/.test(m.venue), `${w} venue bukan "Stadion, Kota"`);
  check(m.homeTeamId !== m.awayTeamId, `${w} home == away`);
  for (const id of [m.homeTeamId, m.awayTeamId]) {
    const t = teamById.get(id);
    check(!!t, `${w} tim tak ada di teams.json: ${id}`);
    check(t?.groupLetter === m.groupLetter, `${w} tim ${id} bukan dari grup ${m.groupLetter}`);
    perTeam[id] = (perTeam[id] ?? 0) + 1;
    (mdByTeam[id] ??= []).push(m.matchday);
  }
  perGroup[m.groupLetter] = (perGroup[m.groupLetter] ?? 0) + 1;
  const pk = [m.groupLetter, ...[m.homeTeamId, m.awayTeamId].sort()].join("|");
  check(!pairs.has(pk), `${w} pasangan tim muncul dua kali: ${pk}`); pairs.add(pk);
  check(Object.keys(m).sort().join() === "awayScore,awayTeamId,events,groupLetter,homeScore,homeTeamId,id,isFinished,kickoffTime,matchday,stage,venue", `${w} field tak sesuai tipe Match`);
  check(!("homePenaltyScore" in m) && !("awayPenaltyScore" in m), `${w} fase grup dilarang punya skor penalti`);

  // events
  let goalsHome = 0, goalsAway = 0, lastKey = [-1, -1];
  const yc = {}, rc = {};
  if (!m.isFinished) { check(m.homeScore === 0 && m.awayScore === 0 && m.events.length === 0, `${w} laga belum selesai harus 0-0 tanpa event`); }
  for (const e of m.events) {
    evIds.push(e.id);
    check(/^E-\d{4,}$/.test(e.id), `${w} id event salah pola: ${e.id}`);
    check([m.homeTeamId, m.awayTeamId].includes(e.teamId), `${w} ${e.id} teamId bukan tim laga`);
    const p = playerById.get(e.playerId);
    check(!!p, `${w} ${e.id} playerId tak ada: ${e.playerId}`);
    check(p?.teamId === e.teamId, `${w} ${e.id} pemain ${e.playerId} bukan milik ${e.teamId}`);
    check(Number.isInteger(e.minute) && e.minute >= 1 && e.minute <= 90, `${w} ${e.id} menit di luar 1-90`);
    if (e.extraMinute !== undefined) check(Number.isInteger(e.extraMinute) && e.extraMinute >= 1 && [45, 90].includes(e.minute), `${w} ${e.id} extraMinute tidak valid`);
    const key = [e.minute, e.extraMinute ?? 0];
    check(key[0] > lastKey[0] || (key[0] === lastKey[0] && key[1] >= lastKey[1]), `${w} ${e.id} tidak kronologis`); lastKey = key;
    check(["GOAL", "PENALTY_GOAL"].includes(e.type) ? e.relatedPlayerId === undefined || e.type === "GOAL" : true, `${w} ${e.id} relatedPlayerId terlarang`);
    if (["OWN_GOAL", "YELLOW_CARD", "RED_CARD", "PENALTY_GOAL"].includes(e.type)) check(e.relatedPlayerId === undefined, `${w} ${e.id} ${e.type} dilarang punya relatedPlayerId`);
    if (e.type === "SUBSTITUTION") check(!!e.relatedPlayerId && playerById.get(e.relatedPlayerId)?.teamId === e.teamId, `${w} ${e.id} substitusi tak valid`);
    if (e.type === "GOAL" || e.type === "PENALTY_GOAL") (e.teamId === m.homeTeamId ? goalsHome++ : goalsAway++);
    if (e.type === "OWN_GOAL") (e.teamId === m.homeTeamId ? goalsAway++ : goalsHome++);
    if (e.type === "YELLOW_CARD") yc[e.playerId] = (yc[e.playerId] ?? 0) + 1;
    if (e.type === "RED_CARD") rc[e.playerId] = (rc[e.playerId] ?? 0) + 1;
  }
  if (m.isFinished) {
    check(goalsHome === m.homeScore, `${w} skor kandang ${m.homeScore} != hitungan event ${goalsHome}`);
    check(goalsAway === m.awayScore, `${w} skor tandang ${m.awayScore} != hitungan event ${goalsAway}`);
  }
  for (const pid of Object.keys(yc)) check(yc[pid] <= 2, `${w} ${pid} >2 kuning`);
  for (const pid of Object.keys(rc)) check(rc[pid] <= 1, `${w} ${pid} >1 merah`);
  for (const pid of Object.keys(yc)) if (yc[pid] === 2) check(rc[pid] === 1, `${w} ${pid} 2 kuning tanpa merah`);

  // silang dengan sumber mentah
  const r = rawByPair.get([m.groupLetter, m.homeTeamId, m.awayTeamId].join("|"));
  if (!r) { errors.push(`${w} tidak ada di sumber mentah`); return; }
  check(r.score.ft[0] === m.homeScore && r.score.ft[1] === m.awayScore, `${w} skor != sumber mentah`);
  check((r.goals1?.length ?? 0) + (r.goals2?.length ?? 0) === m.events.length, `${w} jumlah gol != sumber mentah`);
});
for (const L of "ABCDEFGHIJKL") check(perGroup[L] === 6, `grup ${L} harus 6 laga, dapat ${perGroup[L]}`);
for (const t of teams) {
  check(perTeam[t.id] === 3, `${t.id} bermain ${perTeam[t.id]}x, harus 3`);
  check((mdByTeam[t.id] ?? []).slice().sort().join() === "1,2,3", `${t.id} matchday tidak 1,2,3: ${mdByTeam[t.id]}`);
}
check(new Set(evIds).size === evIds.length, "id event tidak unik global");
evIds.forEach((id, i) => check(id === `E-${String(i + 1).padStart(4, "0")}`, `id event tidak berurutan: ${id}`));
// (cek "pemain tak terpakai event" dihapus pada prompt 5: players.json kini berisi skuad penuh)

console.log(`laga: ${matches.length} | selesai: ${matches.filter((m) => m.isFinished).length} | event: ${evIds.length} | pemain: ${players.length}`);
console.log("laga per grup:", JSON.stringify(perGroup));
const types = {};
matches.forEach((m) => m.events.forEach((e) => (types[e.type] = (types[e.type] ?? 0) + 1)));
console.log("event per tipe:", JSON.stringify(types));
if (errors.length) { console.log(`GAGAL (${errors.length} masalah):`); errors.forEach((e) => console.log(" -", e)); process.exit(1); }
console.log("[OK] semua aturan validasi lulus");
