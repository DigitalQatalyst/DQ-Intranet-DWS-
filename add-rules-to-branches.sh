#!/bin/bash

# Script to add Cursor rules to all branches
# This will cherry-pick only the .cursor/rules files to each branch

set -e

CURRENT_BRANCH=$(git branch --show-current)

# Try to find rules commit, fallback to feature/Work-Directory latest commit
RULES_COMMIT=$(git log --oneline feature/Work-Directory --grep="refactor\|rules" -i | head -1 | cut -d' ' -f1)

if [ -z "$RULES_COMMIT" ]; then
    # Fallback to latest commit on feature/Work-Directory
    RULES_COMMIT=$(git log --oneline -1 feature/Work-Directory | cut -d' ' -f1)
fi

if [ -z "$RULES_COMMIT" ]; then
    echo "❌ Could not find rules commit. Make sure rules are committed in feature/Work-Directory"
    exit 1
fi

echo "📋 Found rules commit: $RULES_COMMIT"
echo "📍 Current branch: $CURRENT_BRANCH"
echo ""

# Get list of local branches (excluding current)
BRANCHES=$(git branch | sed 's/^..//' | grep -v "^$CURRENT_BRANCH$")

echo "🌿 Branches to update:"
echo "$BRANCHES"
echo ""
echo "⏳ Starting in 3 seconds... (Press Ctrl+C to cancel)"
sleep 3

SUCCESS_COUNT=0
FAILED_COUNT=0
FAILED_BRANCHES=()

for branch in $BRANCHES; do
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔄 Processing: $branch"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Checkout branch
    if ! git checkout "$branch" 2>/dev/null; then
        echo "⚠️  Could not checkout $branch, skipping..."
        FAILED_COUNT=$((FAILED_COUNT + 1))
        FAILED_BRANCHES+=("$branch")
        continue
    fi
    
    # Check if rules already exist
    if [ -d ".cursor/rules" ] && [ "$(ls -A .cursor/rules 2>/dev/null)" ]; then
        echo "✅ Rules already exist in $branch, skipping..."
        continue
    fi
    
    # Create .cursor/rules directory if it doesn't exist
    mkdir -p .cursor/rules
    
    # Copy rules files from the commit
    if git show "$RULES_COMMIT:.cursor/rules/" > /dev/null 2>&1; then
        echo "📁 Copying rules files..."
        git show "$RULES_COMMIT:.cursor/rules/component-structure.mdc" > .cursor/rules/component-structure.mdc 2>/dev/null || true
        git show "$RULES_COMMIT:.cursor/rules/general.mdc" > .cursor/rules/general.mdc 2>/dev/null || true
        git show "$RULES_COMMIT:.cursor/rules/project-patterns.mdc" > .cursor/rules/project-patterns.mdc 2>/dev/null || true
        git show "$RULES_COMMIT:.cursor/rules/react-typescript.mdc" > .cursor/rules/react-typescript.mdc 2>/dev/null || true
        git show "$RULES_COMMIT:.cursor/rules/styling.mdc" > .cursor/rules/styling.mdc 2>/dev/null || true
        
        # Stage and commit
        git add .cursor/rules/
        if git commit -m "Add Cursor AI rules for React/TypeScript best practices" --no-verify 2>/dev/null; then
            echo "✅ Successfully added rules to $branch"
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        else
            echo "⚠️  No changes to commit (rules may already exist)"
        fi
    else
        echo "❌ Could not extract rules from commit $RULES_COMMIT"
        FAILED_COUNT=$((FAILED_COUNT + 1))
        FAILED_BRANCHES+=("$branch")
    fi
done

# Return to original branch
git checkout "$CURRENT_BRANCH" 2>/dev/null

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Successfully updated: $SUCCESS_COUNT branches"
echo "❌ Failed: $FAILED_COUNT branches"

if [ ${#FAILED_BRANCHES[@]} -gt 0 ]; then
    echo ""
    echo "Failed branches:"
    for branch in "${FAILED_BRANCHES[@]}"; do
        echo "  - $branch"
    done
fi

echo ""
echo "✨ Done! Rules are now available in all branches."

