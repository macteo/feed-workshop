# Verifica – US-05 Tema scuro

Esito: READY

## Criteri di accettazione

Prove E2E eseguite in Chromium con `agent-browser` su `http://localhost:5183/`. La porta 5173 non rispondeva.

| AC | Tipo | Esito | Prova |
|----|------|-------|-------|
| AC-US05-01 | [UNIT] | ✅ | Passano i sei casi di `tests/feed/tema.test.js`: preferenza chiara, scura o assente, ciascuna con sistema chiaro e scuro. |
| AC-US05-02 | [E2E] | ✅ | Avvio con entrambi i temi di sistema ([chiaro](verifica/02-avvio-chiaro.png), [scuro](verifica/02-avvio-scuro.png)). A pagina aperta il feed segue il sistema [da chiaro a scuro](verifica/02-cambio-scuro.png) e [da scuro a chiaro](verifica/02-ritorno-chiaro.png). Nei due cambi `performance.timeOrigin` non varia e `localStorage.getItem("feed.tema")` resta `null`. |
| AC-US05-03 | [E2E] | ✅ | Tab porta il focus sul pulsante. [Invio](verifica/03-invio-scuro.png) attiva lo scuro e mostra «Passa al tema chiaro». [Spazio](verifica/03-spazio-chiaro.png) ripristina il chiaro e mostra «Passa al tema scuro». Nessun comando per tornare al tema di sistema. |
| AC-US05-04 | [E2E] | ✅ | Salvato ciascun tema con il pulsante, il feed mantiene la scelta quando il sistema passa al tema opposto e dopo il ricaricamento. Confermati `data-tema` e `feed.tema` in entrambi i casi: [chiaro salvato](verifica/04-preferenza-chiara.png), [scuro salvato](verifica/04-preferenza-scura.png). |
| AC-US05-05 | [E2E] | ✅ | Dopo il caricamento delle 10 card, azzerato il registro di rete. Il registro resta vuoto (`[]`) dopo entrambi i cambi ([scuro](verifica/03-invio-scuro.png), [chiaro](verifica/03-spazio-chiaro.png)): nessuna richiesta a `/api/articles` o `articles.json`. La sorgente configurata nella prova era locale. |
| AC-US05-06 | [E2E] | ✅ | Rapporti testo/sfondo calcolati dagli stili effettivi, risalendo allo sfondo opaco e verificando l'opacità. Valori **chiaro / scuro**, tutti sopra 4,5:1: testata, autore, titolo e pulsanti a riposo o con focus 17,74 / 14,05; fonte, data e descrizione 7,56 / 9,89; link anche in hover, attivo e con focus 8,72 / 8,14; pulsanti in hover o attivi 16,98 / 9,86. Richiesta di paginazione sospesa: «Caricamento…» 6,10 / 6,94. Stessa richiesta fatta fallire: avviso 5,91 / 11,16. Screenshot chiari: [card](verifica/06-light-card.png), [caricamento](verifica/06-light-caricamento.png), [errore](verifica/06-light-errore.png). Screenshot scuri: [card](verifica/06-dark-card.png), [caricamento](verifica/06-dark-caricamento.png), [errore](verifica/06-dark-errore.png). |

## Definition of Done

- [x] `spec.md` e `plan.md` sono nella cartella della US. Il piano annota «Nessuna» differenza; l'implementazione osservata rispecchia i task previsti.
- [x] Tutti e sei i criteri hanno una prova documentata: un criterio unitario e cinque E2E.
- [x] `npm test`: 31 test passati, nessun fallimento.
- [x] Dal confronto con `main`, inclusi i nuovi file letti separatamente, il tema non introduce campi o chiamate API. I campi già usati dal feed sono descritti in `docs/openapi3.yaml`.
- [x] Stato nel backlog demandato al loop dopo l'esito; non è una voce aperta per questa revisione.
- [x] Branch verificato: `feature/us-05-tema`. Commit, Pull Request e merge non fanno parte della revisione.

## Problemi

Nessun problema rilevato.

## Da decidere per lo studente

- Nessuna correzione richiesta.
