// Pagina del feed: legge gli articoli con leggiArticoli() e li mostra in #feed.
// La logica senza DOM va in web/lib/*.js (moduli ES), così i test [UNIT] la importano con node --test.
// API contract: docs/openapi3.yaml · Requisiti: docs/requirements.md · Backlog: docs/backlog.md
import { leggiArticoli } from "./lib/sorgente.js";
import { schedaCard, ciSonoAltriArticoli } from "./lib/card.js";

const PER_PAGE = 10;

const feed = document.getElementById("feed");
const avviso = document.getElementById("avviso");
const pulsante = document.getElementById("carica-altri");

let paginaCorrente = 0;

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

// AC-US01-01, AC-US01-09: prima pagina all'apertura; in caso di Error il messaggio va in #avviso.
async function avvia() {
  try {
    const articoli = await leggiArticoli({ page: 1, perPage: PER_PAGE });
    paginaCorrente = 1;
    nascondiAvviso();
    mostraCard(articoli);
    if (!ciSonoAltriArticoli(articoli, PER_PAGE)) pulsante.hidden = true;
  } catch (errore) {
    // Un solo messaggio comprensibile per errori di rete e HTTP (decisione di piano, AC-US01-09).
    console.error(errore);
    feed.hidden = true;
    pulsante.hidden = true;
    mostraAvviso("Impossibile caricare gli articoli");
  }
}

// AC-US01-06, AC-US01-07, AC-US01-08, AC-US01-10: pagina successiva in fondo, pulsante
// disabilitato con etichetta "Caricamento…", nascosto a feed esaurito; su errore le card
// restano, l'avviso compare vicino al pulsante e la riprova è possibile.
const ETICHETTA_PULSANTE = "Carica altri";

async function caricaAltri() {
  pulsante.disabled = true;
  pulsante.textContent = "Caricamento…";
  nascondiAvviso();
  try {
    const articoli = await leggiArticoli({ page: paginaCorrente + 1, perPage: PER_PAGE });
    paginaCorrente += 1;
    mostraCard(articoli);
    if (!ciSonoAltriArticoli(articoli, PER_PAGE)) pulsante.hidden = true;
  } catch (errore) {
    console.error(errore);
    mostraAvviso("Impossibile caricare gli articoli");
  } finally {
    pulsante.disabled = false;
    pulsante.textContent = ETICHETTA_PULSANTE;
  }
}

pulsante.addEventListener("click", caricaAltri);

avvia();
