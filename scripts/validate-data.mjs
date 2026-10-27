// Validasi penuh matches.json (104 laga) + players.json + teams.json (Claude #4, prompt 5).
// Jalankan: node scripts/validate-data.mjs
import { readFileSync } from "node:fs";

const rd = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const teams = rd("../src/data/teams.json");
const matches = rd("../src/data/matches.json");
const players = rd("../src/data/players.json");
const rawKo = rd("./raw/worldcup.json").matches.filter((m) => !m.group);
const squads = rd("./raw/squads.json");

const errors = [];
const check = (ok, msg) => { if (!ok) errors.push(msg); };
const teamById = new Map(teams.map((t) => [t.id, t]));
const playerById = new Map(players.map((p) => [p.id, p]));
const matchById = new Map(matches.map((m) => [m.id, m]));

// ---- pola placeholder resmi (docs/data-conventions.md, "Placeholder bracket")
const PH = {
  groupPos: /^[12][A-L]$/,
  third: /^3rd-[A-L]{2,8}$/,
  winner: /^W-M\d{3}$/,
  loser: /^L-M\d{3}$/,
};
const isPlaceholder = (v) => Object.values(PH).some((re) => re.test(v));

// ---- teams.json: tidak boleh memuat placeholder
check(teams.length === 48, `teams.json harus 48 tim, dapat ${teams.length}`);
for (const t of teams) {
  check(!isPlaceholder(t.id) && !isPlaceholder(t.code), `teams.json memuat placeholder: ${t.id}`);
  check(/^[A-Z]{3}$/.test(t.id) && t.id === t.code, `teams.json id/code tidak valid: ${t.id}/${t.code}`);
}

// ---- jumlah laga & stage
const EXPECT = { GROUP_STAGE: 72, ROUND_OF_32: 16, ROUND_OF_16: 8, QUARTER_FINALS: 4, SEMI_FINALS: 2, THIRD_PLACE: 1, FINAL: 1 };
const RANGE = { ROUND_OF_32: [73, 88], ROUND_OF_16: [89, 96], QUARTER_FINALS: [97, 100], SEMI_FINALS: [101, 102], THIRD_PLACE: [103, 103], FINAL: [104, 104] };
check(matches.length === 104, `total laga harus 104, dapat ${matches.length}`);
check(matchById.size === matches.length, "id laga tidak unik");
const perStage = {};
for (const m of matches) perStage[m.stage] = (perStage[m.stage] ?? 0) + 1;
for (const [s, n] of Object.entries(EXPECT)) check(perStage[s] === n, `stage ${s} harus ${n}, dapat ${perStage[s] ?? 0}`);
matches.forEach((m, i) => check(m.id === `M-${String(i + 1).padStart(3, "0")}`, `id laga tidak berurutan di indeks ${i}: ${m.id}`));

// ---- pemenang/pecundang
const winnerOf = (m) => {
  if (!m.isFinished) return null;
  if (m.homeScore !== m.awayScore) return m.homeScore > m.awayScore ? m.homeTeamId : m.awayTeamId;
  if (m.homePenaltyScore === undefined) return null;
  return m.homePenaltyScore > m.awayPenaltyScore ? m.homeTeamId : m.awayTeamId;
};
const loserOf = (m) => { const w = winnerOf(m); return w ? (w === m.homeTeamId ? m.awayTeamId : m.homeTeamId) : null; };

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const rawByNum = new Map(rawKo.map((r) => [r.num, r]));
const OVR = { "Bosnia & Herzegovina": "BIH", USA: "USA" };
const codeOf = (n) => OVR[n] ?? squads.find((s) => s.name === n)?.fifa_code;
const evIds = [];
let placeholderSlots = 0;

for (const m of matches) {
  const w = `[${m.id}]`;
  const num = +m.id.slice(2);
  const isKo = m.stage !== "GROUP_STAGE";
  check(ISO.test(m.kickoffTime) && !Number.isNaN(new Date(m.kickoffTime).getTime()), `${w} kickoffTime tidak valid`);
  check(/^.+, .+$/.test(m.venue), `${w} venue bukan "Stadion, Kota"`);
  check(m.homeTeamId !== m.awayTeamId, `${w} home == away`);

  if (!isKo) {
    check(!("homePenaltyScore" in m) && !("awayPenaltyScore" in m), `${w} fase grup dilarang punya skor penalti`);
    check(m.groupLetter !== undefined && m.matchday !== undefined, `${w} fase grup wajib groupLetter+matchday`);
    for (const id of [m.homeTeamId, m.awayTeamId]) check(teamById.get(id)?.groupLetter === m.groupLetter, `${w} tim ${id} bukan grup ${m.groupLetter}`);
  } else {
    const [lo, hi] = RANGE[m.stage];
    check(num >= lo && num <= hi, `${w} nomor di luar rentang ${m.stage}`);
    check(m.groupLetter === undefined && m.matchday === undefined, `${w} fase gugur dilarang groupLetter/matchday`);
    const exp = ["awayScore", "awayTeamId", "events", "homeScore", "homeTeamId", "id", "isFinished", "kickoffTime", "stage", "venue"];
    if ("homePenaltyScore" in m) exp.push("homePenaltyScore", "awayPenaltyScore");
    check(Object.keys(m).sort().join() === exp.sort().join(), `${w} field tak sesuai tipe Match`);

    // peserta: id tim valid ATAU placeholder resmi yang merujuk laga nyata
    const slots = [["home", m.homeTeamId], ["away", m.awayTeamId]];
    for (const [side, v] of slots) {
      if (teamById.has(v)) continue;
      check(isPlaceholder(v), `${w} ${side}TeamId bukan id tim maupun placeholder resmi: ${v}`);
      if (!isPlaceholder(v)) continue;
      placeholderSlots++;
      if (PH.groupPos.test(v)) check(m.stage === "ROUND_OF_32", `${w} ${v} hanya boleh di ROUND_OF_32`);
      if (PH.third.test(v)) {
        const letters = v.slice(4);
        check(m.stage === "ROUND_OF_32", `${w} ${v} hanya boleh di ROUND_OF_32`);
        check([...letters].sort().join("") === letters && new Set(letters).size === letters.length, `${w} ${v} huruf harus terurut naik dan unik`);
      }
      if (PH.winner.test(v) || PH.loser.test(v)) {
        const ref = matchById.get("M-" + v.slice(-3));
        check(!!ref, `${w} ${v} merujuk laga yang tidak ada`);
        check(ref && +ref.id.slice(2) < num, `${w} ${v} harus merujuk laga bernomor lebih kecil`);
        if (PH.loser.test(v)) check(m.stage === "THIRD_PLACE" && ref?.stage === "SEMI_FINALS", `${w} ${v} hanya untuk THIRD_PLACE yang merujuk SEMI_FINALS`);
        if (PH.winner.test(v) && ref) check(m.stage !== "ROUND_OF_32", `${w} ${v} tak boleh di ROUND_OF_32`);
      }
    }
    if (!teamById.has(m.homeTeamId) || !teamById.has(m.awayTeamId)) {
      check(!m.isFinished && m.homeScore === 0 && m.awayScore === 0 && m.events.length === 0 && !("homePenaltyScore" in m), `${w} ada placeholder: wajib belum selesai, skor 0, tanpa event/penalti`);
    }
    // adu penalti
    if ("homePenaltyScore" in m) {
      check(Number.isInteger(m.homePenaltyScore) && Number.isInteger(m.awayPenaltyScore), `${w} skor penalti harus berpasangan`);
      check(m.homeScore === m.awayScore, `${w} penalti hanya bila seri`);
      check(m.homePenaltyScore !== m.awayPenaltyScore, `${w} skor penalti tidak boleh sama`);
    }
    if (m.isFinished) {
      check(m.homeScore !== m.awayScore || "homePenaltyScore" in m, `${w} fase gugur selesai tanpa pemenang`);
      check(teamById.has(m.homeTeamId) && teamById.has(m.awayTeamId), `${w} selesai tetapi peserta masih placeholder`);
    }
  }
  if (!m.isFinished) check(m.homeScore === 0 && m.awayScore === 0 && m.events.length === 0, `${w} belum selesai harus 0-0 tanpa event`);

  // ---- events
  const raw = isKo ? rawByNum.get(num) : null;
  const hasET = !!raw?.score.et;
  let gh = 0, ga = 0, last = [-1, -1];
  const yc = {}, rc = {};
  for (const e of m.events) {
    evIds.push(e.id);
    check(/^E-\d{4,}$/.test(e.id), `${w} ${e.id} pola id event salah`);
    check([m.homeTeamId, m.awayTeamId].includes(e.teamId), `${w} ${e.id} teamId bukan tim laga`);
    const p = playerById.get(e.playerId);
    check(!!p, `${w} ${e.id} playerId tak ada: ${e.playerId}`);
    check(p?.teamId === e.teamId, `${w} ${e.id} pemain ${e.playerId} bukan milik ${e.teamId}`);
    check(Number.isInteger(e.minute) && e.minute >= 1 && e.minute <= (isKo ? 120 : 90), `${w} ${e.id} menit di luar rentang`);
    if (e.minute > 90) check(isKo && hasET, `${w} ${e.id} menit ${e.minute} > 90 tanpa perpanjangan di sumber`);
    if (e.extraMinute !== undefined) check(Number.isInteger(e.extraMinute) && e.extraMinute >= 1 && [45, 90, 105, 120].includes(e.minute), `${w} ${e.id} extraMinute tidak valid`);
    const key = [e.minute, e.extraMinute ?? 0];
    check(key[0] > last[0] || (key[0] === last[0] && key[1] >= last[1]), `${w} ${e.id} tidak kronologis`); last = key;
    if (["OWN_GOAL", "YELLOW_CARD", "RED_CARD", "PENALTY_GOAL"].includes(e.type)) check(e.relatedPlayerId === undefined, `${w} ${e.id} ${e.type} dilarang relatedPlayerId`);
    if (e.type === "GOAL" || e.type === "PENALTY_GOAL") (e.teamId === m.homeTeamId ? gh++ : ga++);
    if (e.type === "OWN_GOAL") (e.teamId === m.homeTeamId ? ga++ : gh++);
    if (e.type === "YELLOW_CARD") yc[e.playerId] = (yc[e.playerId] ?? 0) + 1;
    if (e.type === "RED_CARD") rc[e.playerId] = (rc[e.playerId] ?? 0) + 1;
  }
  if (m.isFinished) {
    check(gh === m.homeScore, `${w} skor kandang ${m.homeScore} != event ${gh}`);
    check(ga === m.awayScore, `${w} skor tandang ${m.awayScore} != event ${ga}`);
  }
  for (const pid of Object.keys(yc)) check(yc[pid] <= 2, `${w} ${pid} >2 kuning`);
  for (const pid of Object.keys(rc)) check(rc[pid] <= 1, `${w} ${pid} >1 merah`);

  // ---- silang dengan sumber mentah (fase gugur)
  if (raw) {
    const [rh, ra] = raw.score.et ?? raw.score.ft;
    check(codeOf(raw.team1) === m.homeTeamId && codeOf(raw.team2) === m.awayTeamId, `${w} tim != sumber mentah`);
    check(rh === m.homeScore && ra === m.awayScore, `${w} skor != sumber mentah`);
    check((raw.score.p?.[0] ?? undefined) === m.homePenaltyScore && (raw.score.p?.[1] ?? undefined) === m.awayPenaltyScore, `${w} skor penalti != sumber mentah`);
    check((raw.goals1?.length ?? 0) + (raw.goals2?.length ?? 0) === m.events.length, `${w} jumlah gol != sumber mentah`);
  }
}

// ---- alur bagan (diturunkan dari data, bukan dari regulasi): peserta babak berikutnya harus pemenang babak sebelumnya
const feed = { ROUND_OF_16: "ROUND_OF_32", QUARTER_FINALS: "ROUND_OF_16", SEMI_FINALS: "QUARTER_FINALS", FINAL: "SEMI_FINALS" };
const winnersBy = {}, losersBy = {};
for (const m of matches) {
  if (m.stage === "GROUP_STAGE" || !m.isFinished) continue;
  (winnersBy[m.stage] ??= new Set()).add(winnerOf(m));
  (losersBy[m.stage] ??= new Set()).add(loserOf(m));
}
for (const m of matches) {
  if (!m.isFinished) continue;
  for (const id of [m.homeTeamId, m.awayTeamId]) {
    if (feed[m.stage]) check(winnersBy[feed[m.stage]]?.has(id), `[${m.id}] ${id} bukan pemenang ${feed[m.stage]}`);
    if (m.stage === "THIRD_PLACE") check(losersBy.SEMI_FINALS?.has(id), `[${m.id}] ${id} bukan pecundang SEMI_FINALS`);
  }
}
// tiap pemenang babak harus muncul tepat sekali di babak berikutnya
for (const [next, prev] of Object.entries(feed)) {
  const used = matches.filter((m) => m.stage === next).flatMap((m) => [m.homeTeamId, m.awayTeamId]);
  check(new Set(used).size === used.length, `${next}: ada tim yang muncul dua kali`);
}

// ---- events global
check(new Set(evIds).size === evIds.length, "id event tidak unik global");
evIds.forEach((id, i) => check(id === `E-${String(i + 1).padStart(4, "0")}`, `id event tidak berurutan: ${id}`));

// ---- players.json
check(playerById.size === players.length, "id pemain duplikat");
const perTeam = {}, nums = {};
for (const p of players) {
  check(/^PL-[A-Z]{3}-\d{2}$/.test(p.id), `id pemain salah pola: ${p.id}`);
  check(p.id === `PL-${p.teamId}-${String(p.shirtNumber).padStart(2, "0")}`, `id tidak cocok teamId/nomor: ${p.id}`);
  check(teamById.has(p.teamId), `teamId tak ada di teams.json: ${p.id}`);
  check(["GK", "DF", "MF", "FW"].includes(p.position), `posisi salah: ${p.id}`);
  check(p.photoUrl === `/players/${p.id.toLowerCase()}.webp`, `photoUrl salah: ${p.id}`);
  check(Object.keys(p.stats).length === 6 && Object.values(p.stats).every((v) => v === 0), `stats harus nol: ${p.id}`);
  check(Object.keys(p).sort().join() === "id,name,photoUrl,position,shirtNumber,shortName,stats,teamId", `field tak sesuai tipe Player: ${p.id}`);
  check(typeof p.name === "string" && p.name.trim() !== "" && p.shortName.trim() !== "", `name/shortName kosong: ${p.id}`);
  perTeam[p.teamId] = (perTeam[p.teamId] ?? 0) + 1;
  const k = `${p.teamId}|${p.shirtNumber}`;
  check(!nums[k], `nomor punggung ganda: ${k}`); nums[k] = true;
}
for (const t of teams) check(perTeam[t.id] === 26, `${t.id} punya ${perTeam[t.id] ?? 0} pemain (harus 26 menurut sumber)`);
// semua pemain berasal dari skuad sumber (tidak ada yang dikarang)
const sqKeys = new Set(squads.flatMap((s) => s.players.map((p) => `${s.fifa_code}|${p.number}|${p.name}`)));
for (const p of players) check(sqKeys.has(`${p.teamId}|${p.shirtNumber}|${p.name}`), `pemain tidak ada di skuad sumber: ${p.id}`);

console.log(`laga: ${matches.length} | per stage: ${JSON.stringify(perStage)} | event: ${evIds.length} | pemain: ${players.length} | slot placeholder: ${placeholderSlots}`);
console.log("pemain per tim (min-maks):", Math.min(...Object.values(perTeam)), "-", Math.max(...Object.values(perTeam)), "| tim:", Object.keys(perTeam).length);
if (errors.length) { console.log(`GAGAL (${errors.length} masalah):`); errors.forEach((e) => console.log(" -", e)); process.exit(1); }
console.log("[OK] semua aturan validasi lulus");
