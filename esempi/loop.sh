#!/usr/bin/env bash
# Loop agentico del workshop (25 novembre).
#
# Prende dal backlog le user story «Ready» e, per ognuna:
#   worktree e branch → un agente per task (test prima) → npm test → revisore
#   → commit → merge in main → npm test su main.
# Alla fine pubblica web/ in una cartella di «produzione» sul vostro computer
# (http://localhost:8080) e la controlla nel browser.
#
# Le persone fanno la parte che conta prima: spec, piano e task approvati
# (Definition of Ready in docs/backlog.md). Il loop esegue e si ferma quando
# una prova non torna: un test rosso o un revisore che non dà PRONTA.
#
# Uso, dalla cartella del progetto, su main e senza modifiche in sospeso:
#   ./esempi/loop.sh
# Variabili facoltative:
#   MODELLO=provider/modello   il modello di OpenCode (altrimenti quello di opencode.json)
#   OPENCODE_ARGS=--standalone opzioni in più per opencode
#   PORTA_PROD=8080            la porta della «produzione»
# Su Windows: da Git Bash.

set -u
ROOT=$(git rev-parse --show-toplevel) || exit 1
cd "$ROOT"
NOME=$(basename "$ROOT")
PRODUZIONE="$(dirname "$ROOT")/$NOME-produzione"
PORTA_PROD=${PORTA_PROD:-8080}
# --auto approva da solo i permessi «ask»: restano vietati quelli in opencode.json
OC=(opencode ${OPENCODE_ARGS:-} run --auto ${MODELLO:+--model "$MODELLO"})

passo(){ printf '\n\033[1;36m▶ %s\033[0m\n' "$*"; }
nota(){ printf '  %s\n' "$*"; }
riepilogo=""
esito(){ riepilogo+=$(printf '%-6s %-24s %s' "$1" "$2" "$3")$'\n'; }

if [ "$(git branch --show-current)" != "main" ] || [ -n "$(git status --porcelain)" ]; then
  echo "Il loop parte da main senza modifiche in sospeso (git status deve essere vuoto)."; exit 1
fi

storie=$(grep -E '^\| US-[0-9]+ \|.*\| Ready \|$' docs/backlog.md | cut -d'|' -f2 | tr -d ' ')
[ -z "$storie" ] && { echo "Nessuna user story «Ready» in docs/backlog.md."; exit 0; }
passo "User story Ready: $(echo $storie)"

i=0
for us in $storie; do
  i=$((i + 1))
  n=${us#US-}
  dir=$(ls -d specs/*/us-"$n"-* 2>/dev/null | head -1)
  if [ -z "$dir" ] || [ ! -f "$dir/tasks.md" ]; then esito "$us" "-" "ferma: manca tasks.md"; continue; fi
  slug=$(basename "$dir")
  ramo="feature/$slug"
  wt="$(dirname "$ROOT")/$NOME-$slug"

  passo "$us · worktree $(basename "$wt") sul branch $ramo"
  git worktree add -q "$wt" -b "$ramo" main || { esito "$us" "$slug" "ferma: worktree non creato"; continue; }
  mkdir -p "$wt/.loop"
  cd "$wt"

  # --- un agente per task, finché ce ne sono -------------------------------------------------
  fermo=""
  while t=$(grep -m1 -E '^- \[ \] T-[0-9]+' "$dir/tasks.md"); do
    id=$(printf '%s' "$t" | grep -oE 'T-[0-9]+' | head -1)
    passo "$us · $id · implementazione"
    nota "$t"
    prompt="Lavora solo sul task $id di $dir/tasks.md ($us). Leggi spec.md e plan.md nella stessa cartella. Prima il test [UNIT], poi il codice, poi npm test. Tocca solo i file del task. Quando npm test passa, spunta $id in tasks.md (- [x] $id) e fermati."
    for tentativo in 1 2; do
      "${OC[@]}" --title "$us $id" "$prompt"
      if npm test >.loop/npm-test.txt 2>&1 && grep -qE "^- \[x\] $id( |$)" "$dir/tasks.md"; then
        nota "✔ $id: npm test passa"; break
      fi
      if [ "$tentativo" = 2 ]; then fermo="$id: npm test rosso o task non spuntato"; break; fi
      nota "✖ $id: npm test rosso o task non spuntato, secondo tentativo"
      prompt="Il task $id di $dir/tasks.md non è chiuso. Ultime righe di npm test: $(tail -n 15 .loop/npm-test.txt | tr '\n' ' ') Correggi solo questo, rilancia npm test e, se passa, spunta $id."
    done
    [ -n "$fermo" ] && break
  done
  if [ -n "$fermo" ]; then esito "$us" "$slug" "ferma: $fermo (worktree lasciato per voi)"; cd "$ROOT"; continue; fi

  # --- revisore, contesto nuovo, sulla sua porta ------------------------------------------------
  porta=$((5180 + i))
  WEB_PORT=$porta node tools/serve.mjs >/dev/null 2>&1 &
  server=$!
  sleep 1
  verdetto=""
  for giro in 1 2; do
    passo "$us · revisore (giro $giro) su http://localhost:$porta"
    "${OC[@]}" --agent revisore --title "$us verifica $giro" \
      "Verifica $us in $dir/: leggi spec.md, plan.md e la Definition of Done, guarda git diff main, esegui npm test, prova gli AC [E2E] su http://localhost:$porta con la skill agent-browser (al massimo 10 comandi, screenshot in $dir/verifica/), poi scrivi $dir/verifica.md con la skill verifica-us. Stato nel backlog, commit e merge li fa il loop dopo il tuo esito: non contarli come aperti."
    if grep -q 'Esito: PRONTA' "$dir/verifica.md" 2>/dev/null; then verdetto=PRONTA; break; fi
    [ "$giro" = 2 ] && break
    passo "$us · correzioni chieste dal revisore"
    "${OC[@]}" --title "$us correzioni" \
      "Leggi $dir/verifica.md. Correggi solo i problemi segnalati, uno alla volta, con un test [UNIT] prima quando è possibile; poi npm test."
  done
  kill "$server" 2>/dev/null; wait "$server" 2>/dev/null
  if [ "$verdetto" != PRONTA ] || ! npm test >.loop/npm-test.txt 2>&1; then
    esito "$us" "$slug" "ferma: il revisore non dà PRONTA (leggete $dir/verifica.md)"; cd "$ROOT"; continue
  fi

  # --- commit nel worktree, merge in main ----------------------------------------------------------
  passo "$us · commit e merge in main"
  perl -pi -e "s/^(\| $us \|.*\| )Ready( \|)\$/\${1}Fatto\${2}/" docs/backlog.md
  git add -A web tests specs docs/backlog.md
  titolo=$(grep -m1 '^# ' "$dir/spec.md" | sed -E "s/^# (US-[0-9]+ *[–-]? *)?//")
  git commit -qm "$us $titolo (loop)"
  cd "$ROOT"
  if ! git merge -q --no-ff "$ramo" -m "Merge $ramo"; then
    git merge --abort
    esito "$us" "$slug" "ferma: conflitto nel merge, lo risolve una persona"; continue
  fi
  if ! npm test >"$wt/.loop/npm-test-main.txt" 2>&1; then
    esito "$us" "$slug" "merge fatto ma npm test su main è rosso: fermo il loop"; break
  fi
  git worktree remove --force "$wt" && git branch -q -d "$ramo"
  esito "$us" "$slug" "in main ✔"
done

# --- deploy in locale e prova di fumo ---------------------------------------------------------------
cd "$ROOT"
if npm test >/dev/null 2>&1; then
  passo "Deploy: $(basename "$PRODUZIONE") → http://localhost:$PORTA_PROD"
  [ -f "$PRODUZIONE.pid" ] && kill "$(cat "$PRODUZIONE.pid")" 2>/dev/null
  rm -rf "$PRODUZIONE" && mkdir -p "$PRODUZIONE/tools"
  cp -R web "$PRODUZIONE/web" && cp tools/serve.mjs "$PRODUZIONE/tools/"
  git rev-parse --short HEAD >"$PRODUZIONE/VERSIONE"
  WEB_PORT=$PORTA_PROD nohup node "$PRODUZIONE/tools/serve.mjs" >/dev/null 2>&1 &
  echo $! >"$PRODUZIONE.pid"
  sleep 1
  passo "Prova di fumo in produzione"
  if command -v agent-browser >/dev/null; then
    # 127.0.0.1 e non localhost: su alcuni computer la stessa porta in IPv6 è di un altro programma
    agent-browser open "http://127.0.0.1:$PORTA_PROD/" >/dev/null
    agent-browser wait --text "Carica altri" >/dev/null 2>&1
    nota "card in pagina: $(agent-browser eval 'document.querySelectorAll("article.card").length')"
    agent-browser screenshot "$PRODUZIONE/fumo.png" >/dev/null && nota "screenshot: $PRODUZIONE/fumo.png"
  else
    curl -fsS "http://127.0.0.1:$PORTA_PROD/" >/dev/null && nota "la pagina risponde"
  fi
else
  passo "Deploy saltato: npm test su main non passa"
fi

passo "Riepilogo"
printf '%s' "$riepilogo"
git log --oneline --graph -n 12
