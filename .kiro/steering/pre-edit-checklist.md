---
inclusion: always
---

# Pre-Edit Checklist — DQ Intranet

Run through this before making any edit. These are lessons learned from real bugs in this codebase.

---

## 1. CSS Selectors Must Match Actual DOM Classes

Before writing or editing any `document.querySelector` / `querySelectorAll` call, verify the actual `className` on the target element in the JSX.

- The guidelines content wrapper uses `className="guideline-body max-w-none"` — NOT `prose`.
- Any selector targeting guideline headings must use `.guideline-body h1[id]`, not `.prose h1[id]`.
- When in doubt, `grep` the className in the component file before writing the selector.

## 2. Async Content + DOM Queries — Always Re-Run After Data Loads

If a component queries the DOM for content that is loaded asynchronously (e.g. from Supabase), the `useEffect` with `setTimeout` will fire before the HTML is injected.

**Pattern to follow:**
- Pass the async data (e.g. `guideHtml`) as a prop or dependency to the component doing the DOM query.
- Include it in the `useEffect` dependency array so the query re-runs after the data arrives.
- Example: `SideNav` receives `guideHtml` as a prop and its extraction `useEffect` depends on `[guideHtml]`.

## 3. Raw HTML from Database — Always Sanitize Artifacts

HTML stored in Supabase may contain artifacts that need stripping before render:

- Literal `\n` escape sequences → replace with `replaceAll('\\n', '\n')` ✅ already done
- Leading `|` pipe characters before heading text → strip with:
  ```ts
  processedHtml = processedHtml.replace(/(<h[1-6][^>]*>)\s*\|\s*/gi, '$1')
  ```
- Always run `DOMPurify.sanitize()` on any HTML before injecting via `dangerouslySetInnerHTML`.
- Add `// codacy-disable-next-line react/no-danger` above `dangerouslySetInnerHTML` lines.
- Prefer ref-based injection: use `useRef<HTMLDivElement>` and set `ref.current.innerHTML = DOMPurify.sanitize(html)` inside a `useEffect` — this avoids `dangerouslySetInnerHTML` entirely. See `SafeHTMLBlock` in `HTMLProcessor.tsx` as the pattern.

## 4. SonarCloud / Codacy — Common Violations to Avoid

These have caused PR check failures before:

- **Unused imports** — remove any import not referenced in the file.
- **Array index keys** — never use `index` as a React `key`. Use a stable ID.
- **Negated conditions** — avoid `if (!condition) { A } else { B }`. Flip to positive.
- **Nested ternaries** — extract to a variable or helper function.
- **`if-in-else` pattern** — if the `if` block returns/throws, remove the `else`.
- **`String#replace` with regex** — use `replaceAll` for literal string replacements.
- **`typeof window !== 'undefined'`** — use `globalThis.window !== undefined` instead.
- **Non-interactive elements with click handlers** — add `role`, `tabIndex`, `onKeyDown` for accessibility.
- **Cognitive complexity** — if a function exceeds ~15 complexity, extract sub-functions.
- **`GHC_SERVICE_IDS` or similar lookup arrays** — convert to `Set` and use `.has()`.
- **Props in marketplace/ServiceDetailPage** — mark interface props as `readonly`.

## 5. Tab Bar / Layout — Know Which Column Things Live In

- The tab bar in `ServiceDetailPage.tsx` (guides) lives inside the LEFT column, not above the grid.
- The accent line width is `10px` (not `6px`).
- Hero sections do NOT show date/author metadata.

## 6. Marketplace Categorization

- `policy-set-2f-flow` is the correct slug for the "DQ Associate Owned Asset Guidelines" service — not `dq-associate-owned-asset-guidelines`.
- GHC service IDs are stored as a `Set` (not array) for O(1) `.has()` lookups.

## 7. Card Design Consistency

All guide/blueprint/testimonial cards follow this pattern:
- Flush image at top (no padding)
- Badge rendered below the image
- No `<hr>` separator
- "View Details" CTA button
- Draft/blueprint/testimonial cards show a "Coming Soon" pill overlay

## 8. Before Pushing — Run Diagnostics

Always call `getDiagnostics` on every file edited before committing. Never rely on "it looks right" — the tool catches type errors, unused vars, and lint issues that will fail the PR checks.

## 9. Git Workflow

- Branch: `feature/Knowledge-Center-Caleb`
- Push commands must be run as separate statements (no `&&` in PowerShell).
- Commit message format: `fix: <short description>` or `feat: <short description>`
- Push after each logical batch of fixes, not at the very end.

## 10. Component-Specific Notes

| Component | Key Gotcha |
|---|---|
| `SideNav.tsx` | Selector is `.guideline-body h1[id]`; depends on `guideHtml` prop |
| `GuidelinePage.tsx` | Strips `\n` and `\|` from raw HTML; passes `guideHtml` to `SideNav` |
| `HTMLProcessor.tsx` | Always wraps output in `DOMPurify.sanitize()`; codacy comments on `dangerouslySetInnerHTML` |
| `MarketplacePage.tsx` | Uses `GHC_SERVICE_IDS` as a `Set`; `policy-set-2f-flow` slug |
| `GuideCard.tsx` | Stable keys from item ID, not array index |
| `ServiceDetailPage.tsx` (guides) | Tab bar inside left column; `GHC_SERVICE_IDS` Set |
| `MarketplaceDetailsPage.tsx` | Cognitive complexity extracted into helpers |
