# Requisiti del feed (estratto del D1, il primo deliverable del corso)

Progetto d'esempio del workshop: un client web che mostra un feed pubblico di articoli (DEV.to), senza login.
API contract: `docs/openapi3.yaml` (formato OpenAPI 3), da esplorare con la Swagger UI ospitata (link nel README). In aula i dati vengono da `web/data/articles.json`, una risposta reale salvata.

Sigle: RF (requisito funzionale), RNF (requisito non funzionale), UC (Use Case, caso d'uso).

## Requisiti funzionali

- **RF1 · Consultare il feed.** Il visitatore vede gli articoli pubblicati, ciascuno con avatar e nome dell'autore, data, copertina, titolo e descrizione. Gli articoli arrivano a pagine; il visitatore può caricarne altri.
- **RF2 · Segnare «Mi piace».** Il visitatore può segnare un articolo con «Mi piace» e ritrovarlo segnato quando torna sulla pagina. La preferenza resta nel browser: l'API è in sola lettura.

## Requisiti non funzionali

- **RNF1 · Compatibilità.** Ultime due versioni di Chrome, Firefox, Safari ed Edge.
- **RNF2 · Tempo di risposta.** Con i dati salvati in `web/data/`, la prima pagina del feed è visibile entro 2 secondi.
- **RNF3 · Accessibilità.** Tutti i comandi sono pulsanti veri, raggiungibili da tastiera e con un'etichetta leggibile.
- **RNF4 · Vincolo del progetto.** Solo HTML, CSS e JavaScript, senza librerie esterne.

## Casi d'uso

### UC-01 · Consultare il feed

- **Attore:** visitatore. **Precondizione:** nessuna (niente login).
- **Flusso principale:**
  1. Il visitatore apre la pagina.
  2. Il sistema chiede la prima pagina di articoli (`GET /api/articles?page=1&per_page=10`).
  3. Il sistema mostra una card per articolo, nell'ordine ricevuto.
  4. Il visitatore chiede altri articoli; il sistema chiede la pagina successiva e aggiunge le card in fondo.
- **Estensione 2a:** l'API non risponde o risponde con un errore → il sistema mostra un messaggio comprensibile al posto del feed.
- **Postcondizione:** il visitatore vede gli articoli richiesti.

### UC-02 · Segnare un articolo con «Mi piace»

- **Attore:** visitatore. **Precondizione:** il feed è visibile (UC-01).
- **Flusso principale:**
  1. Il visitatore preme il cuore di un articolo.
  2. Il sistema colora il cuore, aumenta di 1 il numero di reazioni mostrato e ricorda la scelta nel browser.
  3. Premendo di nuovo, il sistema torna allo stato iniziale.
- **Postcondizione:** ricaricando la pagina, gli articoli segnati restano segnati.

## Criteri di accettazione (dal D1)

- RF1: ogni card mostra i sei elementi di RF1; il testo della card resta leggibile in poche righe; senza copertina la card resta ordinata; se l'API fallisce compare un messaggio, non una pagina bianca.
- RF2: il «Mi piace» si attiva e si disattiva, resta dopo il ricaricamento e non fa richieste all'API.
