#!/bin/bash
set -euo pipefail

# Status check
if [ -z "$(git status --porcelain)" ]; then
  echo "No changes to commit."
  exit 0
fi

# Git add
git add .

# Secret scanning
if git diff --cached | grep -qE "AIza[0-9A-Za-z-_]{35}|[0-9a-fA-F]{32}|ghp_[0-9a-zA-Z]{36}"; then
  echo "Potential secrets detected in staged changes. Aborting."
  exit 1
fi

# Commit execution (simplified for now)
git commit -m "chore: automated commit"

# Push to remote
git pull --rebase origin main
git push origin main
