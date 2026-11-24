# Piano – US-03 Tempo di lettura e tag

## Task
1. **T-1.** Aggiungere prima i test di rendering, poi il tempo di lettura e i tag alla card. Mantenere i campi già mostrati. File: `tests/feed/card.test.js`, `web/lib/card.js`. Nessuna dipendenza. A test verdi, annotare le differenze in `specs/feed/us-03-lettura/plan.md`.

## Test
- [UNIT] `schedaCard()` rende «4 min di lettura» partendo dal numero 4 (AC-US03-01).
- [UNIT] `schedaCard()` rende i tag di `tag_list` nell'ordine ricevuto, senza link o pulsanti nella riga dei tag. Usare un tag sintetico con caratteri HTML e verificare che sia escapato (AC-US03-02).
- [UNIT] Con `tag_list` vuoto `schedaCard()` omette la riga dei tag ma non il tempo di lettura (AC-US03-03).
- [E2E] Con i dati salvati, verificare una card della prima pagina e la prima card aggiunta dopo «Carica altri». Usare il `data-id` della card per confrontare minuti e tag con il JSON. Portare in vista ciascuna card prima dello screenshot (AC-US03-04).

## Decisioni
- Usare il formato fisso «N min di lettura» e, sotto la descrizione, una riga di tag separati da virgole. Omettere la riga se la lista è vuota; non usare il campo `tags` come ripiego.
- Riutilizzare l'escaping della card per i tag. Non introdurre pulsanti, stili dedicati o richieste aggiuntive. Il filtro di US-04 vive fuori dalle card ed è indipendente.

## Differenze tra piano ed esecuzione
- Nessuna.
