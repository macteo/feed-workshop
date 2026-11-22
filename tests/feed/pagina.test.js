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
