# Branch Switching Fix - Case Sensitivity Issue

## Problem

When switching between branches (especially `feat/guides-marketplace` and `stage00`), you may encounter this error:

```
error: The following untracked working tree files would be overwritten by checkout:
        src/pages/guides/GHCGlossaryPage.tsx
Please move or remove them before you switch branches.
```

## Root Cause

This is a case-sensitivity conflict:
- `feat/guides-marketplace` branch has `GhcGlossaryPage.tsx` (lowercase 'h')
- `stage00` branch has `GHCGlossaryPage.tsx` (uppercase 'H')
- macOS filesystem is case-insensitive, so both filenames point to the same file
- Git is case-sensitive, so it sees them as different files and prevents overwriting

## Solution

### Option 1: Use the Helper Script (Recommended)

A helper script has been created to automatically handle this:

```bash
./scripts/switch-branch.sh <branch-name>
```

Example:
```bash
./scripts/switch-branch.sh stage00
./scripts/switch-branch.sh feat/guides-marketplace
```

The script automatically:
1. Removes the conflicting file
2. Switches to the target branch
3. Restores the correct file version

### Option 2: Manual Fix

If you prefer to do it manually:

```bash
# Remove the conflicting file
rm -f src/pages/guides/GhcGlossaryPage.tsx src/pages/guides/GHCGlossaryPage.tsx

# Switch branches
git checkout <branch-name>

# Restore the file (git will restore the correct version)
git restore src/pages/guides/GhcGlossaryPage.tsx 2>/dev/null || \
git restore src/pages/guides/GHCGlossaryPage.tsx 2>/dev/null
```

### Option 3: Stash Changes

You can also stash your changes before switching:

```bash
git stash
git checkout <branch-name>
git stash pop  # if needed
```

## Permanent Fix (Future)

To permanently fix this issue, the filename should be normalized across all branches:
- Choose one casing (e.g., `GhcGlossaryPage.tsx`)
- Update all branches to use the same casing
- Commit the changes

## Notes

- The helper script is safe to use and won't lose any data
- Git will restore the correct file version after switching
- This only affects the `GhcGlossaryPage.tsx` / `GHCGlossaryPage.tsx` file
- The issue is specific to macOS's case-insensitive filesystem

