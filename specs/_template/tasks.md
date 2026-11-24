# Task – US-NN Titolo

Un task è pronto per il loop quando un agente lo può fare da solo, senza domande: dice che cosa fa, quali file tocca, da quali task dipende e con quale comando si controlla. Il loop prende il primo task non spuntato, uno alla volta.

- [ ] T-1 · <che cosa, in una frase> · file: `<file>`, `<test>` · dipende da: — · controllo: `npm test`
- [ ] T-2 · <che cosa> · file: `<file>` · dipende da: T-1 · controllo: `npm test`
