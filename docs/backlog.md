# Product backlog

Sigle: US (User Story), RF (requisito funzionale), UC (Use Case, caso d'uso), SP (story point), AC (Acceptance Criterion, criterio di accettazione).

| US | User story | Epica | RF | UC | SP | Stato |
|---|---|---|---|---|---|---|
| US-01 | Come visitatore voglio scorrere il feed degli articoli pubblicati, per scoprire che cosa si scrive. | feed | RF1 | UC-01 | 3 | Da fare |
| US-02 | Come visitatore voglio segnare un articolo con «Mi piace», per ritrovare a colpo d'occhio quelli che mi sono piaciuti. | feed | RF2 | UC-02 | 2 | Da fare |

Gli story point sono una stima di partenza. Lo stato si aggiorna quando la US rispetta la Definition of Done.

## Definition of Done (versione ridotta del D2, il secondo deliverable del corso)

Una user story è chiusa quando:

- [ ] `spec.md` e `plan.md` della US sono in `specs/feed/us-NN-slug/`; le differenze tra piano ed esecuzione sono annotate.
- [ ] Ogni criterio AC-USNN-YY ha un test automatico `[UNIT]` (unitario) oppure una verifica `[E2E]` (end-to-end, nella pagina) documentata in `verifica.md`.
- [ ] `npm test` passa.
- [ ] Il codice usa solo campi descritti in `docs/openapi3.yaml`.
- [ ] Questo backlog riporta lo stato della US.
- [ ] Il lavoro è su un branch `feature/us-NN-slug`; commit e Pull Request li fa lo studente.
