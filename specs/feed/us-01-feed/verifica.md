# Verifica – US-01 Scorrere il feed degli articoli pubblicati

Esito: PRONTA

## Criteri di accettazione

| AC | Tipo | Esito | Prova |
|----|------|-------|-------|
| AC-US01-01 | [E2E] | ✅ | All'apertura: `card: 10`, `ordineOk: true` (data-id uguali ai primi 10 di `articles.json`), `richiesteArticlesJson: 1`, `urlConPage: []` (nessuna richiesta con `page=`; in modalità locale l'URL è sempre `/data/articles.json`). Screenshot `verifica/us01-01-02-feed-iniziale.png`. |
| AC-US01-02 | [E2E] | ✅ | Prima card: `avatar: true`, `nome: "Antonio"` (da `user.name`), `data: "Nov 21"` (da `readable_publish_date`, coincide col JSON), `copertina: true`, titolo con `href` = `url` del JSON, `descrizione` non vuota. Screenshot `verifica/us01-01-02-feed-iniziale.png`. |
| AC-US01-03 | [UNIT] | ✅ | `npm test`: «schedaCard() con cover_image null/vuota non contiene <img> di copertina» passano (1 solo `<img>`, l'avatar). Segnaposto CSS `.copertina-contenitore` con `aspect-ratio: 16/9` (web/style.css); allineamento visibile in `verifica/us01-04-clamp-420px.png`. |
| AC-US01-04 | [UNIT] + parte visiva [E2E] | ✅ | [UNIT] «schedaCard() collega il titolo all'articolo» (`target="_blank"`, `rel="noopener"`) e «mantiene integri i testi» passano. [E2E] in pagina: `clampCSS: "3"`, `overflow: hidden` su `.descrizione`, `tutteIntegre: true` (textContent = descrizione del JSON). A viewport 420px il taglio su 3 righe è visibile: screenshot `verifica/us01-04-clamp-420px.png`. |
| AC-US01-05 | [UNIT] | ✅ | `npm test`: «pagina(articoli, 2, 10) restituisce gli articoli 11-20 nell'ordine ricevuto» e «pagina oltre la fine dell'elenco restituisce un elenco vuoto» passano. |
| AC-US01-06 | [E2E] | ✅ | Dopo «Carica altri»: `cardOra: 20`, `prime10Invariate: true`, `nuove10Ok: true` (id 11–20 = JSON); alla pagina 3: `card: 30`, `pagina3Ok: true`, `precedentiInvariati: true`. Card nuove aggiunte in fondo con `insertAdjacentHTML("beforeend", …)` in `web/app.js`. |
| AC-US01-07 | [E2E] | ✅ | Campionato in pagina a +400 ms da una richiesta in volo (sorgente rallentata a 4 s): `durante = {disabled: true, testo: "Caricamento…", opacità: "0.6", cursore: "default"}`; al termine `disabled: false`, `testo: "Carica altri"`. Tastiera: `tag: BUTTON`, `type: "button"`, `focusOk: true` (ante click), regola `:focus-visible` in style.css. Screenshot `verifica/us01-07-caricamento.png` (vedi Problemi n.1: pulsante sotto la piega). |
| AC-US01-08 | [E2E] | ✅ | Click fino a esaurimento: `card: 54`, `ordineOk: true`, `ultimoBloccoDa4: true`, `pulsanteNascosto: true`; conteggio richieste `articles.json` invariato a 600 ms dalla fine (`richiestePrima: richiesteDopo600ms: 11`, `nessunaOltre: true`, unica URL senza `page=`). Screenshot `verifica/us01-08-feed-esaurito.png` (ultime card, nessun pulsante). |
| AC-US01-09 | [E2E] | ✅ | Richiesta `**/articles.json` intercettata con `network route … --abort` (errore di rete) e pagina ricaricata: `wait --text "Impossibile"` risolto; screenshot `verifica/us01-09-errore-iniziale.png` mostra header + messaggio «Impossibile caricare gli articoli» al posto del feed, nessuna card, nessun pulsante, pagina non bianca. |
| AC-US01-10 | [E2E] | ✅ | Fallita solo la richiesta della pagina successiva (fetch che lancia `TypeError` una volta): `cardRestate: 30`, `identiche: true` (card mantenute, stesso ordine), `avvisoVisibile: true` con testo «Impossibile caricare gli articoli», `avvisoVicinoAlPulsante: true` (`role="status"`, subito sopra il comando), `pulsanteAbilitato: true` con etichetta originale, `focusDopoErrore: true`; la riprova funziona (click successivi → 54 card). Stesso messaggio per rete e HTTP: stringa fissa in `web/app.js`, percorso HTTP coperto dal test unitario «una risposta di errore diventa un Error». Screenshot `verifica/us01-10-errore-parziale.png`. |

## Definition of Done

- [x] `spec.md` e `plan.md` in `specs/feed/us-01-feed/`, differenze piano/esecuzione annotate → presenti nella sezione «Differenze tra piano ed esecuzione» di plan.md.
- [x] Ogni AC ha un test [UNIT] o una verifica [E2E] documentata → tutti i 10 AC coperti nella tabella sopra.
- [x] `npm test` passa → 19 test, 19 passati, 0 falliti (`node --test tests/`).
- [x] Codice usa solo campi di `docs/openapi3.yaml` → `web/lib/card.js` legge `id`, `title`, `description`, `cover_image`, `readable_publish_date`, `url`, `user.name`, `user.profile_image_90`: tutti presenti nel API contract; `organization` non è letta.
- [ ] Il backlog riporta lo stato della US → `docs/backlog.md` dice ancora «Da fare»; il piano lo aggiorna dopo questa verifica, è azione di chiusura dello studente.
- [ ] Branch `feature/us-NN-slug`, commit e PR allo studente → non ho potuto leggere il branch corrente (comando git negato dall'approvazione); commit e PR sono dello studente.

## Problemi

Nessun difetto di implementazione riscontrato. Note sulla sola verifica:

1. `verifica/us01-07-caricamento.png` è stato scattato a richiesta in volo ma con il pulsante sotto la piega: lo stato «Caricamento…/disabilitato» è provato dal campionamento DOM in pagina (a +400 ms su una richiesta in volo fino a +4 s), non dai pixel dello screenshot — AC-US01-07, limite del metodo di verifica, non del codice.
2. L'errore HTTP 500 non è stato simulato direttamente in pagina: ho simulato l'errore di rete (abort) e verificato che la stringa mostrata è unica e fissa in `web/app.js` (riga del catch); il caso «risposta non ok → Error» è coperto dal test unitario in `tests/feed/sorgente.test.js` — AC-US01-09/10, copertura indiretta accettabile (estensione 2a non distingue i due errori).
3. `tests/feed/pagina.test.js` ha nome ingannevole: non testa `pagina()` (testata in `tests/feed/sorgente.test.js`) ma il markup di `web/index.html` — non viola alcun AC, ma confonde la lettura dei test (piano task 1/4 non lo elencava fra i file).
4. A viewport largo (1280px) nessuna descrizione delle prime 10 card eccede 3 righe, quindi il clamp è visibile solo restringendo la finestra — comportamento corretto, provato a 420px.

## Da decidere per lo studente

- Portare `docs/backlog.md` US-01 da «Da fare» a «Fatto» a chiusura della US (voce DoD ancora scoperta).
- Confermare di essere su `feature/us-01-feed` prima del commit (non ho potuto leggere il branch corrente).
- Se si vuole uno screenshot dell'AC-US01-07 con il pulsante visibile, ripetere il click con sorgente rallentata e usare `scrollintoview #carica-altri` prima dello screenshot.
- Per prova di completezza, simulare anche un HTTP 500 con `network route **/articles.json --body '{"error":true}'` (o init-script) e verificare che il messaggio resta lo stesso dell'errore di rete.
- Valutare di rinominare `tests/feed/pagina.test.js` in `tests/feed/pagina-html.test.js` per non confonderlo con i test di `pagina()`.
