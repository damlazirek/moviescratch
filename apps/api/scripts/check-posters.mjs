import fs from "node:fs";

const t = fs.readFileSync("src/data/imdbTopSeed.ts", "utf8");
const paths = [...t.matchAll(/poster: "(\/[^"]+)"/g)].map((m) => m[1]);

let ok = 0;
let bad = 0;
const good = [];
const badList = [];

for (const p of paths) {
  const u = `https://image.tmdb.org/t/p/w342${p}`;
  try {
    const r = await fetch(u, { method: "HEAD" });
    if (r.ok) {
      ok += 1;
      good.push(p);
    } else {
      bad += 1;
      badList.push(p);
    }
  } catch {
    bad += 1;
    badList.push(p);
  }
}

console.log(JSON.stringify({ ok, bad, good, badList }, null, 2));
