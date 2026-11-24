// Lettura degli articoli: l'unico modulo che conosce la differenza tra la copia salvata e DEV.to dal vivo.
// API contract: GET /api/articles con page, per_page e tag opzionale in docs/openapi3.yaml.
import { API_BASE } from "../config.js";

const remota = (base) => /^https?:\/\//.test(base);

// Una pagina di un elenco già scaricato, con le stesse regole dell'API (page parte da 1).
export function pagina(articoli, page = 1, perPage = 10) {
  const p = Math.max(1, Math.trunc(page));
  const n = Math.max(1, Math.trunc(perPage));
  return articoli.slice((p - 1) * n, p * n);
}

// Restituisce gli articoli della pagina richiesta. Se la risposta non è valida lancia un Error.
export async function leggiArticoli({ page = 1, perPage = 10, tag } = {}, { base = API_BASE, fetchFn = fetch } = {}) {
  const dalVivo = remota(base);
  const url = dalVivo
    ? `${base}/articles?page=${page}&per_page=${perPage}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`
    : `${base}/articles.json`;
  const res = await fetchFn(url);
  if (!res.ok) throw new Error(`Risposta ${res.status} da ${url}`);
  const dati = await res.json();
  if (dalVivo) return dati;
  return pagina(tag ? dati.filter((a) => a.tag_list.includes(tag)) : dati, page, perPage);
}
