# Task – US-05 Tema scuro

Il loop esegue un solo task alla volta. Scrivere prima il test `[UNIT]` e verificare che fallisca per il comportamento mancante. Poi implementare, eseguire `npm test` e spuntare il task solo se passa. Le prove `[E2E]` restano al revisore.

- [ ] T-1 · Scrivere i test per la precedenza della preferenza salvata e per il tema opposto, poi implementare le due regole senza DOM (AC-US05-01 e supporto ad AC-US05-03) · file: `tests/feed/tema.test.js`, `web/lib/tema.js` · dipende da: — · controllo: `npm test`
- [ ] T-2 · Scrivere il test per il pulsante nativo con etichetta nella testata, poi aggiungere il pulsante e collegare in `app.js` tema di sistema, scelta salvata, tema della radice ed etichetta. Tenere il flusso separato dagli articoli (AC-US05-02–AC-US05-05) · file: `tests/feed/pagina.test.js`, `web/index.html`, `web/app.js` · dipende da: T-1 · controllo: `npm test`
- [ ] T-3 · Scrivere il test per il contrasto delle coppie di colori, poi applicare le due palette a tutta l’interfaccia, compresi controlli e avvisi (AC-US05-06). Se i test passano, annotare le differenze dal piano · file: `tests/feed/tema-css.test.js`, `web/style.css`, `specs/feed/us-05-tema/plan.md` · dipende da: T-2 · controllo: `npm test`
