# web/lib

Moduli ES con la logica che non tocca il DOM (formattazione, stato del «Mi piace», paginazione…).
Si importano sia da `web/app.js` sia dai test in `tests/`.

- `sorgente.js` (già pronto): `leggiArticoli({ page, perPage })` legge una pagina di articoli da `API_BASE` (`web/config.js`), sia dalla copia salvata sia da DEV.to dal vivo.
