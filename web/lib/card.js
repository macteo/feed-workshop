// Logica pura della card: da ArticleIndex (docs/openapi3.yaml) a stringa HTML, senza DOM né fetch.
// L'unico punto che decide come appare una card: autore da `user`, titolo collegato, copertina omessa se assente.

// Legge solo i campi dell'API contract usati dalla card: id, title, description, cover_image,
// readable_publish_date, url, user.name, user.profile_image_90 (organization è ignorata in US-01).

const escapa = (testo) =>
  String(testo ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const haCopertina = (articolo) => typeof articolo.cover_image === "string" && articolo.cover_image.trim() !== "";

// Markup di una singola card. Il testo resta integro nel DOM: il taglio su poche righe è di style.css.
export function schedaCard(articolo) {
  const autore = articolo.user ?? {};
  const copertina = haCopertina(articolo)
    ? `<img class="copertina" src="${escapa(articolo.cover_image)}" alt="">`
    : "";
  return [
    `<article class="card" data-id="${escapa(articolo.id)}">`,
    `  <div class="copertina-contenitore">${copertina}</div>`,
    `  <header class="autore">`,
    `    <img class="avatar" src="${escapa(autore.profile_image_90)}" alt="">`,
    `    <span class="nome">${escapa(autore.name)}</span>`,
    `    <time class="data">${escapa(articolo.readable_publish_date)}</time>`,
    `  </header>`,
    `  <h2 class="titolo"><a href="${escapa(articolo.url)}" target="_blank" rel="noopener">${escapa(articolo.title)}</a></h2>`,
    `  <p class="descrizione">${escapa(articolo.description)}</p>`,
    `</article>`,
  ].join("\n");
}

// Fine feed: la pagina è piena finché contiene esattamente perPage articoli.
export function ciSonoAltriArticoli(paginaRicevuta, perPage) {
  return Array.isArray(paginaRicevuta) && paginaRicevuta.length === perPage;
}
