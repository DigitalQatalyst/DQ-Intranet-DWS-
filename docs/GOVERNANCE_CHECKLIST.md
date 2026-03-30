# DQ DWS Repository Governance Checklist

Use this checklist before creating a PR to ensure compliance with governance rules.

## Pre-PR Checklist

### Branch Management
- [ ] Branch name follows convention: `feature/<name>` or `fix/<name>` or `hotfix/<name>`
- [ ] If PR-ready, branch name ends with `_completed`
- [ ] Branch created from `develop` (not `main` or `staging`)
- [ ] PR will target `develop` (not `main` or `staging`)

### Commits
- [ ] All commits follow Conventional Commits format: `<type>(scope): message`
- [ ] Allowed types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`, `ci`
- [ ] No generic messages like "update", "changes", "fix bug"
- [ ] No emoji-only commits

### Build & Tests
- [ ] Build command executed: `npm run build`
- [ ] Tests executed: `npm test` (or explicitly declare "no tests")
- [ ] Lint executed: `npm run lint`
- [ ] All tests pass
- [ ] Build succeeds without errors

### PR Description
- [ ] Clear feature description included
- [ ] Reference to Spec/Audit/Task provided
- [ ] Scope summary (what changed, what didn't)
- [ ] Risks/assumptions documented
- [ ] Build command execution documented
- [ ] Test execution documented (or "no tests" declared)
- [ ] Test results attached (if applicable)

### Code Quality
- [ ] No console.log/error/warn in production code
- [ ] No dead code
- [ ] No duplicate logic
- [ ] Components/functions not oversized
- [ ] Error handling present
- [ ] No hard-coded values (use constants/config)

### Security
- [ ] Auth checks present where required
- [ ] RBAC enforced on write operations
- [ ] No secrets/tokens/credentials in code
- [ ] File uploads/downloads validated
- [ ] Input validation present

### Integration
- [ ] API compatibility maintained
- [ ] No UI breaking changes (or documented)
- [ ] State management impact assessed
- [ ] Backward compatibility maintained (or migration plan)

---

## Quick Reference

### Conventional Commits Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `chore`: Maintenance tasks
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `docs`: Documentation changes
- `ci`: CI/CD changes

**Examples**:
- ✅ `feat(guides): add glossary filtering`
- ✅ `fix(marketplace): resolve filter sidebar issue`
- ✅ `chore(ci): update vercel-deploy.yml`
- ❌ `Update vercel-deploy.yml`
- ❌ `changes`
- ❌ `fix bug`

---

## Common Issues to Avoid

1. **Generic commit messages**: Use descriptive, specific messages
2. **Console statements**: Remove or use proper logging
3. **Missing test evidence**: Always document test execution
4. **Incomplete PR description**: Include all required sections
5. **Wrong branch target**: Always target `develop` for features
6. **Large change sets**: Consider splitting into smaller PRs

---

## When Ready for PR

1. Complete all checklist items
2. Review governance audit report
3. Address any blocking issues
4. Create PR with complete description
5. Request governance audit if needed

