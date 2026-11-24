// Pagina del feed: legge gli articoli con leggiArticoli() e li mostra in #feed.
// La logica senza DOM va in web/lib/*.js (moduli ES), così i test [UNIT] la importano con node --test.
// API contract: docs/openapi3.yaml · Requisiti: docs/requirements.md · Backlog: docs/backlog.md
import { leggiArticoli } from "./lib/sorgente.js";
import { schedaCard, ciSonoAltriArticoli } from "./lib/card.js";
import { unisciTag } from "./lib/tag.js";
import { temaEffettivo, temaOpposto } from "./lib/tema.js";

function inizializzaTema() {
  const chiaveTema = "feed.tema";
  const temaSistema = window.matchMedia("(prefers-color-scheme: dark)");
  const pulsanteTema = document.getElementById("cambia-tema");
  let preferenza = localStorage.getItem(chiaveTema);

  function leggiTema() {
    return temaEffettivo(preferenza, temaSistema.matches ? "dark" : "light");
  }

  function aggiornaTema() {
    const tema = leggiTema();
    document.documentElement.dataset.tema = tema;
    pulsanteTema.textContent = temaOpposto(tema) === "dark"
      ? "Passa al tema scuro"
      : "Passa al tema chiaro";
  }

  temaSistema.addEventListener("change", aggiornaTema);
  pulsanteTema.addEventListener("click", () => {
    preferenza = temaOpposto(leggiTema());
    localStorage.setItem(chiaveTema, preferenza);
    aggiornaTema();
  });
  aggiornaTema();
}

const PER_PAGE = 10;
const ETICHETTA_PULSANTE = "Carica altri";

const feed = document.getElementById("feed");
const avviso = document.getElementById("avviso");
const pulsante = document.getElementById("carica-altri");
const pulsantiTag = document.getElementById("pulsanti-tag");
const indicatoreFiltro = document.getElementById("filtro-attivo");
const togliFiltro = document.getElementById("togli-filtro");

let paginaCorrente = 0;
let tagAttivo;
let caricamento = false;
const pulsantiPerTag = new Map();

function mostraCard(articoli) {
  for (const articolo of articoli) {
    feed.insertAdjacentHTML("beforeend", schedaCard(articolo));
  }
}

function mostraAvviso(testo) {
  avviso.textContent = testo;
  avviso.hidden = false;
}

function nascondiAvviso() {
  avviso.textContent = "";
  avviso.hidden = true;
}

function aggiornaTagDisponibili(articoli) {
  for (const tag of unisciTag(pulsantiPerTag.keys(), articoli)) {
    if (pulsantiPerTag.has(tag)) continue;
    const bottoneTag = document.createElement("button");
    bottoneTag.type = "button";
    bottoneTag.textContent = tag;
    bottoneTag.disabled = caricamento;
    bottoneTag.addEventListener("click", () => caricaPagina(1, tag));
    pulsantiPerTag.set(tag, bottoneTag);
    pulsantiTag.append(bottoneTag);
  }
}

function mostraFiltro() {
  indicatoreFiltro.textContent = tagAttivo ? `Filtro attivo: ${tagAttivo}` : "";
  indicatoreFiltro.hidden = !tagAttivo;
  togliFiltro.hidden = !tagAttivo;
  for (const [tag, bottoneTag] of pulsantiPerTag) {
    bottoneTag.setAttribute("aria-pressed", String(tag === tagAttivo));
  }
}

function impostaCaricamento(attivo) {
  caricamento = attivo;
  pulsante.disabled = attivo;
  pulsante.textContent = attivo ? "Caricamento…" : ETICHETTA_PULSANTE;
  togliFiltro.disabled = attivo;
  for (const bottoneTag of pulsantiPerTag.values()) bottoneTag.disabled = attivo;
}

// La prima pagina sostituisce il feed; le successive si aggiungono in fondo.
// Filtro e pagina restano invariati se la richiesta fallisce.
async function caricaPagina(page, tag) {
  if (caricamento) return;
  impostaCaricamento(true);
  nascondiAvviso();
  try {
    const articoli = await leggiArticoli({ page, perPage: PER_PAGE, tag });
    paginaCorrente = page;
    tagAttivo = tag;
    if (!tagAttivo) aggiornaTagDisponibili(articoli);
    mostraFiltro();
    if (page === 1) feed.replaceChildren();
    mostraCard(articoli);
    if (page === 1 && tagAttivo && articoli.length === 0) {
      const vuoto = document.createElement("p");
      vuoto.textContent = "Nessun articolo per questo tag";
      feed.append(vuoto);
    }
    pulsante.hidden = !ciSonoAltriArticoli(articoli, PER_PAGE);
  } catch (errore) {
    console.error(errore);
    if (paginaCorrente === 0) {
      feed.hidden = true;
      pulsante.hidden = true;
    }
    mostraAvviso("Impossibile caricare gli articoli");
  } finally {
    impostaCaricamento(false);
  }
}

pulsante.addEventListener("click", () => caricaPagina(paginaCorrente + 1, tagAttivo));
togliFiltro.addEventListener("click", () => caricaPagina(1));

inizializzaTema();
caricaPagina(1);
