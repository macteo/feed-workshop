# Piano – US-04 Filtrare per tag

## Task
1. **T-1.** Testare ed estendere `leggiArticoli()` per il filtro locale e remoto. File: `tests/feed/sorgente.test.js`, `web/lib/sorgente.js`. Nessuna dipendenza.
2. **T-2.** Testare e aggiungere `unisciTag(tagNoti, articoli)` per ricavare i tag disponibili, senza DOM e senza modificare gli argomenti. File: `tests/feed/tag.test.js`, `web/lib/tag.js`. Nessuna dipendenza.
3. **T-3.** Testare la struttura dei comandi, poi collegare filtro, indicatore e paginazione. File: `tests/feed/filtro-tag-pagina.test.js`, `web/index.html`, `web/app.js`. Dipende da T-1 e T-2. A test verdi, annotare le differenze in `specs/feed/us-04-tag/plan.md`.

## Test
- [UNIT] Con `fetchFn` finta e articoli sintetici mescolati, verificare le prime due pagine filtrate in ordine, escludere un tag che contiene solo una sottostringa del filtro e verificare una pagina vuota. I risultati devono distinguere «filtra prima» da «pagina prima» (AC-US04-01).
- [UNIT] Con `fetchFn` finta verificare la query della richiesta remota: `page`, `per_page`, un solo `tag` con un valore sintetico che richiede codifica. Mantenere il test esistente per l'URL senza filtro (AC-US04-02).
- [UNIT] Chiamare `unisciTag()` su due pagine sintetiche in sequenza, con tag ripetuti nella stessa pagina e tra le pagine. Verificare ordine, assenza di duplicati e che gli argomenti restino invariati (AC-US04-03).
- [UNIT] Leggere `web/index.html`: verificare che sopra `#feed` esistano il contenitore dei pulsanti, l'indicatore del filtro e il `<button type="button">` «Togli filtro», inizialmente nascosto (supporto ad AC-US04-04 e AC-US04-05).
- [E2E] Con i dati salvati, annotare gli ID della prima pagina non filtrata. Raggiungere un pulsante tag da tastiera e attivarlo. Confrontare gli ID visibili con i primi 10 risultati del JSON filtrato per `tag_list`. Attivare un secondo tag e verificare allo stesso modo che cambi il filtro, senza sommare i risultati (AC-US04-04).
- [E2E] Premere «Togli filtro». Verificare che l'indicatore si nasconda e che ricompaiano gli ID iniziali nello stesso ordine. Premere «Carica altri» e verificare che arrivino in fondo gli articoli 11–20 del feed completo (AC-US04-05). Prima degli screenshot portare in vista lo stato da documentare.

## Decisioni
- Usare pulsanti nativi sopra il feed, non i tag delle card. Mostrare solo i tag incontrati nelle pagine non filtrate caricate con successo. Tenerli disponibili fino al ricaricamento della pagina, anche durante il filtro e dopo averlo tolto. Nessuna richiesta per scoprire altri tag.
- Mostrare un solo indicatore «Filtro attivo: …» e il pulsante «Togli filtro» solo quando il filtro è attivo. Usare testo per le etichette provenienti dagli articoli, non HTML.
- Selezionare o togliere il filtro sostituisce il feed con pagina 1. «Carica altri» aggiunge la pagina successiva con il tag corrente, oppure senza tag se il filtro non è attivo. Conservare la regola di US-01: nascondere il comando a una pagina con meno di 10 risultati.
- Gestire una richiesta alla volta disabilitando i comandi durante il caricamento. Se un cambio filtro fallisce, conservare l'ultimo feed riuscito, il filtro e la pagina, e usare l'avviso di US-01. Se una prima pagina filtrata è vuota, mostrare «Nessun articolo per questo tag» e lasciare disponibile «Togli filtro».

## Differenze tra piano ed esecuzione
- Nessuna.
