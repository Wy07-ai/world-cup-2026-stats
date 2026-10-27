// Validasi src/data/teams.json (Claude #4). Jalankan: node scripts/validate-teams.mjs
import { readFileSync } from "node:fs";

const CONFED = ["UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC", "OFC"];
const GROUPS = "ABCDEFGHIJKL".split("");
const errors = [];
const check = (ok, msg) => { if (!ok) errors.push(msg); };

const raw = readFileSync(new URL("../src/data/teams.json", import.meta.url), "utf8");
let teams;
try { teams = JSON.parse(raw); } catch (e) { console.log("FAIL JSON tidak valid:", e.message); process.exit(1); }
console.log("[OK] JSON valid");

check(Array.isArray(teams) && teams.length === 48, `total harus 48, dapat ${teams.length}`);
console.log(`total entri: ${teams.length}`);

const ids = new Set(), codes = new Set();
for (const t of teams) {
  check(/^[A-Z]{3}$/.test(t.id), `id tidak sesuai pola: ${t.id}`);
  check(t.id === t.code, `id != code: ${t.id}/${t.code}`);
  check(!ids.has(t.id), `id duplikat: ${t.id}`); ids.add(t.id);
  check(!codes.has(t.code), `code duplikat: ${t.code}`); codes.add(t.code);
  check(typeof t.name === "string" && t.name.length > 0, `name kosong: ${t.id}`);
  check(t.flagUrl === `/flags/${t.id.toLowerCase()}.svg`, `flagUrl salah: ${t.id} -> ${t.flagUrl}`);
  check(GROUPS.includes(t.groupLetter), `groupLetter tidak valid: ${t.id}`);
  check(CONFED.includes(t.confederation), `confederation tidak valid: ${t.id} -> ${t.confederation}`);
  check(Object.keys(t).sort().join() === "code,confederation,flagUrl,groupLetter,id,name", `field tidak sesuai tipe Team: ${t.id}`);
}
console.log(`id unik: ${ids.size}, code unik: ${codes.size}`);

const names = new Set(teams.map((t) => t.name));
check(names.size === 48, "name tidak unik");

const perGroup = {};
for (const g of GROUPS) perGroup[g] = teams.filter((t) => t.groupLetter === g).length;
for (const g of GROUPS) check(perGroup[g] === 4, `grup ${g} berisi ${perGroup[g]} tim`);
console.log("tim per grup:", JSON.stringify(perGroup));

const sorted = teams.every((t, i) => i === 0 || teams[i - 1].groupLetter <= t.groupLetter);
check(sorted, "urutan groupLetter tidak naik");
console.log("urut groupLetter: " + (sorted ? "ya" : "tidak"));

const placeholders = teams.filter((t) => /^TB\d+$/.test(t.id) || t.name.startsWith("TBD"));
console.log(`placeholder TBD: ${placeholders.length}`);

if (errors.length) { console.log("GAGAL:\n" + errors.join("\n")); process.exit(1); }
console.log("SEMUA PEMERIKSAAN LULUS");
