# Feed · progetto del workshop di Ingegneria del Software (UniTN, 24–25 novembre 2026)

Un client web che mostra un feed pubblico di articoli di DEV.to, senza login. Serve per provare il flusso del D2 con un agente: spec, piano, implementazione con i test, verifica.

## Partire

Serve **Node.js 20 o successivo** (`node -v`) e **OpenCode** (`opencode --version`).

Scarica il progetto in uno dei due modi:

- con git: `git clone https://github.com/macteo/feed-workshop.git` e poi `cd feed-workshop`;
- senza git: su https://github.com/macteo/feed-workshop premi **Code → Download ZIP**, estrai l'archivio e apri la cartella nel terminale.

Poi:

```
npm start        # il sito su http://localhost:5173 (nessun backend: solo file statici)
npm test         # test con node:test, senza installare nulla
opencode         # l'agente, in un secondo terminale
```

Se `npm start` non parte, qualunque server di file statici va bene, sempre sulla porta 5173: `python3 -m http.server 5173 -d web`, oppure Live Server di VS Code sulla cartella `web/`. Aprire `index.html` con un doppio clic non basta: il browser blocca la lettura dei dati.

**I dati.** Non c'è un backend da avviare. `web/data/articles.json` è la risposta vera di `GET /api/articles` di DEV.to, salvata il 22/11/2026 (54 articoli, con le immagini): funziona anche senza rete. Il codice la legge con `leggiArticoli()` di `web/lib/sorgente.js`.

**Il contratto.** È in `docs/openapi3.yaml`. Per esplorarlo e provare le chiamate senza installare nulla: https://petstore.swagger.io/?url=https://raw.githubusercontent.com/macteo/feed-workshop/main/docs/openapi3.yaml (oppure https://editor.swagger.io, File → Import URL). «Try it out» chiama DEV.to dal vivo.

**Level up: DEV.to dal vivo.** In `web/config.js` cambia `API_BASE` da `"data"` a `"https://dev.to/api"` e ricarica: stessi campi, articoli di oggi. DEV.to limita le richieste: se risponde con un errore, aspetta un minuto o torna a `"data"`.

## Struttura (come nel D2)

```
docs/requirements.md     RF, RNF, UC e criteri (dal D1)
docs/backlog.md          user story, story point, stato, Definition of Done
docs/openapi3.yaml       contratto delle API (OpenAPI 3)
specs/feed/intent.md     intent dell'epica
specs/feed/us-NN-slug/   spec.md e plan.md di ogni US (modelli in specs/_template/)
web/                     il sito (web/lib/ per la logica testabile, web/data/ i dati salvati)
tests/feed/              test automatici
AGENTS.md                regole per l'agente
.opencode/               agente revisore e skill del progetto
esempi/                  un plugin di OpenCode da installare durante il workshop
```
