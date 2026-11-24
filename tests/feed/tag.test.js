import { test } from "node:test";
import assert from "node:assert/strict";
import { unisciTag } from "../../web/lib/tag.js";

test("[UNIT] AC-US04-03: unisciTag() accumula i tag in ordine senza mutare gli argomenti", () => {
  const tagNoti = Object.freeze([]);
  const primaPagina = Object.freeze([
    Object.freeze({ tag_list: Object.freeze(["web", "css", "web"]) }),
    Object.freeze({ tag_list: Object.freeze(["javascript", "css"]) }),
  ]);
  const secondaPagina = Object.freeze([
    Object.freeze({ tag_list: Object.freeze(["css", "node", "web"]) }),
    Object.freeze({ tag_list: Object.freeze(["node", "html", "javascript"]) }),
  ]);

  const tagPrimaPagina = unisciTag(tagNoti, primaPagina);
  assert.deepEqual(tagPrimaPagina, ["web", "css", "javascript"]);
  Object.freeze(tagPrimaPagina);

  const tagDisponibili = unisciTag(tagPrimaPagina, secondaPagina);
  assert.deepEqual(tagDisponibili, ["web", "css", "javascript", "node", "html"]);
});
