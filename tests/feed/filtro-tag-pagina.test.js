import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const paginaHtml = await readFile(new URL("../../web/index.html", import.meta.url), "utf8");
const sopraFeed = paginaHtml.split(/<main\b[^>]*\bid="feed"/)[0];

test("[UNIT] i comandi del filtro sono sopra il feed (AC-US04-04, AC-US04-05)", () => {
  assert.notEqual(sopraFeed, paginaHtml, "il feed esiste");
  assert.match(sopraFeed, /<div\b[^>]*\bid="pulsanti-tag"[^>]*>/);

  const indicatore = sopraFeed.match(/<p\b[^>]*\bid="filtro-attivo"[^>]*>/);
  assert.ok(indicatore, "l'indicatore del filtro esiste");
  assert.match(indicatore[0], /\shidden(?:\s|>)/);

  const togliFiltro = sopraFeed.match(/<button\b[^>]*\bid="togli-filtro"[^>]*>\s*Togli filtro\s*<\/button>/);
  assert.ok(togliFiltro, "Togli filtro è un pulsante con etichetta");
  assert.match(togliFiltro[0], /\btype="button"/);
  assert.match(togliFiltro[0], /\shidden(?:\s|>)/);
});
