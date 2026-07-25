#!/usr/bin/env bash
# Pre-commit hook: chặn commit nếu typecheck/lint/test fail.
# Install: bash scripts/install-hooks.sh
# Skip: git commit --no-verify

set -e

echo "🔍 Running pre-commit checks..."
echo ""

# 1. typecheck
echo "1/3 typecheck..."
npm run typecheck || {
  echo "❌ Typecheck failed. Run 'npm run typecheck' to see errors."
  exit 1
}

# 2. lint (chỉ file đã thay đổi thôi, nhanh hơn)
echo "2/3 lint..."
STAGED=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx)$' || true)
if [ -n "$STAGED" ]; then
  npx eslint $STAGED || {
    echo "❌ Lint failed. Run 'npm run lint:fix' to auto-fix."
    exit 1
  }
fi

# 3. test (chỉ test liên quan đến file đã thay đổi)
echo "3/3 test..."
npm test -- --run || {
  echo "❌ Tests failed. Run 'npm test' to see details."
  exit 1
}

echo ""
echo "✅ All checks passed. Committing."
