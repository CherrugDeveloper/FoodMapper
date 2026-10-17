#!/bin/bash
set -euo pipefail

# Function to generate conventional commit message
generate_commit_message() {
  local staged_files=$(git diff --cached --name-only --diff-filter=ACM | sort)
  local has_changelog=false
  local has_readme=false
  local has_src=false
  local has_tests=false
  local has_docs=false
  local has_scripts=false
  local has_config=false
  local type="chore"
  local scope=""

  while IFS= read -r file; do
    case "$file" in
      CHANGELOG.md) has_changelog=true ;;
      README.md) has_readme=true ;;
      src/*) has_src=true ;;
      tests/*) has_tests=true ;;
      public/locales/*|src/content/*|src/i18n.ts) has_docs=true ;;
      scripts/*) has_scripts=true ;;
      *.json|*.config.*|*.rc|eslint.config.js|vite.config.ts|playwright.config.ts) has_config=true ;;
    esac
  done <<< "$staged_files"

  # Determine type
  if $has_src || $has_tests; then
    type="feat"
  fi
  if $has_config; then
    type="chore"
  fi
  if $has_docs && ! $has_src && ! $has_tests; then
    type="docs"
  fi
  if $has_changelog; then
    # If only changelog, still chore but we'll note
    type="chore"
  fi

  # Build scope
  local scopes=()
  $has_src && scopes+=("src")
  $has_tests && scopes+=("tests")
  $has_docs && scopes+=("docs")
  $has_scripts && scopes+=("scripts")
  $has_config && scopes+=("config")
  $has_readme && scopes+=("readme")
  $has_changelog && scopes+=("changelog")

  if [ ${#scopes[@]} -gt 0 ]; then
    scope="($(IFS=,; echo "${scopes[*]}"))"
  fi

  # Construct message
  echo "${type}${scope}: automated commit"
}

echo "=== Auto-Git Workflow ==="

# Status check
if [ -z "$(git status --porcelain)" ]; then
  echo "No changes to commit."
  exit 0
fi

echo "Changes detected:"
git status --porcelain

# Git add
git add .

# Cleanup of useless files (optional, be careful)
# We'll skip automatic deletion for safety; user can manually clean.
# Instead we'll just note.

# Secret scanning
echo "Scanning for secrets in staged diff..."
if git diff --cached | grep -qE "AIza[0-9A-Za-z_-]{35}|[0-9a-fA-F]{32}|ghp_[0-9a-zA-Z]{36}"; then
  echo "Potential secrets detected in staged changes. Aborting."
  exit 1
fi

# Generate conventional commit message based on staged files
COMMIT_MSG=$(generate_commit_message)
echo "Proposed commit message: $COMMIT_MSG"

# Commit
git commit -m "$COMMIT_MSG"

# Pull with rebase to avoid conflicts
echo "Updating from remote..."
git pull --rebase origin main

# Push
echo "Pushing to remote..."
git push origin main

# Verify push
if git ls-remote --heads origin main | grep -q "$(git rev-parse HEAD)"; then
  echo "Push verified successfully."
else
  echo "Error: Push verification failed."
  exit 1
fi

echo "Auto-git completed."
