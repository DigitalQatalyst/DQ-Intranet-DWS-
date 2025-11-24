# How to Add Cursor Rules to All Branches

## Quick Method (Automated Script)

I've created a script that will automatically add the Cursor rules to all your branches.

### Run the script:
```bash
./add-rules-to-branches.sh
```

The script will:
1. Find the commit with the rules
2. Checkout each branch
3. Copy the rules files
4. Commit them to each branch
5. Return you to your original branch

---

## Manual Method (Step by Step)

If you prefer to do it manually or the script doesn't work:

### Option 1: Cherry-pick the rules commit to each branch

```bash
# 1. Note the commit hash with the rules
git log --oneline feature/Work-Directory | grep -i "refactor\|rules" | head -1

# 2. For each branch, do:
git checkout <branch-name>
git cherry-pick <commit-hash> --strategy-option=theirs
# Or just copy the files:
mkdir -p .cursor/rules
git show feature/Work-Directory:.cursor/rules/component-structure.mdc > .cursor/rules/component-structure.mdc
git show feature/Work-Directory:.cursor/rules/general.mdc > .cursor/rules/general.mdc
git show feature/Work-Directory:.cursor/rules/project-patterns.mdc > .cursor/rules/project-patterns.mdc
git show feature/Work-Directory:.cursor/rules/react-typescript.mdc > .cursor/rules/react-typescript.mdc
git show feature/Work-Directory:.cursor/rules/styling.mdc > .cursor/rules/styling.mdc
git add .cursor/rules/
git commit -m "Add Cursor AI rules"
```

### Option 2: Merge rules to main, then merge main into other branches

```bash
# 1. Switch to main
git checkout main

# 2. Create a branch just for rules
git checkout -b add-cursor-rules

# 3. Copy rules from feature/Work-Directory
mkdir -p .cursor/rules
git show feature/Work-Directory:.cursor/rules/component-structure.mdc > .cursor/rules/component-structure.mdc
git show feature/Work-Directory:.cursor/rules/general.mdc > .cursor/rules/general.mdc
git show feature/Work-Directory:.cursor/rules/project-patterns.mdc > .cursor/rules/project-patterns.mdc
git show feature/Work-Directory:.cursor/rules/react-typescript.mdc > .cursor/rules/react-typescript.mdc
git show feature/Work-Directory:.cursor/rules/styling.mdc > .cursor/rules/styling.mdc

# 4. Commit
git add .cursor/rules/
git commit -m "Add Cursor AI rules for React/TypeScript best practices"

# 5. Merge to main
git checkout main
git merge add-cursor-rules

# 6. Now merge main into other branches as needed
git checkout <other-branch>
git merge main
```

### Option 3: Copy files manually (simplest)

```bash
# For each branch:
git checkout <branch-name>
mkdir -p .cursor/rules
cp -r /path/to/feature/Work-Directory/.cursor/rules/* .cursor/rules/
git add .cursor/rules/
git commit -m "Add Cursor AI rules"
```

---

## Verify Rules Are Added

Check if rules exist in a branch:
```bash
git checkout <branch-name>
ls -la .cursor/rules/
```

---

## Notes

- The rules are just configuration files, they won't conflict with your code
- You can add them to any branch without issues
- The rules will guide Cursor AI in that branch, but won't automatically refactor code
- Code refactoring (removing React.FC, etc.) is separate and only in `feature/Work-Directory`


