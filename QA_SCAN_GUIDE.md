# Quick QA Scan Guide for Reviewer Response

## 🎯 What to Test (5-10 minutes)

### 1. Homepage (1 min)
- [ ] Page loads without blank sections
- [ ] Header navigation renders
- [ ] Explore dropdown opens and links work
- [ ] Console: No red errors
- [ ] Network: No 401/403/500 errors

**Quick Check:** Open DevTools → Console tab → Look for red errors

---

### 2. Knowledge Hub (2 min)
**URL:** Navigate via "Explore" → "DQ Knowledge Center"

- [ ] Page loads successfully
- [ ] Guidelines tab shows cards
- [ ] GHC tab shows cards (if available)
- [ ] Tab switching works
- [ ] Console: No "404 Not Found" for `/rest/v1/guides`
- [ ] Network: Requests go to `jmhtrffmxjxhoxpesubv.supabase.co` (Knowledge Hub DB)

**Expected:** Cards display, no 404 errors (recently fixed)

---

### 3. Learning Center (1 min)
**URL:** `/dashboard/learning` or via navigation

- [ ] Page loads (not blank)
- [ ] Course cards display
- [ ] Console: No "No QueryClient set" error
- [ ] Network: Requests to `ivfovdutzaejsfbhqdks.supabase.co` (LMS DB)

**Expected:** No QueryClient errors (recently fixed)

---

### 4. Media Center (2 min)
**URL:** `/marketplace/opportunities` or "DQ Media Center"

- [ ] Page loads
- [ ] Tabs display (News, Jobs, etc.)
- [ ] Tab switching works
- [ ] Click one item → detail page loads
- [ ] Console: No "table not found" errors
- [ ] Network: No repeated 404s for `/rest/v1/news` or `/rest/v1/jobs`

**Expected:** May show empty state if DB not seeded (not a blocker)

---

### 5. Onboarding Journey (1 min)
**URL:** `/onboarding/journey` or `/dashboard/onboarding`

- [ ] Page loads
- [ ] Form displays
- [ ] Navigation works
- [ ] Console: No critical errors
- [ ] Network: No auth failures

**Expected:** Multi-step form loads correctly

---

## 🚨 What to Look For

### Console Errors (Red = Blocker)
```
❌ BLOCKER: Uncaught TypeError, ReferenceError
❌ BLOCKER: No QueryClient set
❌ BLOCKER: MSAL authentication failed
❌ BLOCKER: Could not find the table 'guides' (404)
✅ OK: Mixpanel blocked (ad blocker)
✅ OK: React DevTools warnings
```

### Network Errors (Check Status Codes)
```
❌ BLOCKER: 401/403 for auth endpoints (repeated)
❌ BLOCKER: 500 Internal Server Error
❌ BLOCKER: 404 for critical APIs (guides, courses)
✅ OK: 404 for optional resources (images)
✅ OK: Single 401 that auto-retries successfully
```

---

## 📋 Test Results Template

### A) Test Scan Result Summary

**Tested Areas:**
- ✅ Homepage - Loads, nav works, no console errors
- ✅ Knowledge Hub - Cards display, no 404 errors, tabs work
- ✅ Learning Center - Loads, courses display, no QueryClient errors
- ✅ Media Center - Loads, tabs work, may show empty (DB not seeded)
- ✅ Onboarding - Form loads, navigation works

**Console Check:**
- No blocking errors found
- Mixpanel blocked (expected, ad blocker)

**Network Check:**
- No auth failures
- No repeated 4xx/5xx for critical APIs
- Knowledge Hub correctly queries jmhtrffmxjxhoxpesubv.supabase.co

**Verdict:** ✅ No feature breakages detected

---

### B) Message to Reviewer

**Option 1: All Clear**
```
Quick test scan completed on develop preview:

✅ Homepage, navigation, and Explore dropdown - working
✅ Knowledge Hub - cards loading, no 404 errors (recent fix applied)
✅ Learning Center - loads correctly, no QueryClient errors (recent fix applied)
✅ Media Center - tabs functional (may show empty state pending DB seed)
✅ Onboarding Journey - form loads and navigates correctly

Console: No blocking errors
Network: No auth failures or critical API errors

All core features operational. Safe to proceed.
```

**Option 2: Issues Found**
```
Quick test scan on develop preview found:

✅ Homepage, navigation - working
❌ Knowledge Hub - 404 errors for guides table
   Steps: Navigate to Knowledge Center → Open console
   Error: GET .../rest/v1/guides 404 (Not Found)
   
✅ Learning Center - working
✅ Media Center - working (empty state)
✅ Onboarding - working

Blocker: Knowledge Hub needs database fix before merge.
```

---

## 🎯 Quick Decision Tree

```
Did you find any RED console errors?
├─ No → ✅ Proceed
└─ Yes → Are they blocking UX?
    ├─ No (warnings only) → ✅ Proceed
    └─ Yes → ❌ Report as blocker

Did you find repeated 401/403/500 in Network?
├─ No → ✅ Proceed
└─ Yes → ❌ Report as blocker

Do core pages load and function?
├─ Yes → ✅ Proceed
└─ No (blank/broken) → ❌ Report as blocker
```

---

## 📸 Evidence to Collect (Optional)

If you find issues:
1. Screenshot of console error
2. Screenshot of Network tab showing failed request
3. Copy exact error message text
4. Note the URL/route where it occurred

---

## ⏱️ Time Estimate
- **Minimum scan:** 5 minutes
- **Thorough scan:** 10 minutes
- **With screenshots:** 15 minutes

---

## 🎯 Confidence Levels

**High Confidence (Safe to Report):**
- All pages load
- No red console errors
- No repeated API failures
- Core interactions work

**Medium Confidence (Needs Clarification):**
- Some warnings in console
- Empty states (unclear if bug or missing data)
- Single failed request that retries

**Low Confidence (Don't Report Yet):**
- Didn't test all areas
- Unclear if error is blocking
- Can't reproduce consistently
