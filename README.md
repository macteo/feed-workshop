# Feed · progetto del workshop di Ingegneria del Software (UniTN, 24–25 novembre 2026)

Un client web che mostra un feed pubblico di articoli di DEV.to, senza login. Serve per provare con un agente il flusso del D2 (il secondo deliverable del corso, «Sviluppo»): spec, piano, implementazione con i test, verifica.

## Che cosa c'è in `main`, dopo il workshop

`main` contiene il punto d'arrivo dei due giorni:

- **24 novembre.** La user story US-01 «Feed iniziale» fatta con l'agente: `spec.md`, `plan.md`, il codice in `web/`, i test in `tests/` e la verifica del revisore (`verifica.md` e gli screenshot in `verifica/`).
- **25 novembre.** Lo sprint 2 pronto per il loop agentico: US-03, US-04 e US-05 sono **Ready** nel backlog, ciascuna con `spec.md`, `plan.md` e `tasks.md`; lo script `esempi/loop.sh` le implementa con più agenti in parallelo, un worktree per storia, il revisore, commit, merge in `main`, deploy locale e smoke test. I permessi degli agenti sono in `opencode.json`: nessun agente fa commit o merge, li fa lo script (vedi [Il loop agentico](#il-loop-agentico-25-novembre)).

Il risultato del loop registrato in aula è nel tag `m8-loop`; il punto di partenza del 24, senza nulla di fatto, è il tag `m0-inizio`.

> **Tutti i comandi e i prompt delle demo sono in [COMANDI.md](COMANDI.md)**, pronti da copiare, nell'ordine in cui li vedete a schermo. Il numero di ogni sezione (§ 4, § 7…) è il numero arancione in basso a sinistra sulla slide e nelle demo; «Demo N · passo M» è quello che vedete nella demo.

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

## Il loop agentico (25 novembre)

Da `main` pulito, con OpenCode configurato (un modello e le credenziali: `opencode auth login`):

```
./esempi/loop.sh                                              # le storie Ready, in parallelo
PARALLELO=0 ./esempi/loop.sh                                  # una storia alla volta
MODELLO=openrouter/~deepseek/deepseek-flash-latest ./esempi/loop.sh   # un altro modello
```

Che cosa fa, per ogni storia Ready del backlog:

1. crea un worktree `../<cartella>-<storia>` sul branch `feature/<storia>`;
2. passa a `opencode run --auto` un task di `tasks.md` alla volta; il task vale solo se `npm test` passa ed è spuntato (altrimenti un secondo tentativo, poi la storia si ferma);
3. chiama l'agente `revisore` (`.opencode/agents/revisore.md`), che scrive `verifica.md` con `Esito: READY | CHANGES REQUESTED`; con CHANGES REQUESTED un giro di correzioni;
4. con READY, **lo script** fa commit nel branch e, finite tutte le storie, merge in `main` una alla volta (un conflitto lo sistema un agente, ma il merge passa solo se `npm test` passa), e sposta la storia in Done;
5. alla fine copia `web/` in `../<cartella>-produzione`, la serve su http://localhost:8080 e fa uno smoke test con agent-browser.

I log sono in `.loop/`. Con `--auto` i permessi «ask» di `opencode.json` vengono approvati da soli, i «deny» restano: per questo `git add`, `commit`, `merge`, `worktree`, `rm`, `curl` e `npm install` sono vietati agli agenti. I divieti confrontano il testo del comando, non sono una sandbox: leggete `opencode.json` prima di lanciare il loop e fatelo girare su una copia del repository.

Per vedere il risultato senza lanciare nulla: `git switch -c risultato m8-loop`, poi `npm start` e `git log --oneline --graph -12`.

## Se resti indietro: i checkpoint

Il branch `percorso` contiene il lavoro fatto in aula il 24, un tag per passo:

| Tag | Che cosa c'è |
|---|---|
| `m0-inizio` | il punto di partenza del 24: niente spec, niente codice della US-01 |
| `m2-spec` | `specs/feed/us-01-feed/spec.md` (prompt 1) |
| `m3-piano` | in più `plan.md` (prompt 2) |
| `m4-feed` | in più il feed in `web/` e i test in `tests/` (prompt 3) |
| `m5-verifica` | in più `verifica.md` del revisore e gli screenshot in `verifica/` |
| `m6-chiusura` | in più la regola in `AGENTS.md` e la user story chiusa nel backlog |

In cima al branch, dopo `m6-chiusura`, c'è una correzione arrivata dopo la revisione: nelle card diventano link solo gli indirizzi `http(s)` (un `javascript:` non passa). Il revisore non l'aveva vista perché nessun criterio parlava di sicurezza.

Il 25: il branch `sprint-2` è lo stato prima del loop (uguale a `main`), il tag `m8-loop` (branch `loop-registrato`) è il risultato del loop registrato: tre storie in parallelo, un conflitto risolto da un agente, 38 test su 38.

Per ripartire da un checkpoint senza perdere il tuo lavoro: `git fetch --tags`, poi `git switch -c ripartenza m3-piano` (al posto di `m3-piano` il tag che ti serve). Senza git: nella pagina del repository scegli il tag dal menu dei branch (scheda «Tags») e scarica lo ZIP.

## Struttura (come nel D2)

Sigle: RF (requisito funzionale), RNF (requisito non funzionale), UC (Use Case, caso d'uso), US (User Story), AC (Acceptance Criterion, criterio di accettazione), SP (story point), D1 (il primo deliverable del corso, requisiti e casi d'uso).

```
docs/requirements.md     requisiti (RF, RNF), casi d'uso (UC) e criteri, dal D1
docs/backlog.md          user story, story point, stato, Definition of Done
docs/openapi3.yaml       API contract (OpenAPI 3)
specs/feed/intent.md     intent dell'epica
specs/feed/us-NN-slug/   spec.md, plan.md e tasks.md di ogni US (modelli in specs/_template/)
web/                     il sito (web/lib/ per la logica testabile, web/data/ i dati salvati)
tests/feed/              test automatici
AGENTS.md                regole per l'agente
COMANDI.md               comandi e prompt delle demo, numerati come le slide
.opencode/               agente revisore e skill del progetto
esempi/loop.sh           il loop agentico del 25 novembre
esempi/                  anche un plugin di OpenCode, installato durante il workshop
```
