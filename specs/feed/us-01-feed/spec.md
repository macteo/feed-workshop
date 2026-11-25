# US-01 – Scorrere il feed degli articoli pubblicati

**Riferimenti.** RF1 · UC-01 · 3 SP · epica feed.

## User story

Come visitatore, voglio scorrere il feed degli articoli pubblicati, per scoprire che cosa si scrive.

Decisioni prese in fase di grill (concordate):

- Paginazione a 10 articoli per pagina; `leggiArticoli()` di `web/lib/sorgente.js` è l'unico punto che conosce la sorgente e, con `API_BASE = "data"`, taglia localmente i 54 articoli salvati.
- La data mostrata è `readable_publish_date`, senza parsing di date in JavaScript.
- Feed esaurito quando la pagina contiene meno elementi di `per_page`: il pulsante "Carica altri" scompare; durante il caricamento è disabilitato.
- Nella card l'autore è sempre `user` (nome e avatar), mai `organization`.
- Il titolo della card è un collegamento all'articolo (`url`, nuova scheda).
- Senza copertina non viene renderizzato alcun `<img>`: il segnaposto è solo CSS.
- Il testo lungo si taglia in visuale con `line-clamp` in CSS, il DOM mantiene il testo integro.

## Criteri di accettazione

- AC-US01-01 [E2E]: Given i dati salvati in `web/data/articles.json` (54 articoli), When il visitatore apre la pagina, Then vede 10 card, nell'ordine della risposta, senza richieste con `page` diverso da 1 all'apertura.
- AC-US01-02 [E2E]: Given il feed visibile, When il visitatore guarda una card, Then la card mostra i sei elementi di RF1: avatar (`user.profile_image_90`), nome dell'autore (`user.name`), data (`readable_publish_date`), copertina (`cover_image`), titolo (`title`) e descrizione (`description`).
- AC-US01-03 [UNIT]: Given un articolo con `cover_image` pari a `null` o a stringa vuota, When la funzione costruisce il markup della card, Then il markup non contiene nessun `<img>` di copertina (il segnaposto è il contenitore CSS), e la card resta allineata alle altre.
- AC-US01-04 [UNIT]: Given un articolo qualunque, When la funzione costruisce il markup della card, Then il titolo è un collegamento con `href` pari a `url`, `target="_blank"` e `rel="noopener"`, e il testo di titolo e descrizione resta integro nel markup (il taglio in poche righe è visivo, in CSS).
- AC-US01-05 [UNIT]: Given l'elenco caricato di 54 articoli, When `pagina(articoli, 2, 10)` è chiamata, Then restituisce gli articoli dall'11° al 20° nell'ordine ricevuto; Given una pagina oltre la fine dell'elenco, Then restituisce un elenco vuoto.
- AC-US01-06 [E2E]: Given il feed con la prima pagina visibile, When il visitatore preme "Carica altri", Then sotto alle card esistenti ne compaiono altre 10, senza che le precedenti vengano sostituite o spostate.
- AC-US01-07 [E2E]: Given il feed, When il visitatore preme "Carica altri", Then durante la richiesta il pulsante è disabilitato con etichetta leggibile "Caricamento…" e al termine torna premibile con la sua etichetta; il comando resta un `<button>` raggiungibile da tastiera (RNF3).
- AC-US01-08 [E2E]: Given l'ultima pagina con meno di 10 articoli (i 54 salvati producono 6 pagine: 5 da 10 e 1 da 4), When il feed mostra tutti e 54 gli articoli, Then il pulsante "Carica altri" non è più visibile e non parte nessuna richiesta oltre l'ultima pagina.
- AC-US01-09 [E2E]: Given l'API che non risponde o risponde con un errore (estensione 2a), When il visitatore apre la pagina, Then al posto del feed compare un messaggio comprensibile (es. "Impossibile caricare gli articoli"), non una pagina bianca.
- AC-US01-10 [E2E]: Given il feed con alcune card già caricate, When la richiesta della pagina successiva fallisce, Then le card visibili restano in pagina, vicino al pulsante compare un avviso, e il pulsante "Carica altri" resta abilitato per riprovare; un solo messaggio vale sia per errori di rete sia per errori HTTP.

## Architettura (impatto sul diagramma dei componenti)

- `web/index.html`: contenitore `#feed` e pulsante "Carica altri" (un vero `<button>` con etichetta).
- `web/app.js`: solo DOM ed eventi; all'apertura chiede la pagina 1, al click la pagina successiva; gestisce stati caricamento/fine feed/errore.
- `web/lib/sorgente.js` (esistente): unico componente che conosce la sorgente dei dati; `leggiArticoli()` sceglie fra `API_BASE` remoto e copia salvata, `pagina()` taglia l'elenco locale.
- `web/lib/card.js` (nuovo): logica pura senza DOM che produce il markup della singola card, così è coperta dai test `[UNIT]`.
- `web/style.css`: layout delle card, `line-clamp` su titolo/descrizione, segnaposto copertina con `aspect-ratio` fisso, stati del pulsante.
- `web/config.js`: `API_BASE` resta l'unico indirizzo scritto nel progetto; nessuna modifica a `web/data/articles.json` né a `tools/`.

## Classi (impatto sul diagramma delle classi)

Moduli ES in `web/lib/` (logica senza DOM, testabili con `node:test`):

- `sorgente.js` — `leggiArticoli({ page, perPage })`: restituisce la pagina richiesta o lancia `Error` su risposta non valida; `pagina(articoli, page, perPage)`: fetta d'elenco con le stesse regole dell'API.
- `card.js` — `schedaCard(articolo)`: da un articolo `ArticleIndex` al markup della card (autore da `user`, titolo collegato, copertina omessa se assente); `ciSonoAltriArticoli(paginaRicevuta, perPage)`: `true` finché la pagina è piena.
- `app.js` — orchestrazione con DOM: `avvia()` (prima pagina o messaggio di errore), `caricaAltri()` (pagina successiva, disabilitazione pulsante, gestione errore parziale), `mostraCard()` (innesto nel `#feed`).

## API endpoint

- `GET /api/articles` (`docs/openapi3.yaml`, operationId `getArticles`) con `page` a partire da 1 e `per_page=10`. Risposta: array di `ArticleIndex`.
- Campi dell'API contract usati dalla card: `id` (identificativo della card), `title`, `description`, `cover_image` (nullable), `readable_publish_date`, `url`, `user.name`, `user.profile_image_90`. Nessun altro campo viene letto; `organization` è esplicitamente ignorata in questa US.

## Schema DB

Nessun impatto. Nessun dato viene persistito: gli articoli arrivano in sola lettura dalla risposta di `GET /api/articles` salvata in `web/data/articles.json` (in aula) o da DEV.to dal vivo con `API_BASE`. Le preferenze «Mi piace» (localStorage) riguardano US-02/RF2.
