# Piano – US-05 Tema scuro

## Task

1. **T-1 · Regole del tema.** Prima i test in `tests/feed/tema.test.js`, poi il modulo `web/lib/tema.js`. Nessuna dipendenza.
2. **T-2 · Pulsante e sincronizzazione.** Prima il test HTML in `tests/feed/pagina.test.js`, poi il pulsante in `web/index.html` e il collegamento a preferenza locale e tema di sistema in `web/app.js`. Dipende da T-1.
3. **T-3 · Palette e contrasto.** Prima il test sulle coppie di colori in `tests/feed/tema-css.test.js`, poi gli stili in `web/style.css`. A fine task aggiornare `specs/feed/us-05-tema/plan.md` con le differenze riscontrate. Dipende da T-2.

## Test

- [UNIT] **AC-US05-01 · T-1.** Con `node:test`, provare tutte le combinazioni di preferenza chiara, scura o assente e sistema chiaro o scuro.
- [UNIT] **AC-US05-03 · T-1 e T-2, prove di supporto.** Provare il calcolo del tema opposto in entrambe le direzioni e verificare che la testata contenga un vero `button` con `type="button"` e testo visibile. La prova completa resta quella nella pagina.
- [E2E] **AC-US05-02 · dopo T-3.** Rimuovere la preferenza e aprire la pagina con il sistema emulato prima in chiaro e poi in scuro, verificando il tema iniziale in entrambi i casi. A pagina aperta emulare i cambiamenti in entrambe le direzioni. Verificare che il tema cambi subito senza ricaricare e che la chiave resti assente.
- [E2E] **AC-US05-03 · dopo T-3.** Partire dal chiaro, raggiungere il pulsante con Tab e attivarlo con Invio, poi con Spazio. Controllare il tema della pagina e il testo del pulsante a ogni passo. Verificare che non ci sia un comando «Usa il tema di sistema».
- [E2E] **AC-US05-04 · dopo T-3.** Per ciascun tema, partire senza scelta con il sistema nello stesso tema, attivare il pulsante due volte per salvare quel tema e poi cambiare il sistema al tema opposto. Verificare che il feed mantenga il tema scelto durante il cambio e dopo il ricaricamento.
- [E2E] **AC-US05-05 · dopo T-3.** Aspettare il caricamento del feed, azzerare il registro di rete e cambiare tema in entrambe le direzioni. Controllare che non partano richieste agli articoli, né all’endpoint remoto né alla risorsa JSON equivalente. Le richieste dell’apertura iniziale del feed non fanno parte della prova.
- [UNIT] **AC-US05-06 · T-3, prova di supporto.** Leggere le variabili di colore dichiarate nel CSS e verificare con `node:test` che, per ciascuna palette, ogni coppia testo/sfondo definita per l’interfaccia rispetti 4,5:1. La misura in pagina resta necessaria per verificare i colori effettivamente applicati.
- [E2E] **AC-US05-06 · dopo T-3.** Misurare il rapporto testo/sfondo effettivo in entrambi i temi: testata e fonte, card (autore, data, titolo/link e descrizione), pulsanti e avvisi. Ritardare una richiesta di paginazione per vedere «Caricamento…» e farne fallire una per mostrare l’avviso. Misurare anche negli stati di interazione visibili e tenere conto di eventuale opacità. Registrare i rapporti in `verifica.md`.

L’implementatore esegue `npm test` a ogni task. Le verifiche `[E2E]` spettano al revisore. Prima di uno screenshot, portare in vista l’elemento che prova lo stato.

## Decisioni

- Usare `localStorage` con la chiave `feed.tema` e i valori `light` e `dark`. Scrivere solo all’attivazione del pulsante, mai all’avvio o su un cambio di sistema.
- Leggere `prefers-color-scheme` all’avvio e ascoltarne i cambiamenti. Senza scelta salvata aggiornare subito il tema; con una scelta manuale mantenerla. Nessun comando di ripristino.
- Usare un pulsante nativo con etichetta visibile «Passa al tema scuro» o «Passa al tema chiaro». Collocarlo nella testata per renderlo disponibile anche se il feed non carica.
- Applicare il tema alla radice del documento con `data-tema`. Usare proprietà personalizzate CSS per superfici, testi, link, controlli e avvisi, con colori espliciti anche per il pulsante disabilitato durante il caricamento.
- Non cambiare l’API, la paginazione o la sorgente degli articoli. Non modificare i dati salvati né gli strumenti del progetto.

## Differenze tra piano ed esecuzione

Da compilare alla fine di T-3, anche se non ci sono differenze.
