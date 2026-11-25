# US-05 – Tema scuro

**Riferimenti.** RF4 · UC-04 · RNF3 · 2 SP · epica `feed`.

## User story

Come visitatore voglio passare al tema scuro, per leggere comodamente di sera, e ritrovarlo quando torno.

## Criteri di accettazione (AC, Acceptance Criteria)

- **AC-US05-01 [UNIT]** — **Given** un tema di sistema chiaro o scuro e una preferenza salvata chiara, scura o assente, **When** si determina il tema effettivo, **Then** la preferenza salvata ha la precedenza; se manca, si usa il tema di sistema.
- **AC-US05-02 [E2E]** — **Given** un browser senza scelta salvata, **When** il visitatore apre il feed e il tema di sistema cambia mentre la pagina è aperta, **Then** il feed si apre con il tema di sistema e segue i cambiamenti in entrambe le direzioni, senza ricaricare né salvare una scelta.
- **AC-US05-03 [E2E]** — **Given** il feed aperto in tema chiaro, **When** il visitatore raggiunge con Tab il pulsante «Passa al tema scuro» e lo attiva da tastiera, poi lo attiva di nuovo, **Then** la pagina passa allo scuro e poi torna al chiaro; il pulsante mostra di volta in volta il tema di destinazione. Non c’è un comando separato per tornare al tema di sistema.
- **AC-US05-04 [E2E]** — **Given** che il visitatore ha scelto manualmente il tema chiaro o scuro, **When** il sistema passa al tema opposto e il visitatore ricarica la pagina, **Then** il tema scelto resta attivo sia al cambio del sistema sia dopo il ricaricamento.
- **AC-US05-05 [E2E]** — **Given** il feed caricato e nessuna lettura degli articoli in corso, **When** il visitatore cambia tema con il pulsante, **Then** il cambio non avvia richieste all’API né una nuova lettura degli articoli dalla copia locale.
- **AC-US05-06 [E2E]** — **Given** il feed in tema chiaro o scuro, **When** si misura il contrasto dei testi dell’interfaccia rispetto ai rispettivi sfondi effettivi, **Then** il rapporto è almeno 4,5:1 in entrambi i temi, anche per metadati, link, pulsanti, testo durante il caricamento e avvisi di errore.

## Architettura (impatto sul diagramma dei componenti)

Solo il client cambia. La pagina legge la preferenza da `localStorage`, rileva il tema del sistema e applica il tema effettivo alla radice del documento. Il CSS usa quel tema per l’intera interfaccia del feed. Il cambio di tema è indipendente dal caricamento degli articoli.

## Classi (impatto sul diagramma delle classi)

Nessuna classe nuova. `web/lib/tema.js` determina il tema effettivo e il tema opposto senza usare il DOM. `web/app.js` gestisce il pulsante, gli eventi del sistema e la preferenza nel browser.

## API endpoint

Nessun impatto. Nessun endpoint o campo di `docs/openapi3.yaml` viene aggiunto o usato per il tema. La lettura degli articoli resta invariata.

## Schema DB

Nessun impatto. Non c’è un database. Solo la scelta esplicita (`light` o `dark`) è persistita in `localStorage`; l’assenza della scelta indica che si segue il sistema.
