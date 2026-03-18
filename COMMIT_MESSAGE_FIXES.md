# Commit Message Fixes Required

To fix commit messages, run the following interactive rebase:

```bash
git rebase -i HEAD~7
```

Then change the commit messages as follows:

## Commits to Fix

1. **3236ab9** - `Update vercel-deploy.yml`
   - Change to: `chore(ci): update vercel-deploy.yml`

2. **edd6113** - `Updated vercel-deploy.yml`
   - Change to: `chore(ci): update vercel-deploy.yml`

3. **0e79405** - `Update vercel-deploy.yml`
   - Change to: `chore(ci): update vercel-deploy.yml`

4. **8d67392** - `Create Trigger.md`
   - Change to: `docs: create Trigger.md`

5. **09d81da** - `Standardize guideline titles to DQ prefix format and add DQ Ops unit filter`
   - Change to: `feat(guides): standardize guideline titles to DQ prefix format and add DQ Ops unit filter`

6. **05687b1** - `changes` (merge commit)
   - Change to: `chore: merge cursor rules and documentation updates`

7. **2a36faf** - `Add guidelines pages and update service titles with (HoV) and (GHC) suffixes`
   - Change to: `feat(guides): add guidelines pages and update service titles with (HoV) and (GHC) suffixes`

## Interactive Rebase Instructions

1. Run: `git rebase -i HEAD~7`
2. In the editor, change `pick` to `reword` for each commit you want to change
3. Save and close
4. For each commit, update the commit message
5. Save and close each time
6. If conflicts occur, resolve them and run `git rebase --continue`

**Note**: This will rewrite git history. Only do this if the branch hasn't been pushed or if you're okay with force-pushing.



