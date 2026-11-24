# Verifica – US-03 Tempo di lettura e tag

Esito: READY

## Criteri di accettazione
| AC | Tipo | Esito | Prova |
|----|------|-------|-------|
| AC-US03-01 | [UNIT] | ✅ | `schedaCard() mostra i minuti di lettura`: verifica «4 min di lettura». |
| AC-US03-02 | [UNIT] | ✅ | `schedaCard() mostra i tag sotto la descrizione nell'ordine ricevuto`: verifica l'ordine, il testo senza elementi interattivi e l'escaping dei caratteri HTML. |
| AC-US03-03 | [UNIT] | ✅ | `schedaCard() mantiene il tempo di lettura senza la riga dei tag`: verifica l'assenza della riga e la presenza dei minuti, senza ripiego su `tags`. |
| AC-US03-04 | [E2E] | ✅ | Su `http://localhost:5181/`, i metadati delle 10 card iniziali e delle 10 aggiunte dopo «Carica altri» corrispondono a `web/data/articles.json`, confrontati per `data-id`. I due screenshot mostrano i metadati leggibili: [prima card](verifica/ac-us03-04-prima-pagina.png), ID `5090341`, 3 min, `programming, beginners, webdev, necoz`; [prima card aggiunta](verifica/ac-us03-04-dopo-carica-altri.png), ID `5062324`, 18 min, `nextjs, webdev, javascript, caching`. |

## Definition of Done
- [x] `spec.md` e `plan.md` sono nella directory della US. Il piano annota «Nessuna» differenza e il diff è coerente con T-1.
- [x] Ogni AC ha un test `[UNIT]` passato o una prova `[E2E]` documentata sopra.
- [x] `npm test` passa: 24 test superati, 0 falliti.
- [x] Dal diff risulta che i soli nuovi campi letti sono `tag_list` e `reading_time_minutes`, entrambi definiti in `ArticleIndex` in `docs/openapi3.yaml`.
- [x] Il backlog riporta «Ready». L'aggiornamento dopo la verifica spetta al loop e non blocca l'esito.
- [x] Il branch corrente è `feature/us-03-lettura`. Commit, Pull Request e merge sono fuori dalla verifica.

## Problemi
Nessun problema rilevato rispetto agli AC o alla Definition of Done.

## Da decidere per lo studente
Nessuna correzione richiesta.
