// Lettura degli articoli: l'unico modulo che conosce la differenza tra la copia salvata e DEV.to dal vivo.
// API contract: GET /api/articles?page=N&per_page=M in docs/openapi3.yaml.
import { API_BASE } from "../config.js";

const remota = (base) => /^https?:\/\//.test(base);

// Una pagina di un elenco già scaricato, con le stesse regole dell'API (page parte da 1).
export function pagina(articoli, page = 1, perPage = 10) {
  const p = Math.max(1, Math.trunc(page));
  const n = Math.max(1, Math.trunc(perPage));
  return articoli.slice((p - 1) * n, p * n);
}

// Restituisce gli articoli della pagina richiesta. Se la risposta non è valida lancia un Error.
export async function leggiArticoli({ page = 1, perPage = 10 } = {}, { base = API_BASE, fetchFn = fetch } = {}) {
  const url = remota(base) ? `${base}/articles?page=${page}&per_page=${perPage}` : `${base}/articles.json`;
  const res = await fetchFn(url);
  if (!res.ok) throw new Error(`Risposta ${res.status} da ${url}`);
  const dati = await res.json();
  return remota(base) ? dati : pagina(dati, page, perPage);
}
