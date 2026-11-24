// Test con node:test, senza installare nulla: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { leggiArticoli, pagina } from "../../web/lib/sorgente.js";

const web = new URL("../../web/", import.meta.url);
const salvati = JSON.parse(await readFile(new URL("data/articles.json", web), "utf8"));
const risposta = (dati, status = 200) => ({ ok: status < 400, status, json: async () => dati });

test("[INT] la copia salvata ha i campi della card dell'API contract", async () => {
  assert.equal(salvati.length, 54);
  for (const a of salvati) {
    assert.ok(a.id && a.title && a.description !== undefined && a.readable_publish_date);
    assert.ok(a.user?.name && a.user?.profile_image_90);
    assert.ok("cover_image" in a && "public_reactions_count" in a);
    for (const img of [a.cover_image, a.user.profile_image_90]) {
      if (img?.startsWith("data/")) await access(new URL(img, web));
    }
  }
});

test("[UNIT] pagina() divide come l'API", () => {
  assert.equal(pagina(salvati, 1, 10).length, 10);
  assert.equal(pagina(salvati, 6, 10).length, 4);
  assert.deepEqual(pagina(salvati, 7, 10), []);
  const ids = new Set(pagina(salvati, 1, 10).map((a) => a.id));
  assert.ok(pagina(salvati, 2, 10).every((a) => !ids.has(a.id)));
});

test("[UNIT] in locale legge articles.json e restituisce la pagina chiesta", async () => {
  let chiesto;
  const fetchFn = async (url) => { chiesto = url; return risposta(salvati); };
  const p2 = await leggiArticoli({ page: 2, perPage: 5 }, { base: "data", fetchFn });
  assert.equal(chiesto, "data/articles.json");
  assert.deepEqual(p2.map((a) => a.id), salvati.slice(5, 10).map((a) => a.id));
});

test("[UNIT] dal vivo chiede page e per_page a DEV.to", async () => {
  let chiesto;
  const fetchFn = async (url) => { chiesto = url; return risposta([]); };
  await leggiArticoli({ page: 3, perPage: 10 }, { base: "https://dev.to/api", fetchFn });
  assert.equal(chiesto, "https://dev.to/api/articles?page=3&per_page=10");
});

test("[UNIT] una risposta di errore diventa un Error", async () => {
  await assert.rejects(leggiArticoli({}, { base: "data", fetchFn: async () => risposta(null, 503) }), /503/);
});
