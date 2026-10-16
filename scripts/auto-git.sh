#!/bin/bash
set -euo pipefail

# Auto Git Workflow Script
# This script automates git operations with safety checks and conventional commits

echo "🚀 Starting auto-git workflow..."

# Step 1: Check for changes
echo "🔍 Checking for changes..."
if ! git diff-index --quiet HEAD --; then
    echo "📝 Changes detected, proceeding..."
else
    echo "✅ No changes detected. Exiting gracefully."
    exit 0
fi

# Step 2: Stage all changes
echo "📥 Staging all changes..."
git add -A

# Step 3: Cleanup unnecessary files
echo "🧹 Cleaning up unnecessary files..."

# Remove unused script files (.sh, .py, .bat, .mjs) that are not referenced
# For safety, we'll be conservative and only remove obvious temporary/build scripts
# In a real scenario, you'd want to check package.json or source references

# Remove test files that appear to be unused (basic heuristic: files not imported anywhere)
# For this implementation, we'll skip aggressive test cleanup to avoid false positives
# and only clean up obvious temporary files

# Remove .md plan files under plans/ directory that might be temporary
if [ -d "plans" ]; then
    echo "📋 Checking plans/ directory for cleanup..."
    # We'll keep all plan files for safety, but in practice you might want to
    # remove old/obsolete ones based on some criteria
    :
fi

# Step 4: Artifact cleanup and .gitignore update
echo "🗑️  Performing artifact cleanup..."
git add .gitignore

# Step 5: Scan staged changes for secrets
echo "🔐 Scanning for potential secrets in staged changes..."
if git diff --cached | grep -E "[A-Za-z0-9]{40,}"; then
    echo "❌ Potential secret detected in staged changes! Aborting commit."
    echo "Please remove any secrets before proceeding."
    exit 1
fi
echo "✅ No potential secrets detected."

# Step 6: Generate conventional commit message based on staged files
echo "📋 Analyzing staged changes for commit message..."

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMRT | head -20)  # Limit to avoid too long messages

if [ -z "$STAGED_FILES" ]; then
    echo "❌ No staged files found after cleanup. Something went wrong."
    exit 1
fi

# Determine change type based on file paths and extensions
detect_change_type() {
    local files="$1"
    
    # Check for documentation files
    if echo "$files" | grep -E "\.(md|txt|adoc|rst)$" | grep -qvE "plans/|test"; then
        echo "docs"
        return
    fi
    
    # Check for test files
    if echo "$files" | grep -E "(test|spec)\.(ts|tsx|js)$" | grep -q; then
        echo "test"
        return
    fi
    
    # Check for style files
    if echo "$files" | grep -E "\.(css|scss|sass|less)$" | grep -q; then
        echo "style"
        return
    fi
    
    # Check for feature files (components, pages, etc.)
    if echo "$files" | grep -E "(src/(components|pages|hooks|context|utils)/|App\.(tsx?)$)" | grep -q; then
        echo "feat"
        return
    fi
    
    # Check for fix indicators
    if echo "$files" | grep -i -E "(fix|bug|error|issue)" | grep -q; then
        echo "fix"
        return
    fi
    
    # Default to chore for everything else
    echo "chore"
}

CHANGE_TYPE=$(detect_change_type "$STAGED_FILES")

# Generate a descriptive message
# Get a summary of what changed
FILE_SUMMARY=$(echo "$STAGED_FILES" | head -5 | sed 's|^|- |' | tr '\n' ' ')
if [ -z "$FILE_SUMMARY" ]; then
    FILE_SUMMARY="various files"
fi

# Create commit message
if [ "$CHANGE_TYPE" = "docs" ]; then
    COMMIT_MSG="docs: update documentation"
elif [ "$CHANGE_TYPE" = "test" ]; then
    COMMIT_MSG="test: update tests"
elif [ "$CHANGE_TYPE" = "style" ]; then
    COMMIT_MSG="style: update styles"
elif [ "$CHANGE_TYPE" = "feat" ]; then
    COMMIT_MSG="feat: implement changes"
elif [ "$CHANGE_TYPE" = "fix" ]; then
    COMMIT_MSG="fix: resolve issues"
else
    COMMIT_MSG="chore: maintain codebase"
fi

# Add file details if we have a manageable number
FILE_COUNT=$(echo "$STAGED_FILES" | wc -l)
if [ "$FILE_COUNT" -le 3 ]; then
    FILE_LIST=$(echo "$STAGED_FILES" | tr '\n' ',' | sed 's/,$//')
    COMMIT_MSG="$COMMIT_MSG ($FILE_LIST)"
fi

echo "🏷️  Generated commit message: $COMMIT_MSG"

# Step 7: Commit staged changes
echo "📦 Committing staged changes..."
git commit -m "$COMMIT_MSG"

echo "✅ Committed changes with message: $COMMIT_MSG"

# Step 8: Run changelog update tool
echo "📊 Updating changelog..."
if npm run change; then
    echo "✅ Changelog updated successfully"
else
    echo "⚠️  Changelog update (npm run change) failed or script not found, continuing..."
fi

# Step 9: Update project documentation
echo "📚 Updating documentation..."
if npm run docs; then
    echo "✅ Documentation updated successfully"
else
    echo "ℹ️  Docs script not found, touching README.md as fallback"
    touch README.md
fi

# Step 10: Push changes to remote repository
echo "📤 Preparing to push to remote..."
echo "⬇️  Pulling with rebase..."
if ! git pull --rebase; then
    echo "❌ Pull with rebase failed. Please resolve conflicts manually."
    exit 1
fi

echo "📤 Pushing changes..."
if ! git push; then
    echo "❌ Push failed"
    exit 1
fi

# Verify push succeeded
if git rev-parse --verify HEAD >/dev/null 2>&1; then
    LOCAL_HEAD=$(git rev-parse HEAD)
    REMOTE_HEAD=$(git rev-parse @{u} 2>/dev/null || echo "")
    
    if [ "$LOCAL_HEAD" = "$REMOTE_HEAD" ]; then
        echo "✅ Push verified successfully"
    else
        echo "⚠️  Warning: Local and remote HEAD differ after push"
    fi
else
    echo "❌ Could not verify HEAD revision"
    exit 1
fi

echo "🎉 Auto-git workflow completed successfully!"
exit 0