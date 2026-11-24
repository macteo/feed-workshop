export function unisciTag(tagNoti, articoli) {
  const tag = new Set(tagNoti);
  for (const articolo of articoli) {
    for (const nome of articolo.tag_list) {
      tag.add(nome);
    }
  }
  return [...tag];
}
