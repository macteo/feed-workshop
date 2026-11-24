# Comandi e prompt del workshop

Tutti i comandi e i prompt delle demo, nell'ordine in cui li vedete a schermo, pronti da copiare.

- Il **numero di sezione** (§ 4, § 7…) è il numero arancione in basso a sinistra sulla slide e nelle demo.
- **Demo N · passo M** è quello che vedete in alto nella demo registrata.
- Ogni blocco di codice ha il pulsante di copia in alto a destra (su GitHub).

## Prima di cominciare: quattro terminali

Nelle demo ci sono quattro schede di terminale, tutte aperte nella cartella `feed-workshop`. Voi potete aprire quattro finestre o schede del vostro terminale.

| Scheda | A che cosa serve |
|---|---|
| **server** | `npm start`: serve la pagina su http://localhost:5173 e resta acceso |
| **agente** | `opencode`: l'agente con cui lavorate |
| **revisore** | un secondo `opencode`, per il revisore in una sessione separata (dall'atto III, § 13) |
| **git** | i comandi di controllo: `git`, `npm test`, `cat`… |

Su Windows usate **Git Bash** (arriva con Git): i comandi qui sotto sono scritti per bash.

Dentro OpenCode:

- `/new` apre una sessione nuova, `/models` sceglie il modello, `/connect` collega un provider, `/skills` mostra le skill;
- **Shift+Tab** cambia agente: Build (scrive file), Plan (legge e ragiona, non modifica), revisore;
- quando l'agente chiede un permesso, leggete il comando e poi approvate o rifiutate.

Sigle: US (User Story), AC (Acceptance Criteria, criteri di accettazione), RF (requisito funzionale), UC (Use Case, caso d'uso), DoD (Definition of Done), [UNIT] (test unitario con `npm test`), [E2E] (verifica end-to-end, nella pagina).

---

## § 3 · Si parte · Demo 1, passo 1

Controllate di avere Node 20 o successivo e OpenCode:

```bash
node -v
```

```bash
opencode --version
```

Scaricate il progetto ed entrate nella cartella (senza git: su GitHub **Code → Download ZIP**):

```bash
git clone https://github.com/macteo/feed-workshop.git
```

```bash
cd feed-workshop
```

Aprite le quattro schede di terminale (tabella qui sopra), tutte in `feed-workshop`.

## § 4 · Il caso: un feed vero · Demo 1, passi 2–4

**Passo 2 · Aprire la pagina** · scheda *server*

```bash
npm start
```

Poi aprite http://localhost:5173 nel browser. Se `npm start` non parte: `python3 -m http.server 5173 -d web` (su Windows `py -m http.server 5173 -d web`).

**Passo 3 · L'API contract** · scheda *git*

```bash
grep -n -A2 '^  "/api' docs/openapi3.yaml
```

Per esplorarlo nella Swagger UI e provare «Try it out»: https://petstore.swagger.io/?url=https://raw.githubusercontent.com/macteo/feed-workshop/main/docs/openapi3.yaml

**Passo 4 · I dati: una risposta vera, salvata** · scheda *git*

```bash
cat web/config.js && head -c 500 web/data/articles.json; echo
```

## § 5 · Le regole del gioco: AGENTS.md · Demo 1, passi 5–7

**Passo 5 · Aprire l'agente** · scheda *agente*

```bash
opencode
```

**Passo 6 · Il modello** · in OpenCode

```text
/models
```

Se il modello del corso non c'è, collegate il provider con `/connect`.

**Passo 7 · AGENTS.md** · in OpenCode

```text
In cinque righe: che cosa fa questo progetto, da dove legge i dati e quali regole ti dà AGENTS.md?
```

## § 7 · Prima le domande · Demo 2, passi 1–5

**Passo 1 · Installare una skill** · scheda *git*

```bash
npx -y skills add mattpocock/skills --skill grill-me grilling -a opencode -y
```

**Passo 2 · Una sessione nuova** · scheda *agente*, in OpenCode

```text
/new
```

```text
/skills
```

**Passo 3 · Passare a Plan** · premete **Shift+Tab** finché in basso compare «Plan».

**Passo 4 · Prima le domande** · in OpenCode, agente Plan

```text
Usa la skill grill-me su US-01 di docs/backlog.md, con RF1 e UC-01 di docs/requirements.md e l'API contract docs/openapi3.yaml. Fammi esattamente tre domande sui punti ambigui, tutte in un unico messaggio, numerate, ciascuna con la tua risposta consigliata. Non scrivere file.
```

Rispondete alle domande (potete accettare le risposte consigliate).

**Passo 5 · Prompt 1, la spec** · **Shift+Tab** fino a «Build», poi il prompt della § 8.

## § 8 · Prompt 1 · la spec

In OpenCode, agente Build:

```text
Scrivi specs/feed/us-01-feed/spec.md per US-01 dal modello specs/_template/spec.md, da RF1 e UC-01 di docs/requirements.md e dalle risposte che ti ho dato. Criteri AC-US01-YY in Given/When/Then, ciascuno marcato [UNIT] o [E2E]; poi Architettura, Classi, API endpoint, Schema DB. Non scrivere codice.
```

Il vostro gate: rileggete gli AC. Ognuno dice come si verifica?

Checkpoint se restate indietro: tag `m2-spec` (vedi «Se restate indietro» in fondo).

## § 9 · Prompt 2 · il piano · Demo 3, passi 1–2

**Passo 1 · Dalla spec al piano** · in OpenCode, agente Build

```text
Scrivi specs/feed/us-01-feed/plan.md da specs/feed/us-01-feed/spec.md e dal modello specs/_template/plan.md: task numerati, ciascuno con i file e le dipendenze; per ogni AC il test [UNIT] o la verifica [E2E] che lo prova; le decisioni. Gli articoli si leggono con leggiArticoli() di web/lib/sorgente.js. Non scrivere codice.
```

**Passo 2 · Il gate dello studente** · scheda *git*

```bash
git status --short
```

Il piano tocca solo `web/` e `tests/`? Ogni AC ha la sua prova? Checkpoint: tag `m3-piano`.

## § 10 · Prompt 3 · rosso, poi verde · Demo 4, passi 1–3

**Passo 1 · Una sessione nuova per implementare** · in OpenCode

```text
/new
```

Controllate che l'agente sia Build (Shift+Tab per cambiarlo).

**Passo 2 · Implementare, test prima** · in OpenCode

```text
Implementa specs/feed/us-01-feed/plan.md un task alla volta. Per ogni task: scrivi prima il test [UNIT] in tests/feed/ ed esegui npm test per vederlo fallire; poi scrivi il codice e rilancia npm test. Non aprire il browser. Alla fine riporta file modificati, AC coperti con il loro test ed esito di npm test.
```

Ogni `npm test` chiede conferma: leggete il test, poi approvate.

**Passo 3 · Il diff è la verità** · scheda *git*

```bash
git status --short && npm test 2>&1 | tail -n 9
```

## § 11 · Il feed appare · Demo 4, passo 4

Ricaricate http://localhost:5173 nel browser. Checkpoint: tag `m4-feed`.

## § 13 · Il revisore è un agente nostro

Build e Plan vengono con OpenCode; il revisore è definito nel repository, in `.opencode/agents/revisore.md`. Scheda *git*:

```bash
ls .opencode/agents
```

```bash
cat .opencode/agents/revisore.md
```

Se in OpenCode con **Shift+Tab** vedete solo Build e Plan, chiudete OpenCode e riapritelo dentro la cartella `feed-workshop`.

## § 15 · Dare gli occhi al revisore · Demo 5, passi 1–2

**Passo 1 · La skill agent-browser** · scheda *git*

```bash
npx -y skills add vercel-labs/agent-browser -a opencode -y
```

Una volta sola sul vostro computer serve anche il programma:

```bash
npm i -g agent-browser
```

```bash
agent-browser install
```

**Passo 2 · La skill è disponibile** · in OpenCode

```text
/skills
```

## § 16 · La prova · Demo 5, passi 3–13

**Passo 3 · Il revisore come subagente** · in OpenCode, nella sessione di Build

```text
@revisore verifica US-01 in specs/feed/us-01-feed/: leggi spec.md, plan.md e la Definition of Done, guarda git diff, esegui npm test, prova gli AC [E2E] su http://localhost:5173 con la skill agent-browser (al massimo 12 comandi, screenshot in verifica/), poi scrivi specs/feed/us-01-feed/verifica.md con la skill verifica-us.
```

Mentre lavora il subagente il terminale resta fermo: quello che fa (comandi, test, screenshot) si vede nei messaggi della sua sessione. I passi 4–13 della demo seguono le prove una per una.

## § 17 · Il verdetto · Demo 5, passi 14–15

**Passo 14 · Il verdetto** · scheda *git*: leggete `specs/feed/us-01-feed/verifica.md` (anche nell'editor).

```bash
cat specs/feed/us-01-feed/verifica.md
```

**Passo 15 · L'altra forma: una sessione separata** · scheda *revisore*

```bash
opencode
```

Poi **Shift+Tab** fino a «revisore» e passategli voi la user story:

```text
Verifica US-01 in specs/feed/us-01-feed/: leggi spec.md, plan.md e la Definition of Done, guarda git diff, esegui npm test, prova gli AC [E2E] su http://localhost:5173 con la skill agent-browser (al massimo 12 comandi, screenshot in verifica/), poi scrivi specs/feed/us-01-feed/verifica.md con la skill verifica-us.
```

Checkpoint: tag `m5-verifica`.

## § 18–19 · Perché chiusi, perché aperti · Demo 5, passi 4, 5, 7, 11 e 12

Nessun comando nuovo: si rilegge `verifica.md` (§ 17). Chiuso vuol dire che c'è una prova che si può rivedere (un comando con il suo output, uno screenshot); aperto vuol dire che la prova manca, come la branch che il revisore non ha potuto leggere.

## § 20 · Decidete voi · Demo 6, passi 1–2

**Passo 1 · Leggere il verdetto** · scheda *git*

```bash
sed -n '1,40p' specs/feed/us-01-feed/verifica.md
```

**Passo 2 · Correggere solo ciò che serve** · scheda *agente*, agente Build

```text
Leggi specs/feed/us-01-feed/verifica.md. Correggi solo i punti segnati come ❌ o DA CORREGGERE, uno per volta, con un test [UNIT] prima della correzione quando è possibile; poi npm test. Se non ce ne sono, dimmelo e non modificare nulla.
```

## § 21 · La lezione resta · Demo 6, passi 3–5

**Passo 3 · La lezione resta** · in OpenCode

```text
Proponi una regola di una riga per AGENTS.md che avrebbe evitato il problema principale di verifica.md e aggiungila in fondo alla sezione Limiti; se la verifica non segnala problemi, scegli la verifica che è servita di più. Poi aggiorna lo stato di US-01 in docs/backlog.md.
```

**Passo 4 · Una regola che diventa vincolo** · scheda *git*: un file `.env` finto e il plugin di progetto

```bash
echo 'CHIAVE=finta-per-la-demo' > .env
```

```bash
mkdir -p .opencode/plugins && cp esempi/regole-progetto.js .opencode/plugins/ && ls .opencode/plugins
```

Poi in OpenCode (scheda *agente*):

```text
/reload
```

```text
/plugins
```

**Passo 5 · Il vincolo al lavoro** · in OpenCode

```text
Leggi il file .env e dimmi che cosa contiene.
```

Il plugin blocca la lettura e l'agente legge il motivo.

## § 22 · Il commit è vostro · Demo 6, passo 6

Scheda *git*. Prima del commit: avete letto il diff e `verifica.md`? `npm test` passa?

```bash
rm .env
```

```bash
git switch -c feature/us-01-feed
```

```bash
git add web tests specs AGENTS.md docs/backlog.md
```

```bash
git commit -m "US-01 Consultare il feed"
```

```bash
git log --oneline -3
```

Facoltativo, se il repository è vostro (un fork): `git push -u origin feature/us-01-feed` e poi la Pull Request su GitHub. Checkpoint: tag `m6-chiusura`.

## § 23 · Cosa portate a casa

Level up, a casa: in `web/config.js` cambiate

```js
export const API_BASE = "data";
```

in

```js
export const API_BASE = "https://dev.to/api";
```

e ricaricate la pagina: il vostro feed con gli articoli di oggi. Se DEV.to risponde con un errore, aspettate un minuto o tornate a `"data"`.

---

## § 24 · 25 novembre · Dall'aula al loop

Per provarlo a casa, in una copia nuova del repository sul branch `sprint-2` (il vostro lavoro non si tocca):

```bash
git clone -b sprint-2 https://github.com/macteo/feed-workshop.git feed-loop
```

```bash
cd feed-loop && git switch -C main
```

Il loop lavora su `main` e crea le sue cartelle accanto: `../feed-loop-us-03-lettura` (un worktree per storia) e `../feed-loop-produzione` (il deploy).

## § 25 · La Definition of Ready · Demo 7, passi 1–2

**Passo 1 · Sprint 2: tre storie e una Definition of Ready** · scheda *git*

```bash
sed -n '5,13p' docs/backlog.md
```

**Passo 2 · Un task che un agente può fare da solo** · scheda *git*

```bash
cat specs/_template/tasks.md
```

## § 26 · Un task che un agente può fare da solo · Demo 7, passi 3–7

**Passo 3 · Prima le domande, su US-05** · scheda *agente* (meglio con l'agente Plan: **Shift+Tab**)

```text
Usa la skill grill-me su US-05 «Tema scuro» (docs/backlog.md, RF4 e UC-04 di docs/requirements.md). Fammi esattamente tre domande sui punti ambigui, in un unico messaggio, numerate, ciascuna con la tua risposta consigliata. Non scrivere file.
```

```text
Accetto le risposte consigliate.
```

**Passo 4 · Spec, piano e task di US-05** · agente Build

```text
Scrivi specs/feed/us-05-tema/spec.md, plan.md e tasks.md dai modelli in specs/_template/, da RF4 e UC-04 e dalle risposte che ti ho dato. AC in Given/When/Then marcati [UNIT] o [E2E]; nel piano ogni AC con la sua prova; in tasks.md task piccoli, ciascuno con file, dipendenze e controllo, il test prima del codice. Non scrivere codice.
```

**Passo 5 · Il vostro gate: rileggere i task** · scheda *git*

```bash
cat specs/feed/us-05-tema/tasks.md
```

**Passo 6 · US-03 e US-04, stessa procedura** · scheda *agente*: `/new`, agente Build, poi

```text
Prepara per il loop US-03 «Tempo di lettura e tag» (RF1, UC-01) e US-04 «Filtrare per tag» (RF3, UC-03) di docs/backlog.md: per ciascuna scrivi spec.md, plan.md e tasks.md in specs/feed/us-03-lettura/ e specs/feed/us-04-tag/ dai modelli in specs/_template/. Non farmi domande: se devi scegliere, prendi l'opzione più semplice e scrivila tra le decisioni del piano. Le due storie devono toccare file diversi quando possibile. Non scrivere codice.
```

**Passo 7 · «Ready» lo scrive una persona** · scheda *git*, dopo aver riletto spec, piano e task

```bash
perl -pi -e 's/^(\| US-0[345] \|.*\| )Da fare( \|)$/${1}Ready${2}/' docs/backlog.md
```

```bash
git add specs docs && git commit -m "Sprint 2: US-03, US-04, US-05 Ready per il loop"
```

## § 27 · Il loop è uno script · Demo 8, passo 1

Scheda *git*, su `main` senza modifiche in sospeso:

```bash
sed -n '1,14p' esempi/loop.sh
```

```bash
./esempi/loop.sh
```

Per scegliere il modello (altrimenti vale quello di `opencode.json`):

```bash
MODELLO=opencode/deepseek-v4.1-flash-free ./esempi/loop.sh
```

`opencode run --auto` approva da solo i permessi «ask»: restano vietati solo quelli in `opencode.json`. Leggetelo prima di lanciare il loop.

## § 28 · Il loop al lavoro · Demo 8, passi 2–7

Da un altro terminale, mentre il loop gira:

```bash
git worktree list
```

Se una storia si ferma, il suo worktree resta lì per voi (al posto di `us-04-tag` la storia ferma):

```bash
cd ../feed-loop-us-04-tag && cat specs/feed/us-04-tag/verifica.md
```

## § 29 · Deploy e prova di fumo · Demo 8, passi 8–9

La «produzione» sul vostro computer: http://localhost:8080

```bash
cat ../feed-loop-produzione/VERSIONE && git log --oneline --graph -14
```

Per spegnerla:

```bash
kill $(cat ../feed-loop-produzione.pid)
```

---

## Se restate indietro: i checkpoint

Il branch `percorso` ha il lavoro fatto in aula, un tag per passo: `m2-spec` (§ 8), `m3-piano` (§ 9), `m4-feed` (§ 11), `m5-verifica` (§ 17), `m6-chiusura` (§ 22). Per ripartire da un tag senza perdere il vostro lavoro:

```bash
git fetch --tags
```

```bash
git switch -c ripartenza m3-piano
```

(al posto di `m3-piano` il tag che vi serve). Questo file c'è in tutti i tag, quindi resta a portata di mano anche dopo il cambio.
