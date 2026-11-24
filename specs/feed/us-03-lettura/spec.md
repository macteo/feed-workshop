# US-03 – Tempo di lettura e tag

**Riferimenti.** RF1 · UC-01 · 2 SP · epica `feed`. Estende le card di US-01.

## User story
Come visitatore voglio vedere il tempo di lettura e i tag di ogni articolo, per scegliere che cosa leggere.

## Criteri di accettazione (AC, Acceptance Criteria)
- AC-US03-01 [UNIT]: **Given** un articolo con `reading_time_minutes` pari a 4, **When** si genera la card, **Then** il suo HTML contiene il testo «4 min di lettura».
- AC-US03-02 [UNIT]: **Given** un articolo con più tag in `tag_list`, **When** si genera la card, **Then** appaiono tutti, nell'ordine ricevuto, come testo non interattivo; eventuali caratteri HTML restano testo.
- AC-US03-03 [UNIT]: **Given** un articolo con `tag_list` vuoto, **When** si genera la card, **Then** la riga dei tag è assente e il tempo di lettura resta presente.
- AC-US03-04 [E2E]: **Given** il feed con i dati salvati, **When** il visitatore apre la pagina e poi preme «Carica altri», **Then** i metadati sono leggibili sia sulle card iniziali sia su quelle aggiunte in fondo e corrispondono ai dati dei rispettivi articoli.

## Architettura (impatto sul diagramma dei componenti)
Cambia solo il rendering della card. Il feed usa lo stesso rendering per la prima pagina e per quelle successive. Nessun nuovo componente o cambio alla sorgente.

## Classi (impatto sul diagramma delle classi)
Nessuna nuova classe. `schedaCard()` in `web/lib/card.js` rende anche il tempo di lettura e i tag.

## API endpoint
Nessun cambio a `GET /api/articles` o alle richieste di US-01. Nella risposta `ArticleIndex` già letta tramite `leggiArticoli()` si usano `reading_time_minutes` (intero) e `tag_list` (array di stringhe), descritti in `docs/openapi3.yaml`.

## Schema DB
Nessun impatto. I metadati arrivano insieme agli articoli e non vengono salvati nel browser.
