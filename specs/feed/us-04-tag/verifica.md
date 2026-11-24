# Verifica – US-04 Filtrare per tag

Esito: READY

## Criteri di accettazione

| AC | Tipo | Esito | Prova |
|----|------|-------|-------|
| AC-US04-01 | [UNIT] | ✅ | `tests/feed/sorgente.test.js`: «in locale filtra i tag esatti prima di paginare». Le pagine attese sono `[2, 4]`, `[5]` e `[]`. |
| AC-US04-02 | [UNIT] | ✅ | `tests/feed/sorgente.test.js`: «dal vivo invia un solo parametro tag codificato» e «dal vivo chiede page e per_page a DEV.to». `fetchFn` simulata: query con un solo `tag` correttamente decodificato; senza filtro, `tag` assente. |
| AC-US04-03 | [UNIT] | ✅ | `tests/feed/tag.test.js`: «unisciTag() accumula i tag in ordine senza mutare gli argomenti». Due pagine con ripetizioni interne e tra pagine; verifica dell’ordine a ogni passo. |
| AC-US04-04 | [E2E] | ✅ | Su `http://localhost:5182`, `Tab` ha raggiunto il pulsante `programming` ed `Enter` lo ha attivato. Un clic su `beginners` ha sostituito il filtro. Gli ID delle card nel DOM coincidono, in ordine, con i primi 10 ID del JSON per ciascun `tag_list`, senza accodamenti. Screenshot: [feed iniziale](verifica/00-feed-iniziale.png), [programming](verifica/01-programming.png), [beginners](verifica/02-beginners.png). |
| AC-US04-05 | [E2E] | ✅ | Dopo «Togli filtro» sono scomparsi indicatore e comando e sono tornati gli stessi 10 ID iniziali. «Carica altri» ha portato a 20 card: gli ID 11–20 del JSON sono comparsi in fondo, in ordine, senza cambiare i primi 10. Screenshot: [filtro rimosso](verifica/03-filtro-rimosso.png), [prima card della seconda pagina](verifica/04-seconda-pagina.png). |

IDs osservati nel DOM e confrontati con `web/data/articles.json`:

- Feed iniziale e dopo la rimozione: `5090341, 5088783, 5088487, 5083782, 5056698, 5082373, 5077319, 5076064, 5058147, 5068712`.
- `programming`: `5090341, 5082373, 4825824, 5052639, 5042424, 5042083, 5029900, 5016771, 5004421, 4825978`.
- `beginners`: `5090341, 5083782, 5056698, 5082373, 5077319, 5068712, 4825824, 5056840, 5052639, 4846665`.
- Accodati dopo «Carica altri»: `5062324, 4825824, 5056840, 5054249, 5052639, 4828639, 4990085, 4846665, 5004164, 5042424`.

## Definition of Done

- [x] `spec.md` e `plan.md` sono nella cartella della US. Il piano riporta «Nessuna» differenza; la lettura delle modifiche non ne ha evidenziate.
- [x] Tutti e cinque gli AC hanno una prova nella tabella: tre test unitari e due verifiche nel browser.
- [x] `npm test`: 25 passati, 0 falliti.
- [x] Dal codice: `tag_list` è in `ArticleIndex`; `page`, `per_page` e `tag` sono parametri di `GET /api/articles` in `docs/openapi3.yaml`. Nessun nuovo campo fuori contratto.
- [x] US-04 presente nel backlog come `Ready`; l’aggiornamento a `Done` spetta al loop dopo l’esito e non è un punto aperto della revisione.
- [x] Branch verificato: `feature/us-04-tag`. Commit, Pull Request e merge non fanno parte di questa verifica.

## Problemi

Nessun problema bloccante rilevato.

## Da decidere per lo studente

Nessuna correzione richiesta.
