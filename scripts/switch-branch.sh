#!/bin/bash

# Helper script to switch branches while handling case-sensitivity conflicts
# Usage: ./scripts/switch-branch.sh <branch-name>

if [[ -z "$1" ]]; then
    echo "Usage: ./scripts/switch-branch.sh <branch-name>"
    exit 1
fi

BRANCH=$1

# Check if we're already on the target branch
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" = "$BRANCH" ]]; then
    echo "Already on branch $BRANCH"
    exit 0
fi

# Remove the problematic file if it exists (case-insensitive filesystem issue)
if [[ -f "src/pages/guides/GhcGlossaryPage.tsx" ]] || [[ -f "src/pages/guides/GHCGlossaryPage.tsx" ]]; then
    echo "Cleaning up case-sensitivity conflict..."
    rm -f src/pages/guides/GhcGlossaryPage.tsx src/pages/guides/GHCGlossaryPage.tsx
fi

# Try to switch branches
if git checkout "$BRANCH" 2>&1; then
    echo "Successfully switched to branch $BRANCH"
    # Restore the file from the branch if it exists
    git restore src/pages/guides/GhcGlossaryPage.tsx 2>/dev/null || \
    git restore src/pages/guides/GHCGlossaryPage.tsx 2>/dev/null || true
    exit 0
else
    echo "Failed to switch branch. You may need to commit or stash changes first."
    exit 1
fi

