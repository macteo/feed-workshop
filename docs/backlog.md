# Product backlog

Sigle: US (User Story), RF (requisito funzionale), UC (Use Case, caso d'uso), SP (story point), AC (Acceptance Criterion, criterio di accettazione).

| US | User story | Epica | RF | UC | SP | Stato |
|---|---|---|---|---|---|---|
| US-01 | Come visitatore voglio scorrere il feed degli articoli pubblicati, per scoprire che cosa si scrive. | feed | RF1 | UC-01 | 3 | Done |
| US-02 | Come visitatore voglio segnare un articolo con «Mi piace», per ritrovare a colpo d'occhio quelli che mi sono piaciuti. | feed | RF2 | UC-02 | 2 | To do |
| US-03 | Come visitatore voglio vedere il tempo di lettura e i tag di ogni articolo, per scegliere che cosa leggere. | feed | RF1 | UC-01 | 2 | Done |
| US-04 | Come visitatore voglio filtrare il feed per tag, per vedere solo gli argomenti che mi interessano. | feed | RF3 | UC-03 | 3 | Ready |
| US-05 | Come visitatore voglio passare al tema scuro, per leggere comodamente di sera, e ritrovarlo quando torno. | feed | RF4 | UC-04 | 2 | Ready |

Gli story point sono una stima di partenza. Stati: **To do** → **Ready** (rispetta la Definition of Ready) → **Done** (rispetta la Definition of Done).

## Definition of Ready

Una user story è **Ready**, e il loop (`esempi/loop.sh`) la può prendere, quando:

- [ ] `spec.md` ha criteri AC-USNN-YY in Given/When/Then, ognuno marcato `[UNIT]` o `[E2E]`, e le quattro sezioni di impatto;
- [ ] `plan.md` lega ogni AC al suo test o alla sua verifica;
- [ ] `tasks.md` divide il piano in task che un agente può fare da solo: file toccati, dipendenze, comando di controllo;
- [ ] lo studente ha riletto spec, piano e task e ha scritto «Ready» in questo backlog.

## Definition of Done (versione ridotta del D2, il secondo deliverable del corso)

Una user story è chiusa quando:

- [ ] `spec.md` e `plan.md` della US sono in `specs/feed/us-NN-slug/`; le differenze tra piano ed esecuzione sono annotate.
- [ ] Ogni criterio AC-USNN-YY ha un test automatico `[UNIT]` (unitario) oppure una verifica `[E2E]` (end-to-end, nella pagina) documentata in `verifica.md`.
- [ ] `npm test` passa.
- [ ] Il codice usa solo campi descritti in `docs/openapi3.yaml`.
- [ ] Questo backlog riporta lo stato della US.
- [ ] Il lavoro è su un branch `feature/us-NN-slug`; commit e Pull Request li fa lo studente.
