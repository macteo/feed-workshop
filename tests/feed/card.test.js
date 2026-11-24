// Test con node:test, senza installare nulla: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { schedaCard, ciSonoAltriArticoli } from "../../web/lib/card.js";

// Articolo di prova conforme ad ArticleIndex (docs/openapi3.yaml), solo campi letti dalla card.
const articolo = (over = {}) => ({
  id: 1234,
  title: "Come testare in modo efficace",
  description: "Una guida pratica con esempi",
  reading_time_minutes: 7,
  tag_list: ["javascript"],
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

// AC-US03-01: formato fisso per il tempo di lettura.
test("[UNIT] schedaCard() mostra i minuti di lettura", () => {
  const markup = schedaCard(articolo({ reading_time_minutes: 4 }));
  assert.match(markup, />4 min di lettura</);
});

// AC-US03-02: tutti i tag in ordine, come testo escapato e non interattivo.
test("[UNIT] schedaCard() mostra i tag sotto la descrizione nell'ordine ricevuto", () => {
  const markup = schedaCard(articolo({ tag_list: ["zeta", "<em>html & css</em>", "alfa"] }));
  assert.match(markup, /<p class="descrizione">[^<]*<\/p>\s*<p class="tag">zeta, &lt;em&gt;html &amp; css&lt;\/em&gt;, alfa<\/p>/);
});

// AC-US03-03: nessuna riga dei tag se la lista è vuota, anche se il campo tags ha un valore.
test("[UNIT] schedaCard() mantiene il tempo di lettura senza la riga dei tag", () => {
  const markup = schedaCard(articolo({ tag_list: [], tags: "alternativo" }));
  assert.match(markup, />7 min di lettura</);
  assert.doesNotMatch(markup, /class="tag"|alternativo/);
});

// Supporto ad AC-US01-08: fine feed = pagina con meno di perPage elementi.
test("[UNIT] ciSonoAltriArticoli() è true su pagina piena", () => {
  assert.equal(ciSonoAltriArticoli(Array(10).fill(articolo()), 10), true);
});

test("[UNIT] ciSonoAltriArticoli() è false su pagina corta o vuota", () => {
  assert.equal(ciSonoAltriArticoli(Array(4).fill(articolo()), 10), false);
  assert.equal(ciSonoAltriArticoli([], 10), false);
});

// Sicurezza: un indirizzo che non è http(s) non diventa un link né un'immagine.
test("[UNIT] schedaCard() non collega un url javascript:", () => {
  const markup = schedaCard(articolo({ url: "javascript:alert(1)" }));
  assert.ok(!/href=/.test(markup));
  assert.ok(markup.includes("Come testare in modo efficace"), "il titolo resta, senza link");
});

test("[UNIT] schedaCard() accetta le immagini salvate in data/ e scarta gli altri schemi", () => {
  const locale = schedaCard(articolo({ cover_image: "data/img/cover-1.webp" }));
  assert.ok(locale.includes('src="data/img/cover-1.webp"'));
  const strana = schedaCard(articolo({ cover_image: "javascript:alert(1)" }));
  assert.equal((strana.match(/<img\b/g) ?? []).length, 1, "resta solo l'avatar");
});
