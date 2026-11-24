---
name: verifica-us
description: Formato della verifica di una user story rispetto ai criteri AC-USNN-YY e alla Definition of Done. Da usare alla fine di una revisione, prima del commit e della Pull Request.
---

# Verifica di una user story

Sigle: AC (Acceptance Criterion, criterio di accettazione), US (User Story), [UNIT] (test unitario), [E2E] (verifica end-to-end nella pagina).

Scrivi in italiano, in `specs/<epica>/us-NN-slug/verifica.md`, con questa struttura e nient'altro:

```
# Verifica – US-NN Titolo

Esito: PRONTA | DA CORREGGERE

## Criteri di accettazione
| AC | Tipo | Esito | Prova |
|----|------|-------|-------|
| AC-USNN-01 | [UNIT] / [E2E] | ✅ / ❌ / ⚠️ non verificabile | nome del test, comando con il suo output, oppure screenshot in verifica/ |

## Definition of Done
- [x] / [ ] ogni voce di docs/backlog.md, con una riga di motivazione

## Problemi
1. <cosa non va> — <file:riga o passo nella pagina> — <quale AC o voce della DoD viola>

## Da decidere per lo studente
- <una correzione possibile per ogni problema, senza applicarla>
```

- Un AC è ✅ solo se c'è una prova: un test che passa o un passo nel browser con screenshot.
- Distingui ciò che hai **visto** (output, screenshot) da ciò che **deduci** leggendo il codice.
- «PRONTA» solo se tutti gli AC sono ✅ e la DoD è completa, tranne commit e Pull Request che fa lo studente.
