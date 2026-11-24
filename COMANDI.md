# Comandi e prompt del workshop

Tutti i comandi e i prompt delle demo, nell'ordine in cui li vedete a schermo, pronti da copiare.

- Il **numero di sezione** (§ 4, § 7…) è il numero grande in alto a destra sulla slide.
- **Demo N · passo M** è quello che vedete in alto nella demo registrata.
- Ogni blocco di codice ha il pulsante di copia in alto a destra (su GitHub).

## Prima di cominciare: quattro terminali

Nelle demo ci sono quattro schede di terminale, tutte aperte nella cartella `feed-workshop`. Voi potete aprire quattro finestre o schede del vostro terminale.

| Scheda | A che cosa serve |
|---|---|
| **server** | `npm start`: serve la pagina su http://localhost:5173 e resta acceso |
| **agente** | `opencode`: l'agente con cui lavorate |
| **revisore** | un secondo `opencode`, per il revisore in una sessione separata |
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

## § 14 · Dare gli occhi al revisore · Demo 5, passi 1–2

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

## § 15 · La prova · Demo 5, passo 3

**Passo 3 · Il revisore come subagente** · in OpenCode, nella sessione di Build

```text
@revisore verifica US-01 in specs/feed/us-01-feed/: leggi spec.md, plan.md e la Definition of Done, guarda git diff, esegui npm test, prova gli AC [E2E] su http://localhost:5173 con la skill agent-browser (al massimo 12 comandi, screenshot in verifica/), poi scrivi specs/feed/us-01-feed/verifica.md con la skill verifica-us.
```

## § 16 · Il verdetto · Demo 5, passi 4–5

**Passo 4 · Il verdetto** · scheda *git*: leggete `specs/feed/us-01-feed/verifica.md` (anche nell'editor).

```bash
cat specs/feed/us-01-feed/verifica.md
```

**Passo 5 · L'altra forma: una sessione separata** · scheda *revisore*

```bash
opencode
```

Poi **Shift+Tab** fino a «revisore» e passategli voi la user story:

```text
Verifica US-01 in specs/feed/us-01-feed/: leggi spec.md, plan.md e la Definition of Done, guarda git diff, esegui npm test, prova gli AC [E2E] su http://localhost:5173 con la skill agent-browser (al massimo 12 comandi, screenshot in verifica/), poi scrivi specs/feed/us-01-feed/verifica.md con la skill verifica-us.
```

Checkpoint: tag `m5-verifica`.

## § 17 · Decidete voi · Demo 6, passi 1–2

**Passo 1 · Leggere il verdetto** · scheda *git*

```bash
sed -n '1,40p' specs/feed/us-01-feed/verifica.md
```

**Passo 2 · Correggere solo ciò che serve** · scheda *agente*, agente Build

```text
Leggi specs/feed/us-01-feed/verifica.md. Correggi solo i punti segnati come ❌ o DA CORREGGERE, uno per volta, con un test [UNIT] prima della correzione quando è possibile; poi npm test. Se non ce ne sono, dimmelo e non modificare nulla.
```

## § 18 · La lezione resta · Demo 6, passi 3–5

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

## § 19 · Il commit è vostro · Demo 6, passo 6

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

## § 20 · Cosa portate a casa

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

## § 21 · 25 novembre · L'implementatore si controlla · Demo 7

Da guardare (si può rifare dopo il commit di US-01). Il punto di partenza: US-01 unita in `main`, skill e plugin nel repository, una branch nuova per US-02. Scheda *git*:

```bash
git switch main && git merge --no-ff feature/us-01-feed -m "Merge feature/us-01-feed: US-01 Consultare il feed"
```

```bash
git add .agents skills-lock.json .opencode/plugins && git commit -m "Skill e plugin del progetto"
```

```bash
git switch -c feature/us-02-mi-piace
```

**Passo 1 · Il punto di partenza del 25** · scheda *git*

```bash
git log --oneline --graph -6 && git branch --show-current
```

**Passo 2 · Più autonomia, detta nel prompt** · scheda *agente*: `/new`, agente Build, poi

```text
Lavora su US-02 «Mi piace» (docs/backlog.md, RF2 e UC-02 di docs/requirements.md). Oggi fai i passi di fila, senza aspettare la mia approvazione: 1) scrivi specs/feed/us-02-mi-piace/spec.md e plan.md dai modelli; 2) implementa un task alla volta, test [UNIT] prima, poi npm test; 3) prima di dire che hai finito apri tu la pagina con agent-browser: è già servita su http://localhost:5173, non avviare server (oggi puoi aprire il browser, al massimo 10 comandi, screenshot in specs/feed/us-02-mi-piace/verifica/) e controlla ogni AC [E2E]: se qualcosa non va, correggi e rilancia npm test; Non lanciare il revisore: lo chiamo io. Alla fine dimmi che cosa hai corretto dopo il tuo controllo.
```

**Passo 3 · Il suo controllo nel browser**: gli screenshot sono in `specs/feed/us-02-mi-piace/verifica/`.

**Passo 4 · Il revisore, chiamato da voi** · in OpenCode

```text
@revisore verifica US-02 in specs/feed/us-02-mi-piace/: leggi spec.md, plan.md e la Definition of Done, guarda git diff, esegui npm test, prova gli AC [E2E] su http://localhost:5173 con la skill agent-browser (al massimo 12 comandi, screenshot in specs/feed/us-02-mi-piace/verifica/), poi scrivi specs/feed/us-02-mi-piace/verifica.md con la skill verifica-us.
```

**Passo 5 · Il commit e il merge restano vostri** · scheda *git*

```bash
git add web tests specs docs/backlog.md && git commit -m "US-02 Mi piace"
```

```bash
git switch main && git merge --no-ff feature/us-02-mi-piace -m "Merge feature/us-02-mi-piace" && git log --oneline --graph -4
```

## § 22 · 25 novembre · Più storie in parallelo · Demo 8

Da guardare. Nella demo il backlog aveva due storie in più, US-03 «Tempo di lettura e tag» e US-04 «Filtrare per tag», che nel repository non ci sono: per provarlo, usate due storie vostre al loro posto.

**Passo 1 · Due storie, due worktree** · scheda *git*

```bash
git worktree add ../feed-us-03 -b feature/us-03-lettura
```

```bash
git worktree add ../feed-us-04 -b feature/us-04-tag
```

```bash
git worktree list
```

**Passo 2 · Una scheda per US-03** · un terminale nuovo nella cartella `../feed-us-03`

```bash
WEB_PORT=5174 npm start &
```

```bash
opencode
```

Agente Build, poi:

```text
Lavora su US-03 «Tempo di lettura e tag» (docs/backlog.md e docs/requirements.md). Un'altra sessione lavora in parallelo su US-04 (filtro per tag) in un altro worktree: tocca solo i file che servono alla tua US. Fai i passi di fila e non farmi domande: se devi scegliere, prendi l'opzione più semplice e scrivila tra le decisioni del piano. 1) specs/feed/us-03-lettura/spec.md e plan.md dai modelli; 2) implementa un task alla volta, test [UNIT] prima, poi npm test; 3) controlla tu ogni AC [E2E] con agent-browser su http://localhost:5174, già servita da questa scheda: non avviare server (oggi puoi aprire il browser, al massimo 8 comandi, screenshot in specs/feed/us-03-lettura/verifica/), correggi se serve. Non lanciare il revisore: lo chiamo io.
```

**Passo 3 · Una scheda per US-04** · un altro terminale nuovo, nella cartella `../feed-us-04`

```bash
WEB_PORT=5175 npm start &
```

```bash
opencode
```

Agente Build, poi:

```text
Lavora su US-04 «Filtrare per tag» (docs/backlog.md e docs/requirements.md). Un'altra sessione lavora in parallelo su US-03 (tempo di lettura e tag) in un altro worktree: tocca solo i file che servono alla tua US. Fai i passi di fila e non farmi domande: se devi scegliere, prendi l'opzione più semplice e scrivila tra le decisioni del piano. 1) specs/feed/us-04-tag/spec.md e plan.md dai modelli; 2) implementa un task alla volta, test [UNIT] prima, poi npm test; 3) controlla tu ogni AC [E2E] con agent-browser su http://localhost:5175, già servita da questa scheda: non avviare server (oggi puoi aprire il browser, al massimo 8 comandi, screenshot in specs/feed/us-04-tag/verifica/), correggi se serve. Non lanciare il revisore: lo chiamo io.
```

**Passi 4–5**: si segue il lavoro dei due agenti, rispondendo ai permessi in ciascuna scheda.

**Passo 6 · La verifica di US-03** · nella scheda di US-03

```text
@revisore verifica US-03 in specs/feed/us-03-lettura/: leggi spec.md, plan.md e la Definition of Done, guarda git diff, esegui npm test, prova gli AC [E2E] su http://localhost:5174 con la skill agent-browser (al massimo 12 comandi, screenshot in specs/feed/us-03-lettura/verifica/), poi scrivi specs/feed/us-03-lettura/verifica.md con la skill verifica-us.
```

**Passo 7 · La verifica di US-04** · nella scheda di US-04

```text
@revisore verifica US-04 in specs/feed/us-04-tag/: leggi spec.md, plan.md e la Definition of Done, guarda git diff, esegui npm test, prova gli AC [E2E] su http://localhost:5175 con la skill agent-browser (al massimo 12 comandi, screenshot in specs/feed/us-04-tag/verifica/), poi scrivi specs/feed/us-04-tag/verifica.md con la skill verifica-us.
```

**Passo 8 · Si incontrano al merge** · scheda *git* (nella cartella principale `feed-workshop`)

```bash
git -C ../feed-us-03 add web tests specs && git -C ../feed-us-03 commit -m "US-03 Tempo di lettura e tag"
```

```bash
git -C ../feed-us-04 add web tests specs && git -C ../feed-us-04 commit -m "US-04 Filtrare per tag"
```

```bash
git merge --no-ff feature/us-03-lettura -m "Merge US-03"
```

```bash
git merge --no-ff feature/us-04-tag -m "Merge US-04"
```

Se git si ferma per un conflitto, lo risolve una persona (oppure `git merge --abort` per tornare indietro).

```bash
git log --oneline --graph -7
```

---

## Se restate indietro: i checkpoint

Il branch `percorso` ha il lavoro fatto in aula, un tag per passo: `m2-spec` (§ 8), `m3-piano` (§ 9), `m4-feed` (§ 11), `m5-verifica` (§ 16), `m6-chiusura` (§ 19). Per ripartire da un tag senza perdere il vostro lavoro:

```bash
git fetch --tags
```

```bash
git switch -c ripartenza m3-piano
```

(al posto di `m3-piano` il tag che vi serve). Questo file c'è in tutti i tag, quindi resta a portata di mano anche dopo il cambio.
