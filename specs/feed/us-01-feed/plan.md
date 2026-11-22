# Piano – US-01 Scorrere feed articoli

## Task

1. Test `[UNIT]` di `pagina()`: pagina 2 = articoli dall'11° al 20° nell'ordine ricevuto; pagina oltre la fine = elenco vuoto; `page`/`perPage` non interi o < 1 normalizzati. Estende il file esistente. – `tests/feed/sorgente.test.js`
2. Test `[UNIT]` di `schedaCard()` e `ciSonoAltriArticoli()`: con `cover_image` `null`/vuoto il markup non contiene `<img>` di copertina; titolo collegato con `href` = `url`, `target="_blank"`, `rel="noopener"`; testo di titolo e descrizione integro nel markup; `ciSonoAltriArticoli` `true` su pagina piena, `false` su pagina corta o vuota. – `tests/feed/card.test.js` (nuovo)
3. Implementazione di `schedaCard(articolo)` e `ciSonoAltriArticoli(paginaRicevuta, perPage)`: sola logica pura, nessun DOM, legge solo i campi dell'API contract elencati in spec. – `web/lib/card.js` (nuovo) (dipende da 2)
4. Markup della pagina: pulsante `<button id="carica-altri">` sotto `#feed`, contenitore `#avviso` per messaggi di errore e avvisi, etichette leggibili. – `web/index.html` (dipende da niente; coerente con 3 per le classi usate da `schedaCard`)
5. Stili: layout delle card, `line-clamp` su titolo e descrizione, segnaposto copertina con `aspect-ratio` fisso, stato `disabled` del pulsante, messaggio di errore centrato. – `web/style.css` (dipende da 4)
6. `app.js` parte 1 — avvio: `avvia()` chiama `leggiArticoli({ page: 1, perPage: 10 })`, innesta le card con `schedaCard()` in `#feed`, in caso di `Error` mostra il messaggio in `#avviso` al posto del feed. – `web/app.js` (dipende da 3, 4, 5)
7. `app.js` parte 2 — pagine successive: `caricaAltri()` disabilita il pulsante con etichetta "Caricamento…", chiede la pagina successiva, aggiunge le card in fondo; con pagina corta nasconde il pulsante; su errore mantiene le card, mostra l'avviso vicino al pulsante e lo lascia abilitato. – `web/app.js` (dipende da 6)
8. Esecuzione `npm test` e riscontro delle differenze piano/esecuzione in questo file; aggiornamento dello stato in `docs/backlog.md` solo dopo le verifiche `[E2E]` del revisore. – `specs/feed/us-01-feed/plan.md`, `docs/backlog.md` (dipende da 1–7)

Nessun task tocca `web/data/articles.json`, `tools/` o `web/config.js` (che resta `API_BASE = "data"`).

## Test

- [UNIT] `pagina()`: pagina 2 estrae gli articoli 11–20 nell'ordine ricevuto; oltre la fine restituisce `[]` (AC-US01-05) — task 1
- [UNIT] `schedaCard()`: `cover_image` `null`/vuoto → nessun `<img>` di copertina nel markup (AC-US01-03) — task 2
- [UNIT] `schedaCard()`: titolo collegato (`href` = `url`, `target="_blank"`, `rel="noopener"`) e testi integri nel DOM (AC-US01-04) — task 2
- [UNIT] `ciSonoAltriArticoli()`: base per fine feed e stato del pulsante, usata dal task 7 (supporta AC-US01-08)
- [E2E] Aprire `web/index.html`: alla prima apertura compaiono 10 card nell'ordine del JSON, nessuna richiesta con `page` ≠ 1 (AC-US01-01) — verificata dal revisore dopo il task 6
- [E2E] Ispezionare una card: presenti i sei elementi RF1 — avatar, nome autore, data, copertina, titolo, descrizione (AC-US01-02) — revisore dopo il task 6
- [E2E] Card con descrizione lunga: il testo occupa poche righe in visuale (line-clamp) restando integro nel DOM (AC-US01-04, parte visiva) — revisore dopo il task 5
- [E2E] Premere "Carica altri": 10 card in più in fondo, le esistenti non cambiano (AC-US01-06) — revisore dopo il task 7
- [E2E] Durante il caricamento il pulsante è disabilitato con etichetta "Caricamento…", poi torna premibile; è un `<button>` raggiungibile da tastiera (AC-US01-07) — revisore dopo il task 7
- [E2E] Premere "Carica altri" fino a 54 card: il pulsante scompare e non partono richieste oltre l'ultima pagina (AC-US01-08) — revisore dopo il task 7
- [E2E] Bloccare la sorgente (es. `API_BASE` inesistente o response 500 simulata): messaggio "Impossibile caricare gli articoli" al posto del feed, niente pagina bianca (AC-US01-09) — revisore dopo il task 6
- [E2E] Far fallire solo la richiesta della pagina 2: card della pagina 1 restano, avviso vicino al pulsante, pulsante abilitato e la riprova funziona (AC-US01-10) — revisore dopo il task 7

Tutti gli `[UNIT]` girano con `npm test` (node:test) su `tests/feed/`.

## Decisioni

- `per_page = 10` come in UC-01, non il default 30 dell'API contract: feed leggero e coerente con RNF2; la paginazione locale è già la semantica di `pagina()` in `sorgente.js`, quindi nessun codice nuovo su `leggiArticoli()`.
- Data = `readable_publish_date`: già leggibile, evita parsing di date e problemi di localizzazione.
- Markup della card in `web/lib/card.js` come funzione pura che restituisce stringa: la logica senza DOM finisce in `web/lib/` per vincolo di progetto e diventa coperta dagli `[UNIT]`; `app.js` tiene solo DOM ed eventi.
- Autore = sempre `user` (`user.name`, `user.profile_image_90`), `organization` ignorata: RF1 parla di autore, la scelta resta in un solo punto.
- Copertina assente = nessun `<img>` nel markup, segnaposto solo CSS con `aspect-ratio`: layout stabile e test `[UNIT]` banale sull'assenza del tag.
- Troncamento "poche righe" con `line-clamp` in CSS, DOM integro: niente perdita di testo per gli screen reader (RNF3).
- Fine feed = pagina con meno di `perPage` elementi; durante il caricamento pulsante disabilitato con etichetta "Caricamento…": evita doppi click e rispetta RNF3.
- Errore prima pagina = messaggio in `#avviso` al posto del feed; errore sulle pagine successive = card mantenute, avviso vicino al pulsante abilitato alla riprova; un solo messaggio per errori di rete e HTTP (estensione 2a non li distingue).
- `leggiArticoli()` di `web/lib/sorgente.js` resta l'unico punto che conosce gli indirizzi: `app.js` non scrive URL.

## Differenze tra piano ed esecuzione

- Task 1: i test su `pagina()` passano subito, senza fase di fallimento: la funzione era già implementata in `sorgente.js` (nessuna modifica a `web/lib/` richiesta dal task).
- Task 2: aggiunti due test oltre a quelli elencati nel piano, a presidio di AC-US01-04: escaping HTML dei testi (nessuna iniezione) e presenza in markup di autore, avatar e data.
- Task 4: il `<button id="carica-altri">` è racchiuso in `<p class="comando-feed">` per centrarlo; il test verifica anche `type="button"` (il piano chiedeva solo "un vero `<button>` con etichetta"). `#avviso` nasce con `hidden` e `role="status"`.
- Task 6: su `Error` il messaggio mostrato in `#avviso` è la stringa fissa "Impossibile caricare gli articoli" (non `errore.message`), come deciso in piano: un solo messaggio per errori di rete e HTTP; l'errore originale va in `console.error`.
- Task 5, 6, 7: nessun test `[UNIT]` scritto a monte, perché il piano li prevede solo `[E2E]` a cura del revisore; per `app.js` e `style.css` è stato verificato solo che `npm test` non regredisca.
- `docs/backlog.md` non toccato: lo stato passa a "Fatto" solo dopo le verifiche `[E2E]` del revisore.
- Nessun task ha toccato `web/data/articles.json`, `tools/` o `web/config.js`.
