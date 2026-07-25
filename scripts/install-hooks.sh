#!/usr/bin/env bash
# Install pre-commit hook vào .git/hooks.
# Chạy 1 lần sau khi clone.

set -e

HOOK_SRC="scripts/pre-commit.sh"
HOOK_DST=".git/hooks/pre-commit"

if [ ! -f "$HOOK_SRC" ]; then
  echo "❌ Missing $HOOK_SRC"
  exit 1
fi

cp "$HOOK_SRC" "$HOOK_DST"
chmod +x "$HOOK_DST"

echo "✅ Installed pre-commit hook → $HOOK_DST"
echo "   Bypass bằng: git commit --no-verify"
