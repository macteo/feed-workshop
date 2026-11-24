#!/usr/bin/env bash
# Loop agentico del workshop (25 novembre): più agenti in parallelo, un task dopo l'altro.
#
# Per ogni user story «Ready» del backlog, in parallelo:
#   worktree e branch → un agente per task, in ordine (test prima) → npm test → revisore
# Poi, una storia alla volta: commit → merge in main (un agente risolve i conflitti) → npm test.
# Alla fine: deploy in una cartella di «produzione» (http://localhost:8080) e smoke test nel browser.
#
# Spec, plan e task li scrivono e li rileggono le persone, prima. Il loop si ferma da solo
# quando un controllo fallisce e lascia il worktree a una persona.
#
# Uso, dalla cartella del progetto, su main e senza modifiche in sospeso:
#   ./esempi/loop.sh
# Variabili facoltative:
#   MODELLO=provider/modello   il modello di OpenCode (altrimenti quello di opencode.json)
#   OPENCODE_ARGS=--standalone opzioni in più per opencode
#   PARALLELO=0                una storia alla volta invece che tutte insieme
#   PORTA_PROD=8080            la porta della «produzione»
# Su Windows: da Git Bash.

set -u
ROOT=$(git rev-parse --show-toplevel) || exit 1
cd "$ROOT"
NOME=$(basename "$ROOT")
PRODUZIONE="$(dirname "$ROOT")/$NOME-produzione"
PORTA_PROD=${PORTA_PROD:-8080}
PARALLELO=${PARALLELO:-1}
# --auto approva da solo i permessi «ask»: restano vietati quelli in opencode.json
OC=(opencode ${OPENCODE_ARGS:-} run --auto ${MODELLO:+--model "$MODELLO"})
LOG="$ROOT/.loop"
mkdir -p "$LOG"

passo(){ printf '\033[1;36m▶ %s\033[0m\n' "$*"; }
nota(){ printf '  %s\n' "$*"; }

if [ "$(git branch --show-current)" != "main" ] || [ -n "$(git status --porcelain)" ]; then
  echo "Il loop parte da main senza modifiche in sospeso (git status deve essere vuoto)."; exit 1
fi
storie=$(grep -E '^\| US-[0-9]+ \|.*\| Ready \|$' docs/backlog.md | cut -d'|' -f2 | tr -d ' ')
[ -z "$storie" ] && { echo "Nessuna user story «Ready» in docs/backlog.md."; exit 0; }
passo "User story Ready: $(echo $storie) · in parallelo: $([ "$PARALLELO" = 1 ] && echo sì || echo no)"

# --- una storia: worktree, task in ordine, revisore ----------------------------------------------
storia(){
  local us=$1 porta=$2 n dir slug wt t id prompt tentativo server giro
  n=${us#US-}
  dir=$(ls -d specs/*/us-"$n"-* 2>/dev/null | head -1)
  [ -n "$dir" ] && [ -f "$dir/tasks.md" ] || { echo "ferma: manca tasks.md" >"$LOG/$us.esito"; return; }
  slug=$(basename "$dir"); wt="$(dirname "$ROOT")/$NOME-$slug"
  [ -d "$wt" ] || { echo "ferma: worktree non creato" >"$LOG/$us.esito"; return; }
  cd "$wt" || return
  while t=$(grep -m1 -E '^- \[ \] T-[0-9]+' "$dir/tasks.md"); do
    id=$(printf '%s' "$t" | grep -oE 'T-[0-9]+' | head -1)
    passo "$us · $id · agente al lavoro"
    prompt="Lavora solo sul task $id di $dir/tasks.md ($us). Leggi spec.md e plan.md nella stessa cartella. Prima il test [UNIT], poi il codice, poi npm test. Tocca solo i file del task. Quando npm test passa, spunta $id in tasks.md (- [x] $id) e fermati."
    for tentativo in 1 2; do
      "${OC[@]}" --title "$us $id" "$prompt" >>"$LOG/$us.log" 2>&1
      if npm test >"$LOG/$us.test" 2>&1 && grep -qE "^- \[x\] $id( |$)" "$dir/tasks.md"; then
        nota "$us · $id ✔ npm test passa"; break
      fi
      if [ "$tentativo" = 2 ]; then echo "ferma: $id, npm test rosso (worktree lasciato per voi)" >"$LOG/$us.esito"; return; fi
      nota "$us · $id ✖ npm test rosso: secondo tentativo"
      prompt="Il task $id di $dir/tasks.md non è chiuso. Ultime righe di npm test: $(tail -n 15 "$LOG/$us.test" | tr '\n' ' ') Correggi solo questo, rilancia npm test e, se passa, spunta $id."
    done
  done
  WEB_PORT=$porta node tools/serve.mjs >/dev/null 2>&1 &
  server=$!
  sleep 1
  for giro in 1 2; do
    passo "$us · revisore (giro $giro) su http://localhost:$porta"
    "${OC[@]}" --agent revisore --title "$us verifica $giro" \
      "Verifica $us in $dir/: leggi spec.md, plan.md e la Definition of Done, guarda git diff main, esegui npm test, prova gli AC [E2E] su http://localhost:$porta con la skill agent-browser (al massimo 10 comandi, screenshot in $dir/verifica/), poi scrivi $dir/verifica.md con la skill verifica-us. Stato nel backlog, commit e merge li fa il loop dopo il tuo esito: non contarli come aperti." >>"$LOG/$us.log" 2>&1
    if grep -q 'Esito: READY' "$dir/verifica.md" 2>/dev/null; then break; fi
    [ "$giro" = 2 ] && break
    nota "$us · CHANGES REQUESTED: correzioni"
    "${OC[@]}" --title "$us correzioni" \
      "Leggi $dir/verifica.md. Correggi solo i problemi segnalati, uno alla volta, con un test [UNIT] prima quando è possibile; poi npm test." >>"$LOG/$us.log" 2>&1
  done
  kill "$server" 2>/dev/null; wait "$server" 2>/dev/null
  if ! grep -q 'Esito: READY' "$dir/verifica.md" 2>/dev/null || ! npm test >/dev/null 2>&1; then
    echo "ferma: niente READY dal revisore (leggete $dir/verifica.md)" >"$LOG/$us.esito"; return
  fi
  perl -pi -e "s/^(\| $us \|.*\| )Ready( \|)\$/\${1}Done\${2}/" docs/backlog.md
  git add -A web tests specs docs/backlog.md
  git commit -qm "$us $(grep -m1 '^# ' "$dir/spec.md" | sed -E "s/^# (US-[0-9]+ *[–-]? *)?//") (loop)"
  nota "$us · ✔ READY, commit nel branch feature/$slug"
  echo "ready feature/$slug $wt" >"$LOG/$us.esito"
}

# i worktree si creano uno alla volta (git non ama le modifiche parallele allo stesso repository)
for us in $storie; do
  rm -f "$LOG/$us.esito" "$LOG/$us.log"
  d=$(ls -d specs/*/us-"${us#US-}"-* 2>/dev/null | head -1); [ -n "$d" ] || continue
  s=$(basename "$d")
  git worktree add -q "$(dirname "$ROOT")/$NOME-$s" -b "feature/$s" main 2>>"$LOG/$us.log" && passo "$us · worktree $NOME-$s sul branch feature/$s"
done
i=0
for us in $storie; do
  i=$((i + 1))
  if [ "$PARALLELO" = 1 ]; then ( storia "$us" $((5180 + i)) ) & else ( storia "$us" $((5180 + i)) ); fi
done
wait

# --- merge in main, una storia alla volta -------------------------------------------------------------
cd "$ROOT"
riepilogo=""
for us in $storie; do
  read -r stato ramo wt <"$LOG/$us.esito" 2>/dev/null || stato="ferma:"
  if [ "$stato" != ready ]; then riepilogo+="$us  $(cat "$LOG/$us.esito" 2>/dev/null)"$'\n'; continue; fi
  passo "$us · merge di $ramo in main"
  if ! git merge -q --no-ff "$ramo" -m "Merge $ramo" >/dev/null 2>&1; then
    conflitti=$(git diff --name-only --diff-filter=U | tr '\n' ' ')
    nota "$us · conflitto in: $conflitti→ un agente lo risolve"
    "${OC[@]}" --title "$us conflitto" "Il merge di $ramo in main ha conflitti in: $conflitti. Risolvili tenendo entrambe le funzionalità (quella già in main e quella di $us), togli tutti i marcatori <<<<<<< ======= >>>>>>>, poi esegui npm test. Non fare commit." >>"$LOG/$us.log" 2>&1
    if grep -qE '^(<<<<<<<|>>>>>>>)' $conflitti 2>/dev/null || ! npm test >/dev/null 2>&1; then
      git merge --abort; riepilogo+="$us  ferma: conflitto non risolto, lo risolve una persona"$'\n'; continue
    fi
    git add -A web tests specs docs/backlog.md && git commit -qm "Merge $ramo (conflitti risolti da un agente)"
    nota "$us · ✔ conflitto risolto, npm test passa"
  fi
  if ! npm test >/dev/null 2>&1; then riepilogo+="$us  merge fatto ma npm test su main è rosso: mi fermo"$'\n'; break; fi
  git worktree remove --force "$wt" && git branch -q -D "$ramo"
  riepilogo+="$us  in main ✔"$'\n'
done

# --- deploy in locale e smoke test ---------------------------------------------------------------
if npm test >/dev/null 2>&1; then
  passo "Deploy: $(basename "$PRODUZIONE") → http://localhost:$PORTA_PROD"
  [ -f "$PRODUZIONE.pid" ] && kill "$(cat "$PRODUZIONE.pid")" 2>/dev/null
  rm -rf "$PRODUZIONE" && mkdir -p "$PRODUZIONE/tools"
  cp -R web "$PRODUZIONE/web" && cp tools/serve.mjs "$PRODUZIONE/tools/"
  git rev-parse --short HEAD >"$PRODUZIONE/VERSIONE"
  WEB_PORT=$PORTA_PROD nohup node "$PRODUZIONE/tools/serve.mjs" >/dev/null 2>&1 &
  echo $! >"$PRODUZIONE.pid"
  sleep 1
  passo "Smoke test in produzione"
  if command -v agent-browser >/dev/null; then
    # 127.0.0.1 e non localhost: su alcuni computer la stessa porta in IPv6 è di un altro programma
    agent-browser open "http://127.0.0.1:$PORTA_PROD/" >/dev/null
    agent-browser wait --text "Carica altri" >/dev/null 2>&1
    nota "card in pagina: $(agent-browser eval 'document.querySelectorAll("article.card").length')"
    agent-browser screenshot "$PRODUZIONE/smoke-test.png" >/dev/null && nota "screenshot: $PRODUZIONE/smoke-test.png"
  else
    curl -fsS "http://127.0.0.1:$PORTA_PROD/" >/dev/null && nota "la pagina risponde"
  fi
else
  passo "Deploy saltato: npm test su main non passa"
fi

passo "Riepilogo"
printf '%s' "$riepilogo"
git log --oneline --graph -n 12
