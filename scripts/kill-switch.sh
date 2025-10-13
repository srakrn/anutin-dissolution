#!/usr/bin/env bash

set -euo pipefail

main() {
  local data="${GITHUB_WORKSPACE}/data.json"
  if ! test -f "$data"; then
    echo "missing data file: $data" >&2
    return 1
  fi

  local tmp now
  tmp="$(mktemp)"
  now=$(TZ='Asia/Bangkok' date +'%Y-%m-%dT%H:%M:%S.%3N%z')

  if [[ "$ROLLBACK" == "true" ]]; then
    jq '.dissolDate = null' "$data" >"$tmp"
    echo "Rolled back dissolution date to null"
  else
    jq --arg now "$now" '.dissolDate = $now' "$data" >"$tmp"
    echo "Updated dissolution date to $now"
  fi

  mv "$tmp" "$data"
}

commit() {
  git add data.json
  git commit -m "chore: trigger dissolution [skip ci]"
  git push
}

main
commit || true
