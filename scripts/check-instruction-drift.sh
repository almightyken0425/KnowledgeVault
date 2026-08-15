#!/bin/sh
set -eu

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
compat_file="$repo_root/CLAUDE.md"
native_file="$repo_root/AGENTS.md"
expected_file=$(mktemp)
trap 'rm -f "$expected_file"' EXIT HUP INT TERM

printf '# Claude Code 相容入口\n\n@AGENTS.md\n' > "$expected_file"

if ! test -s "$native_file"; then
  printf '%s\n' 'AGENTS.md 不存在或沒有內容。' >&2
  exit 1
fi

if ! cmp -s "$expected_file" "$compat_file"; then
  printf '%s\n' 'CLAUDE.md 已偏離相容入口。' >&2
  exit 1
fi

printf '%s\n' '指令入口沒有漂移。'
