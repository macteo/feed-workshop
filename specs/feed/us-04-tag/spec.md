# US-04 – Filtrare per tag

**Riferimenti.** RF3 · UC-03 · 3 SP · epica `feed`. Dipende da US-01, non da US-03.

## User story
Come visitatore voglio filtrare il feed per tag, per vedere solo gli argomenti che mi interessano.

## Criteri di accettazione (AC, Acceptance Criteria)
- AC-US04-01 [UNIT]: **Given** la sorgente locale con articoli corrispondenti e non corrispondenti, **When** si chiede una pagina per un tag, **Then** si selezionano le corrispondenze esatte in `tag_list` prima di paginare, nell'ordine originale. Una pagina senza corrispondenze è vuota.
- AC-US04-02 [UNIT]: **Given** la sorgente remota, **When** si chiede una pagina con un tag, **Then** `leggiArticoli()` invia un solo parametro `tag` codificato, oltre a `page` e `per_page`. Senza filtro, non invia `tag`.
- AC-US04-03 [UNIT]: **Given** due pagine non filtrate con tag ripetuti tra o dentro le pagine, **When** si aggiornano i tag disponibili dopo ogni pagina, **Then** ogni tag compare una volta, in ordine di prima apparizione.
- AC-US04-04 [E2E]: **Given** il feed non filtrato, **When** il visitatore attiva da tastiera un pulsante di tag sopra il feed, **Then** vede il nome del filtro attivo e la prima pagina di articoli con quel tag al posto delle card precedenti. Premendo un altro tag, il nuovo filtro sostituisce il primo.
- AC-US04-05 [E2E]: **Given** un filtro attivo, **When** il visitatore preme «Togli filtro», **Then** il nome del filtro scompare e torna la prima pagina non filtrata, da cui si può riprendere a caricare altre pagine.

## Architettura (impatto sul diagramma dei componenti)
La pagina aggiunge sopra il feed i comandi di filtro. Il controller mantiene un solo tag attivo in memoria e passa il tag alla sorgente anche quando chiede altre pagine. Nessun cambio alla card.

## Classi (impatto sul diagramma delle classi)
Nessuna nuova classe. `web/lib/tag.js` unisce i tag disponibili senza duplicati. `web/lib/sorgente.js` estende `leggiArticoli()` con il parametro opzionale `tag`. `web/app.js` gestisce i pulsanti, lo stato del filtro e la paginazione.

## API endpoint
Si usa sempre `GET /api/articles` come in `docs/openapi3.yaml`. Dal vivo si inviano `page`, `per_page` e, solo con filtro attivo, `tag`. Con la copia salvata si usa `tag_list` per filtrare prima di paginare. Una selezione o rimozione riparte da `page=1`, con `per_page=10`.

## Schema DB
Nessun impatto. Tag attivo e tag disponibili vivono solo in memoria per la durata della pagina. Nessun uso di `localStorage`.
