#!/bin/bash
set -euo pipefail

###############################################################################
# Auto-git workflow: status check, cleanup, secret scanning, commit, push
# Conventional commit message based on staged files
# Updates CHANGELOG.md and README.md as needed
###############################################################################

# -- Helper functions ---------------------------------------------------------#

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

  if [ -z "$staged_files" ]; then
    echo "chore: automated commit"
    return
  fi

  while IFS= read -r file; do
    [ -z "$file" ] && continue
    case "$file" in
      CHANGELOG.md)        has_changelog=true ;;
      README.md)           has_readme=true ;;
      src/*)               has_src=true ;;
      tests/*)             has_tests=true ;;
      public/locales/*|src/content/*|src/i18n.ts) has_docs=true ;;
      scripts/*)           has_scripts=true ;;
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
    type="chore"
  fi

  # Build scope array
  local scopes=()
  $has_src   && scopes+=("src")
  $has_tests && scopes+=("tests")
  $has_docs  && scopes+=("docs")
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

# -- 1. Status check --------------------------------------------------------#

echo "=== Auto-Git Workflow ==="

if [ -z "$(git status --porcelain)" ]; then
  echo "No changes to commit."
  exit 0
fi

echo "Changes detected:"
git status --porcelain

# -- 2. Cleanup: temporary / useless scripts and test artifacts ---------------#

echo "=== Cleaning up temporary scripts and artifacts ==="

# Remove unused .sh, .py, .bat, .mjs scripts (untracked only)
for ext in sh py bat mjs; do
  # List untracked temp scripts and remove them safely
  untracked=$(git ls-files --others --exclude-standard "*.$ext" 2>/dev/null || true)
  if [ -n "$untracked" ]; then
    echo "Removing untracked *.$ext scripts:"
    echo "$untracked" | while IFS= read -r f; do
      echo "  rm '$f'"
      rm -f "$f"
    done
  fi
done

# Clean up no-longer-used .md plan files from plans/ directory
if [ -d plans ]; then
  # Remove temporary plan files (keep architecture-*.md, developer-card-*.md, diet-plan-*.md)
  for f in plans/*.md; do
    [ -f "$f" ] || continue
    base=$(basename "$f")
    # Keep: architecture-improvements.md, developer-card-redesign.md, diet-plan-architecture.md
    case "$base" in
      architecture-improvements.md|developer-card-redesign.md|diet-plan-architecture.md) continue ;;
    esac
    echo "Removing outdated plan file: $f"
    rm -f "$f"
  done
fi

# Artifact cleanup: remove common build/test artifacts if not gitignored
rm -rf dist/.cache 2>/dev/null || true
rm -rf .vitest 2>/dev/null || true

# Validate .gitignore staging - ensure key exclusions are tracked
if [ -f .gitignore ]; then
  echo "Validating .gitignore coverage..."
  grep -qE "node_modules|dist|*.log|*.env" .gitignore 2>/dev/null && echo ".gitignore contains expected patterns" || echo "WARNING: .gitignore may be missing common patterns"
fi

# -- 3. Git add -------------------------------------------------------------#

echo "=== Staging changes ==="
git add .

# -- 4. Secret scanning on staged file contents -----------------------------#

echo "=== Scanning for secrets in staged files ==="
secret_scan_passed=true

# Scan only actual staged file contents, excluding the script itself
for ext in sh py bat mjs; do
  # Check staged (added) files for secret patterns
  staged__files=$(git diff --cached --name-only --diff-filter=ACM | grep "\.$ext$" || true)
  if [ -n "$staged__files" ]; then
    echo "Checking *.$ext staged files for secrets..."
    while IFS= read -r f; do
      [ -z "$f" ] && continue
      # Only scan if file still exists
      [ -f "$f" ] || continue
      # Skip the auto-git script itself
      [ "$f" = "scripts/auto-git.sh" ] && continue
      # Scan file contents for common secret patterns
      if grep -qE "AIza[0-9A-Za-z_-]{35}|[0-9a-fA-F]{32}|ghp_[0-9a-zA-Z]{36}|sk_live_|secret\s*[=:]\s*\S+|password\s*[=:]\s\S+" "$f" 2>/dev/null; then
        echo "WARNING: Potential secret detected in $f"
        secret_scan_passed=false
      fi
    done <<< "$staged__files"
  fi
done

# Also scan all staged text files for obvious secrets (broader check), excluding script
staged_all=$(git diff --cached --name-only --diff-filter=ACM | while IFS= read -r f; do [ -f "$f" ] && cat "$f" 2>/dev/null; done || true)
if [ -n "$staged_all" ]; then
  # Exclude the script from the broader check
  staged_filtered=$(echo "$staged_all" | grep -v "^.*scripts/auto-git.sh$" || true)
  if [ -n "$staged_filtered" ] && echo "$staged_filtered" | grep -qE "AIza[0-9A-Za-z_-]{35}|ghp_[0-9a-zA-Z]{36}"; then
    echo "WARNING: Potential secret detected in staged file contents"
    secret_scan_passed=false
  fi
fi

if $secret_scan_passed; then
  echo "Secret scan passed."
else
  echo "Potential secrets detected in staged changes. Aborting."
  exit 1
fi

# -- 5. Generate conventional commit message --------------------------------#

echo "=== Generating commit message ==="
COMMIT_MSG=$(generate_commit_message)
echo "Proposed commit message: $COMMIT_MSG"

# -- 6. Commit --------------------------------------------------------------#

echo "=== Committing ==="
git commit -m "$COMMIT_MSG"

# -- 7. Update CHANGELOG.md if modifications occurred -----------------------#

if git diff --cached --name-only | grep -q "CHANGELOG.md"; then
  echo "CHANGELOG.md is staged - verifying update..."
  # Ensure format starts with version header
  if head -3 CHANGELOG.md | grep -qE "## \\["; then
    echo "CHANGELOG.md appears properly formatted."
  else
    echo "WARNING: CHANGELOG.md may not follow expected format."
  fi
fi

# If any src/ or test files were committed, note to update CHANGELOG.md
has_src=false
has_tests=false
while IFS= read -r file; do
  [ -z "$file" ] && continue
  case "$file" in
    src/*) has_src=true ;;
    tests/*) has_tests=true ;;
  esac
done <<< "$(git diff --cached --name-only --diff-filter=ACM | sort)"

if $has_src || $has_tests; then
  echo "Note: Source/test changes detected - remember to update CHANGELOG.md under ## [Unreleased] or appropriate version."
fi

# -- 8. Update README.md if necessary ---------------------------------------#

if git diff --cached --name-only | grep -q "README.md"; then
  echo "README.md was staged - verifying content..."
  if [ -f README.md ]; then
    echo "README.md present and staged."
  fi
fi

# -- 9. Pull with rebase to avoid conflicts --------------------------------#

echo "=== Updating from remote (rebase) ==="
git pull --rebase origin main || {
  echo "Rebase failed - resolving conflicts..."
  if git rebase --abort 2>/dev/null; then
    echo "Rebase aborted. Please resolve conflicts manually and re-run."
    exit 1
  fi
}

# -- 10. Comprehensive compliance & duplicate analysis -----------------------#

echo "=== Compliance & duplicate analysis ==="

# Check commit count in this session
commit_count=$(git log --oneline -5 --since="today midnight" 2>/dev/null | wc -l || echo 0)
echo "Recent commit count (last 24h): $commit_count"

# Check for duplicate messages in recent commits
recent_msgs=$(git log --oneline -10 --format="%s" 2>/dev/null || true)
if echo "$recent_msgs" | grep -q "$COMMIT_MSG"; then
  echo "WARNING: Potential duplicate commit message detected in recent history."
fi

# Verify no blocked patterns in commit message
if echo "$COMMIT_MSG" | grep -qiE "wip|fixme|todo"; then
  echo "WARNING: Commit message contains development markers (wip/fixme/todo)."
fi

# -- 11. Push with conflict handling ----------------------------------------#

echo "=== Pushing to remote ==="
push_attempt=0
max_attempts=3

while [ $push_attempt -lt $max_attempts ]; do
  push_attempt=$((push_attempt + 1))
  echo "Push attempt $push_attempt/$max_attempts..."
  
  if git push origin main 2>/dev/null; then
    echo "Push successful on attempt $push_attempt."
    break
  else
    echo "Push failed on attempt $push_attempt - likely remote has newer commits."
    if [ $push_attempt -lt $max_attempts ]; then
      echo "Attempting rebase before retry..."
      git pull --rebase origin main 2>/dev/null || {
        echo "Rebase failed - cannot continue."
        exit 1
      }
    fi
  fi
done

# If we exited the loop without breaking, push failed max_attempts times
if [ $push_attempt -eq $max_attempts ] && ! git push origin main 2>/dev/null; then
  echo "ERROR: Push failed after $max_attempts attempts."
  exit 1
fi

# -- 12. Verify git push has really occurred --------------------------------#

if git ls-remote --heads origin main | grep -q "$(git rev-parse HEAD)"; then
  echo "Push verified successfully - remote HEAD matches local HEAD."
else
  echo "WARNING: Push verification could not confirm remote HEAD match."
  echo "Current local HEAD: $(git rev-parse HEAD)"
  echo "Remote ref: $(git ls-remote --heads origin main)"
fi

# -- 13. Resolve any fatal errors -----------------------------------------#

echo "=== Final verification ==="

# Check for any remaining unmerged paths
unmerged=$(git status --porcelain | grep "^UU\|^AA\|^UD\|^DU" || true)
if [ -n "$unmerged" ]; then
  echo "Unmerged paths detected - please resolve conflicts:"
  git status | grep -A1 "^Unmerged path"
fi

# Final status
echo ""
echo "=== Auto-git workflow completed ==="
echo "Commit: $COMMIT_MSG"
git status --porcelain
echo "Remote status:"
git status -u origin/main 2>/dev/null || echo "Could not compare with remote."
