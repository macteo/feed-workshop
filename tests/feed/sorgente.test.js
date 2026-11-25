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

// AC-US01-05: pagina 2 = articoli dal 11° al 20° nell'ordine ricevuto; pagina oltre la fine = elenco vuoto.
test("[UNIT] pagina(articoli, 2, 10) restituisce gli articoli 11-20 nell'ordine ricevuto", () => {
  const seconda = pagina(salvati, 2, 10);
  assert.deepEqual(seconda.map((a) => a.id), salvati.slice(10, 20).map((a) => a.id));
  assert.equal(seconda.length, 10);
});

test("[UNIT] pagina oltre la fine dell'elenco restituisce un elenco vuoto", () => {
  assert.deepEqual(pagina(salvati, 7, 10), []);
  assert.deepEqual(pagina(salvati, 100, 10), []);
  assert.deepEqual(pagina([], 1, 10), []);
});

test("[UNIT] pagina() normalizza page e perPage non interi o minori di 1", () => {
  const prima = pagina(salvati, 1, 10).map((a) => a.id);
  assert.deepEqual(pagina(salvati, 0, 10).map((a) => a.id), prima);
  assert.deepEqual(pagina(salvati, -3, 10).map((a) => a.id), prima);
  assert.deepEqual(pagina(salvati, 1.8, 10).map((a) => a.id), prima);
  assert.deepEqual(pagina(salvati, 2, 0).map((a) => a.id), pagina(salvati, 2, 1).map((a) => a.id));
  assert.deepEqual(pagina(salvati, 2, -5).map((a) => a.id), pagina(salvati, 2, 1).map((a) => a.id));
  assert.deepEqual(pagina(salvati, 2, 4.9).map((a) => a.id), salvati.slice(4, 8).map((a) => a.id));
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
