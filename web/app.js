// Pagina del feed: legge gli articoli con leggiArticoli() e li mostra in #feed.
// La logica senza DOM va in web/lib/*.js (moduli ES), così i test [UNIT] la importano con node --test.
// API contract: docs/openapi3.yaml · Requisiti: docs/requirements.md · Backlog: docs/backlog.md
import { leggiArticoli } from "./lib/sorgente.js";
