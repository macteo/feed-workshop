// Test con node:test, senza installare nulla: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { schedaCard, ciSonoAltriArticoli } from "../../web/lib/card.js";

// Articolo di prova conforme ad ArticleIndex (docs/openapi3.yaml), solo campi letti dalla card.
const articolo = (over = {}) => ({
  id: 1234,
  title: "Come testare in modo efficace",
  description: "Una guida pratica con esempi",
  cover_image: "https://example.org/cover.jpg",
  readable_publish_date: "Nov 20",
  url: "https://dev.to/mario/come-testare-1abc",
  user: { name: "Mario Rossi", profile_image_90: "https://example.org/avatar.png" },
  ...over,
});

// AC-US01-03: senza copertina (null o stringa vuota) il markup non contiene nessun <img> di copertina.
test("[UNIT] schedaCard() con cover_image null non contiene <img> di copertina", () => {
  const markup = schedaCard(articolo({ cover_image: null }));
  assert.equal((markup.match(/<img\b/g) ?? []).length, 1, "resta solo l'avatar");
  assert.ok(!markup.includes("https://example.org/cover.jpg"));
});

test("[UNIT] schedaCard() con cover_image vuota non contiene <img> di copertina", () => {
  const markup = schedaCard(articolo({ cover_image: "" }));
  assert.equal((markup.match(/<img\b/g) ?? []).length, 1, "resta solo l'avatar");
});

test("[UNIT] schedaCard() con cover_image presente la inserisce come <img>", () => {
  const markup = schedaCard(articolo());
  assert.equal((markup.match(/<img\b/g) ?? []).length, 2, "avatar + copertina");
  assert.ok(markup.includes("https://example.org/cover.jpg"));
});

// AC-US01-04: titolo collegato con href = url, target _blank, rel noopener.
test("[UNIT] schedaCard() collega il titolo all'articolo", () => {
  const a = articolo();
  const markup = schedaCard(a);
  const link = markup.match(/<a\b[^>]*>/g).find((t) => t.includes(a.url));
  assert.ok(link, "c'è un <a> con href pari a url");
  assert.match(link, /target="_blank"/);
  assert.match(link, /rel="[^"]*noopener[^"]*"/);
  assert.ok(markup.includes(a.title), "il testo del titolo è nel collegamento");
});

// AC-US01-04: il testo di titolo e descrizione resta integro nel markup (il taglio è solo CSS).
test("[UNIT] schedaCard() mantiene integri i testi di titolo e descrizione", () => {
  const a = articolo({
    title: "Titolo lungo ".repeat(10) + "fine",
    description: "Descrizione lunga ".repeat(30) + "fine",
  });
  const markup = schedaCard(a);
  assert.ok(markup.includes(a.title));
  assert.ok(markup.includes(a.description));
});

test("[UNIT] schedaCard() mostra autore e data leggibile", () => {
  const a = articolo();
  const markup = schedaCard(a);
  assert.ok(markup.includes("Mario Rossi"));
  assert.ok(markup.includes(a.user.profile_image_90));
  assert.ok(markup.includes(a.readable_publish_date));
});

test("[UNIT] schedaCard() sfugge i testi HTML (niente iniezione)", () => {
  const markup = schedaCard(articolo({ title: "<script>alert(1)</script>", description: "a & b < c" }));
  assert.ok(!markup.includes("<script>alert"));
  assert.ok(markup.includes("&lt;script&gt;"), "il testo resta leggibile in forma escapata");
});

// Supporto ad AC-US01-08: fine feed = pagina con meno di perPage elementi.
test("[UNIT] ciSonoAltriArticoli() è true su pagina piena", () => {
  assert.equal(ciSonoAltriArticoli(Array(10).fill(articolo()), 10), true);
});

test("[UNIT] ciSonoAltriArticoli() è false su pagina corta o vuota", () => {
  assert.equal(ciSonoAltriArticoli(Array(4).fill(articolo()), 10), false);
  assert.equal(ciSonoAltriArticoli([], 10), false);
});
