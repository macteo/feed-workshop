// Logica pura della card: da ArticleIndex (docs/openapi3.yaml) a stringa HTML, senza DOM né fetch.
// L'unico punto che decide come appare una card: autore da `user`, titolo collegato, copertina omessa se assente.

// Legge solo i campi dell'API contract usati dalla card: id, title, description, cover_image,
// readable_publish_date, reading_time_minutes, tag_list, url, user.name, user.profile_image_90.

const escapa = (testo) =>
  String(testo ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Solo indirizzi http(s) o file locali dei dati salvati (data/…): un "javascript:" non diventa mai un link.
const indirizzoSicuro = (valore, { locale = false } = {}) => {
  const testo = String(valore ?? "").trim();
  if (locale && /^data\/[\w./-]+$/.test(testo) && !testo.includes("..")) return testo;
  try {
    const url = new URL(testo);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
};

const haCopertina = (articolo) => indirizzoSicuro(articolo.cover_image, { locale: true }) !== "";

// Markup di una singola card. Il testo resta integro nel DOM: il taglio su poche righe è di style.css.
export function schedaCard(articolo) {
  const autore = articolo.user ?? {};
  const link = indirizzoSicuro(articolo.url);
  const titolo = link
    ? `<a href="${escapa(link)}" target="_blank" rel="noopener">${escapa(articolo.title)}</a>`
    : escapa(articolo.title);
  const copertina = haCopertina(articolo)
    ? `<img class="copertina" src="${escapa(indirizzoSicuro(articolo.cover_image, { locale: true }))}" alt="">`
    : "";
  const tag = articolo.tag_list ?? [];
  return [
    `<article class="card" data-id="${escapa(articolo.id)}">`,
    `  <div class="copertina-contenitore">${copertina}</div>`,
    `  <header class="autore">`,
    `    <img class="avatar" src="${escapa(indirizzoSicuro(autore.profile_image_90, { locale: true }))}" alt="">`,
    `    <span class="nome">${escapa(autore.name)}</span>`,
    `    <time class="data">${escapa(articolo.readable_publish_date)}</time>`,
    `  </header>`,
    `  <h2 class="titolo">${titolo}</h2>`,
    `  <p class="tempo-lettura">${escapa(articolo.reading_time_minutes)} min di lettura</p>`,
    `  <p class="descrizione">${escapa(articolo.description)}</p>`,
    ...(tag.length > 0 ? [`  <p class="tag">${tag.map(escapa).join(", ")}</p>`] : []),
    `</article>`,
  ].join("\n");
}

// Fine feed: la pagina è piena finché contiene esattamente perPage articoli.
export function ciSonoAltriArticoli(paginaRicevuta, perPage) {
  return Array.isArray(paginaRicevuta) && paginaRicevuta.length === perPage;
}
