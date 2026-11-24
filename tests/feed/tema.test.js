import { test } from "node:test";
import assert from "node:assert/strict";
import { temaEffettivo, temaOpposto } from "../../web/lib/tema.js";

for (const [preferenza, sistema, atteso] of [
  ["light", "light", "light"],
  ["light", "dark", "light"],
  ["dark", "light", "dark"],
  ["dark", "dark", "dark"],
  [null, "light", "light"],
  [null, "dark", "dark"],
]) {
  test(`[UNIT] AC-US05-01: preferenza ${preferenza ?? "assente"}, sistema ${sistema} → ${atteso}`, () => {
    assert.equal(temaEffettivo(preferenza, sistema), atteso);
  });
}

test("[UNIT] Supporto ad AC-US05-03: tema opposto in entrambe le direzioni", () => {
  assert.equal(temaOpposto("light"), "dark");
  assert.equal(temaOpposto("dark"), "light");
});
