# Task – US-04 Filtrare per tag

Il loop prende il primo task non spuntato. Per ogni task scrivere prima i test `[UNIT]`, poi il codice. Spuntare il task solo a test verdi. Le verifiche `[E2E]` spettano al revisore.

- [ ] T-1 · Testare e aggiungere `tag` opzionale a `leggiArticoli()`: dal vivo inviare `tag` in query, in locale filtrare `tag_list` prima di paginare; senza tag lasciare il comportamento attuale (AC-US04-01, AC-US04-02) · file: `tests/feed/sorgente.test.js`, `web/lib/sorgente.js` · dipende da: — · controllo: `npm test`
- [ ] T-2 · Testare e implementare `unisciTag(tagNoti, articoli)`: restituire l'elenco cumulativo senza duplicati nell'ordine di prima apparizione e senza mutare gli argomenti (AC-US04-03) · file: `tests/feed/tag.test.js`, `web/lib/tag.js` · dipende da: — · controllo: `npm test`
- [ ] T-3 · Testare prima la struttura dei comandi. Aggiungere sopra il feed i pulsanti dei tag, l'indicatore e «Togli filtro»; collegare a `leggiArticoli()` cambio filtro e paginazione, come da piano (AC-US04-04, AC-US04-05). A test verdi annotare le differenze dal piano · file: `tests/feed/filtro-tag-pagina.test.js`, `web/index.html`, `web/app.js`, `specs/feed/us-04-tag/plan.md` · dipende da: T-1, T-2 · controllo: `npm test`
