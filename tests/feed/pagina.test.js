// Test con node:test, senza installare nulla: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const paginaHtml = await readFile(new URL("../../web/index.html", import.meta.url), "utf8");

test("[UNIT] la pagina ha il pulsante <button> Carica altri sotto #feed", () => {
  const bottone = paginaHtml.match(/<button\b[^>]*id="carica-altri"[^>]*>([^]*)<\/button>/);
  assert.ok(bottone, "c'è un <button id=\"carica-altri\">");
  assert.match(bottone[0], /type="button"/, "è un pulsante con etichetta leggibile");
  assert.ok(bottone[1].trim().length > 0, "ha un'etichetta");
  assert.ok(paginaHtml.indexOf("</main>") < paginaHtml.indexOf("carica-altri"), "sta sotto #feed");
});

test("[UNIT] la pagina ha il contenitore #avviso per errori e avvisi", () => {
  const avviso = paginaHtml.match(/<\w+\b[^>]*id="avviso"[^>]*>/);
  assert.ok(avviso, "c'è un contenitore id=\"avviso\"");
});

test("[UNIT] la testata ha un pulsante nativo con etichetta per cambiare tema", () => {
  const testata = paginaHtml.match(/<header\b[^>]*>([^]*?)<\/header>/);
  assert.ok(testata, "c'è una testata");
  const bottone = testata[1].match(/<button\b([^>]*\sid="cambia-tema"[^>]*)>([^<]*)<\/button>/);
  assert.ok(bottone, "la testata contiene <button id=\"cambia-tema\">");
  assert.match(bottone[1], /\stype="button"/);
  assert.equal(bottone[2].trim(), "Passa al tema scuro");
});
