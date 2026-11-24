# Feed · regole per l'agente

- **Rispondi sempre in italiano**, con frasi brevi.
- Il progetto è un client web senza librerie (HTML, CSS, JavaScript). Non c'è un backend: `web/data/articles.json` è una risposta di DEV.to salvata e **non si modifica**, come `tools/`.

## Dove stanno le cose (struttura del D2, il secondo deliverable del corso)

Sigle: RF (requisito funzionale), RNF (requisito non funzionale), UC (Use Case, caso d'uso), US (User Story), AC (Acceptance Criterion, criterio di accettazione), D1 (il primo deliverable del corso).

- `docs/requirements.md`: RF, RNF, UC e criteri dal D1. `docs/backlog.md`: user story, story point, stato, Definition of Done.
- `docs/openapi3.yaml`: l'API contract (OpenAPI 3). Usa solo campi che esistono qui.
- `specs/<epica>/intent.md` e, per ogni US, `specs/<epica>/us-NN-slug/spec.md` e `plan.md`. I modelli sono in `specs/_template/`.
- `web/`: il sito. Gli articoli si leggono **solo** con `leggiArticoli()` di `web/lib/sorgente.js`, che usa `API_BASE` di `web/config.js`: non scrivere indirizzi altrove. La logica senza DOM va in `web/lib/` (moduli ES, cioè ECMAScript con `import` ed `export`).
- `tests/<epica>/`: test con `node:test` (`npm test`).

## Come si lavora: tre richieste, una alla volta

1. **Spec.** Scrivi `spec.md` della US dal modello e da `docs/requirements.md`: user story, criteri AC-USNN-YY in Given/When/Then, Architettura, Classi, API endpoint, Schema DB. Se una sezione non ha impatto scrivilo esplicitamente. Se un requisito è ambiguo, chiedi prima di decidere.
2. **Piano.** Scrivi `plan.md` da `spec.md`: task numerati con file e dipendenze, test `[UNIT]` (unitari, con `npm test`) e verifiche `[E2E]` (end-to-end, nella pagina) legati agli AC, decisioni.
3. **Implementazione.** Un task alla volta: prima il test `[UNIT]`, poi il codice, poi `npm test`. Non aprire il browser: le verifiche `[E2E]` le fa il revisore.

Lavora solo sulla US indicata nel prompt. Aspetta l'approvazione dello studente tra un passo e l'altro.

## Lavoro in loop (`esempi/loop.sh`)

Quando il prompt ti indica un task `T-N` di `specs/<epica>/us-NN-slug/tasks.md`:

- fai solo quel task, toccando solo i file che elenca (più i test);
- prima il test `[UNIT]`, poi il codice, poi `npm test`;
- quando `npm test` passa, spunta il task in `tasks.md` (`- [x] T-N`) e fermati. Commit, merge e backlog li fa il loop.

## Limiti

- **Non eseguire mai** `git add`, `git commit`, `git push`, `git reset`, `git checkout`: branch `feature/us-NN-slug`, commit e Pull Request li fa lo studente.
- A fine lavoro riporta: file modificati, AC coperti e con quale test, esito di `npm test`, differenze dal piano.
- Negli screenshot `[E2E]`, prima di scattare, porta in visuale l'elemento che deve provare lo stato (es. `scrollintoview` sul elemento ispezionato): lo stato verificato deve essere visibile nei pixel, non solo nel DOM.
