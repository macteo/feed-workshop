import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../../web/style.css", import.meta.url), "utf8");

function luminanza(colore) {
  const canali = colore.match(/[0-9a-f]{2}/gi).map((coppia) => {
    const valore = parseInt(coppia, 16) / 255;
    return valore <= 0.04045 ? valore / 12.92 : ((valore + 0.055) / 1.055) ** 2.4;
  });
  const [rosso, verde, blu] = canali;
  return 0.2126 * rosso + 0.7152 * verde + 0.0722 * blu;
}

const coppie = [
  ["testo della pagina", "testo", "sfondo-pagina"],
  ["titolo della testata e autore", "testo", "superficie"],
  ["fonte, data e descrizione", "testo-secondario", "superficie"],
  ["link dell’articolo", "link", "superficie"],
  ["pulsanti", "testo", "superficie"],
  ["pulsanti al passaggio del mouse o durante la pressione", "testo", "sfondo-controllo-attivo"],
  ["pulsante durante il caricamento", "testo-secondario", "sfondo-controllo-disabilitato"],
  ["avvisi", "testo-avviso", "sfondo-avviso"],
];

for (const [tema, selettore] of [
  ["chiaro", /:root\s*\{([^}]+)\}/],
  ["scuro", /:root\[data-tema="dark"\]\s*\{([^}]+)\}/],
]) {
  test(`[UNIT] AC-US05-06: le coppie di colori del tema ${tema} hanno contrasto di almeno 4,5:1`, () => {
    const palette = css.match(selettore)?.[1];
    assert.ok(palette, `manca la palette del tema ${tema}`);
    const colori = new Map(
      [...palette.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-f]{6})\s*;/gi)]
        .map(([, nome, colore]) => [nome, colore]),
    );

    for (const [uso, testo, sfondo] of coppie) {
      assert.ok(colori.has(testo), `${uso}: manca --${testo}`);
      assert.ok(colori.has(sfondo), `${uso}: manca --${sfondo}`);
      const primo = luminanza(colori.get(testo));
      const secondo = luminanza(colori.get(sfondo));
      const rapporto = (Math.max(primo, secondo) + 0.05) / (Math.min(primo, secondo) + 0.05);
      assert.ok(rapporto >= 4.5, `${uso}: contrasto ${rapporto.toFixed(2)}:1`);
    }
  });
}
