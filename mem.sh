#!/usr/bin/env bash
# Usage:
#   ./mem.sh                      — show Folio memory usage
#   ./mem.sh libreoffice          — compare Folio vs libreoffice
#   ./mem.sh "google-chrome"      — compare Folio vs chrome

# ── helpers ──────────────────────────────────────────────────────────────────

kb_to_human() {
  local kb=$1
  if   (( kb >= 1048576 )); then printf "%.1f GB" "$(echo "scale=1; $kb/1048576" | bc)"
  elif (( kb >= 1024 ));    then printf "%.1f MB" "$(echo "scale=1; $kb/1024" | bc)"
  else printf "%d KB" "$kb"
  fi
}

# Print all matching pids + names + RSS, return total RSS in KB via stdout
measure_app() {
  local pattern="$1"
  local label="$2"
  local total=0
  local found=0

  echo "  Processes matching \"$pattern\":"
  while IFS= read -r line; do
    local pid rss comm
    pid=$(awk '{print $1}' <<< "$line")
    rss=$(awk '{print $2}' <<< "$line")
    comm=$(awk '{$1=$2=""; sub(/^  /,""); print}' <<< "$line")
    (( rss == 0 )) && continue
    printf "    PID %-7s  %-35s  %s\n" "$pid" "$comm" "$(kb_to_human "$rss")"
    (( total += rss ))
    (( found++ ))
  done < <(ps aux --no-headers | awk -v pat="$pattern" \
    'tolower($0) ~ tolower(pat) { print $2, $6, $11 }' | sort -k2 -rn)

  if (( found == 0 )); then
    echo "    (no running processes found)"
  fi

  echo "$total"
}

# Draw a simple ASCII bar (max_kb is the reference for 100%)
draw_bar() {
  local kb=$1 max_kb=$2 label=$3 width=40
  local filled=$(( width * kb / (max_kb > 0 ? max_kb : 1) ))
  (( filled > width )) && filled=$width
  local empty=$(( width - filled ))
  printf "  %-20s [" "$label"
  printf '%0.s█' $(seq 1 $filled)
  printf '%0.s░' $(seq 1 $empty)
  printf "] %s\n" "$(kb_to_human "$kb")"
}

# ── main ─────────────────────────────────────────────────────────────────────

SEP="─────────────────────────────────────────────────────────"

echo ""
echo "$SEP"
echo "  Memory usage report"
echo "$SEP"

# Folio = the Tauri binary + the Vite node dev server
FOLIO_PATTERN="folio|tauri-app|webkit2"
VITE_PATTERN="vite.*folio|react-word-processor"

echo ""
echo "  [ Folio — Word Processor ]"
folio_total=0

# Tauri / WebKit processes
output=$(measure_app "$FOLIO_PATTERN" "Folio")
folio_rss=$(tail -1 <<< "$output")
head -n -1 <<< "$output"
(( folio_total += folio_rss ))

# Vite dev server (node) — only count if it looks like our project
vite_pids=$(ps aux --no-headers | grep -i "vite" | grep -v grep | awk '{print $2}')
if [[ -n "$vite_pids" ]]; then
  echo "  Processes matching \"vite (dev server)\":"
  vite_rss=0
  while IFS= read -r pid; do
    rss=$(ps -p "$pid" -o rss= 2>/dev/null | tr -d ' ')
    cmd=$(ps -p "$pid" -o args= 2>/dev/null | head -c 60)
    [[ -z "$rss" || "$rss" -eq 0 ]] && continue
    printf "    PID %-7s  %-35s  %s\n" "$pid" "$cmd" "$(kb_to_human "$rss")"
    (( vite_rss += rss ))
  done <<< "$vite_pids"
  (( folio_total += vite_rss ))
fi

echo ""
printf "  %-20s  %s\n" "Folio total:" "$(kb_to_human "$folio_total")"

# ── comparison app (optional) ─────────────────────────────────────────────────

OTHER_TOTAL=0
if [[ -n "$1" ]]; then
  echo ""
  echo "$SEP"
  echo "  [ $1 ]"
  output=$(measure_app "$1" "$1")
  OTHER_TOTAL=$(tail -1 <<< "$output")
  head -n -1 <<< "$output"
  echo ""
  printf "  %-20s  %s\n" "$1 total:" "$(kb_to_human "$OTHER_TOTAL")"

  # Comparison bar chart
  echo ""
  echo "$SEP"
  echo "  Comparison"
  echo ""
  MAX=$(( folio_total > OTHER_TOTAL ? folio_total : OTHER_TOTAL ))
  (( MAX == 0 )) && MAX=1
  draw_bar "$folio_total" "$MAX" "Folio"
  draw_bar "$OTHER_TOTAL" "$MAX" "$1"

  echo ""
  if (( folio_total > 0 && OTHER_TOTAL > 0 )); then
    ratio=$(echo "scale=1; $OTHER_TOTAL / $folio_total" | bc 2>/dev/null)
    if (( folio_total < OTHER_TOTAL )); then
      echo "  Folio uses ${ratio}× less RAM than $1"
    elif (( folio_total > OTHER_TOTAL )); then
      ratio=$(echo "scale=1; $folio_total / $OTHER_TOTAL" | bc 2>/dev/null)
      echo "  Folio uses ${ratio}× more RAM than $1"
    else
      echo "  Both apps use the same amount of RAM"
    fi
  fi
fi

echo ""
echo "$SEP"
echo ""
