# Feed · progetto del workshop di Ingegneria del Software (UniTN, 24–25 novembre 2026)

Un client web che mostra un feed pubblico di articoli di DEV.to, senza login. Serve per provare con un agente il flusso del D2 (il secondo deliverable del corso, «Sviluppo»): spec, piano, implementazione con i test, verifica.

> **Tutti i comandi e i prompt delle demo sono in [COMANDI.md](COMANDI.md)**, pronti da copiare, nell'ordine in cui li vedete a schermo. Il numero di ogni sezione (§ 4, § 7…) è il numero grande in alto a destra sulla slide; «Demo N · passo M» è quello che vedete nella demo.

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

Se `npm start` non parte, qualunque server di file statici va bene, sempre sulla porta 5173: `python3 -m http.server 5173 -d web` (su Windows `py -m http.server 5173 -d web`), oppure Live Server di VS Code sulla cartella `web/`. Aprire `index.html` con un doppio clic non basta: il browser blocca la lettura dei dati.

**I dati.** Non c'è un backend da avviare. `web/data/articles.json` è la risposta vera di `GET /api/articles` di DEV.to, salvata il 22/11/2026 (54 articoli, con le immagini): funziona anche senza rete. Il codice la legge con `leggiArticoli()` di `web/lib/sorgente.js`.

**L'API contract.** È in `docs/openapi3.yaml`, scritto in formato OpenAPI 3: descrive gli endpoint e i campi delle risposte. Per esplorarlo e provare le chiamate senza installare nulla: https://petstore.swagger.io/?url=https://raw.githubusercontent.com/macteo/feed-workshop/main/docs/openapi3.yaml (oppure https://editor.swagger.io, File → Import URL). «Try it out» chiama DEV.to dal vivo.

**Level up: DEV.to dal vivo.** In `web/config.js` cambia `API_BASE` da `"data"` a `"https://dev.to/api"` e ricarica: stessi campi, articoli di oggi. DEV.to limita le richieste: se risponde con un errore, aspetta un minuto o torna a `"data"`.

## Se resti indietro: i checkpoint

Il branch `percorso` contiene il lavoro fatto in aula, un tag per passo:

| Tag | Che cosa c'è |
|---|---|
| `m2-spec` | `specs/feed/us-01-feed/spec.md` (prompt 1) |
| `m3-piano` | in più `plan.md` (prompt 2) |
| `m4-feed` | in più il feed in `web/` e i test in `tests/` (prompt 3) |
| `m5-verifica` | in più `verifica.md` del revisore e gli screenshot in `verifica/` |
| `m6-chiusura` | in più la regola in `AGENTS.md` e la user story chiusa nel backlog |

In cima al branch, dopo `m6-chiusura`, c'è una correzione arrivata dopo la revisione: nelle card diventano link solo gli indirizzi `http(s)` (un `javascript:` non passa). Il revisore non l'aveva vista perché nessun criterio parlava di sicurezza.

Per ripartire da un checkpoint senza perdere il tuo lavoro: `git fetch --tags`, poi `git switch -c ripartenza m3-piano` (al posto di `m3-piano` il tag che ti serve). Senza git: nella pagina del repository scegli il tag dal menu dei branch (scheda «Tags») e scarica lo ZIP.

## Struttura (come nel D2)

Sigle: RF (requisito funzionale), RNF (requisito non funzionale), UC (Use Case, caso d'uso), US (User Story), AC (Acceptance Criterion, criterio di accettazione), SP (story point), D1 (il primo deliverable del corso, requisiti e casi d'uso).

```
docs/requirements.md     requisiti (RF, RNF), casi d'uso (UC) e criteri, dal D1
docs/backlog.md          user story, story point, stato, Definition of Done
docs/openapi3.yaml       API contract (OpenAPI 3)
specs/feed/intent.md     intent dell'epica
specs/feed/us-NN-slug/   spec.md e plan.md di ogni US (modelli in specs/_template/)
web/                     il sito (web/lib/ per la logica testabile, web/data/ i dati salvati)
tests/feed/              test automatici
AGENTS.md                regole per l'agente
COMANDI.md               comandi e prompt delle demo, numerati come le slide
.opencode/               agente revisore e skill del progetto
esempi/                  un plugin di OpenCode da installare durante il workshop
```
