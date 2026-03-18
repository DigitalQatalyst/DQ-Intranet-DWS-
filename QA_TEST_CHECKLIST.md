# QA Test Checklist - DWS Develop Branch
**Date:** March 4, 2026  
**Branch:** develop  
**Context:** Post auth/env/MSAL fixes validation  
**Tester:** [Your Name]  
**Environment:** Vercel Preview (develop)

---

## 🎯 Test Scope
Quick regression scan (15-20 mins) to confirm NO feature breakages after:
- Environment variable parsing fixes
- MSAL authentication updates
- KnowledgeHub console error fixes

---

## ✅ Pre-Test Setup

- [ ] Open Vercel preview URL for develop branch
- [ ] Open Browser DevTools (F12)
- [ ] Switch to Console tab - clear any existing logs
- [ ] Switch to Network tab - enable "Preserve log"
- [ ] Have this checklist ready to mark items

---

## 🧪 Test Areas

### 1. Homepage / Landing Page
**URL:** `/`

**Checks:**
- [ ] Page loads without blank sections
- [ ] Header/navigation renders correctly
- [ ] Hero section displays
- [ ] Footer renders
- [ ] No red console errors (ignore warnings unless UX-breaking)
- [ ] No 4xx/5xx in Network tab

**Console Check:**
```
Look for:
❌ Uncaught Error
❌ TypeError
❌ ReferenceError
❌ Failed to fetch
```

**Network Check:**
```
Filter by: XHR, Fetch
Look for: Status 400-599
```

**Result:** ✅ PASS / ❌ FAIL  
**Notes:**

---

### 2. Authentication / Login Flow
**URL:** `/signin` or login modal

**Checks:**
- [ ] Login button/link works
- [ ] MSAL authentication initiates
- [ ] No MSAL cache errors in console
- [ ] Token acquisition succeeds
- [ ] User session persists after login
- [ ] No 401/403 errors in Network

**Console Check:**
```
Look for:
✅ [MSAL] Successfully acquired token
❌ [MSAL] Error
❌ MSAL_CACHE_GUARD_RELOADING
```

**Network Check:**
```
Check: /token, /authorize endpoints
Status: Should be 200 or 302
```

**Result:** ✅ PASS / ❌ FAIL  
**Notes:**

---

### 3. Knowledge Hub / Knowledge Center
**URL:** `/knowledge-center` or `/knowledge-hub`

**Checks:**
- [ ] Page loads successfully
- [ ] Guidelines tab displays content
- [ ] GHC (Growth Hub Content) tab displays if available
- [ ] Tab switching works
- [ ] Search/filter functionality works
- [ ] Card clicks navigate correctly
- [ ] No Supabase 404/403 errors

**Console Check:**
```
Look for:
✅ [KnowledgeHub] Data loaded successfully
❌ Could not find the table
❌ PGRST205 error
❌ 403 Forbidden
```

**Network Check:**
```
Check: Supabase REST API calls
URL pattern: *.supabase.co/rest/v1/*
Status: Should be 200
```

**Result:** ✅ PASS / ❌ FAIL  
**Notes:**

---

### 4. Learning Center / LMS
**URL:** `/lms` or `/dashboard/learning`

**Checks:**
- [ ] Page loads without errors
- [ ] Course cards display
- [ ] Course filtering works
- [ ] Course detail pages load
- [ ] Enrollment/progress tracking works
- [ ] No QueryClient errors (React Query)

**Console Check:**
```
Look for:
✅ Courses loaded
❌ No QueryClient set
❌ useQuery error
❌ Failed to fetch courses
```

**Network Check:**
```
Check: LMS Supabase instance calls
URL: ivfovdutzaejsfbhqdks.supabase.co
Status: Should be 200
```

**Result:** ✅ PASS / ❌ FAIL  
**Notes:**

---

### 5. Media Center / News Marketplace
**URL:** `/marketplace/opportunities` or `/media-center`

**Checks:**
- [ ] Page loads successfully
- [ ] News/announcements tab displays
- [ ] Jobs/opportunities tab displays
- [ ] Blogs tab displays (if available)
- [ ] Podcasts tab displays (if available)
- [ ] Filtering works
- [ ] Card clicks navigate to detail pages
- [ ] No "table not found" errors

**Console Check:**
```
Look for:
❌ Could not find the table 'public.news'
❌ Could not find the table 'public.jobs'
❌ PGRST205
✅ Should show empty state OR data
```

**Network Check:**
```
Check: /rest/v1/news, /rest/v1/jobs
Status: 200 (with data) or 200 (empty array)
NOT: 404
```

**Result:** ✅ PASS / ❌ FAIL  
**Notes:**

---

### 6. Onboarding Journey
**URL:** `/onboarding/journey` or `/dashboard/onboarding`

**Checks:**
- [ ] Page loads without errors
- [ ] Multi-step form displays
- [ ] Step navigation works
- [ ] Form validation works
- [ ] Auto-save functionality works
- [ ] Progress indicator updates
- [ ] No employee data fetch errors

**Console Check:**
```
Look for:
✅ Auto-saved progress
❌ Failed to save onboarding data
❌ No employee record found
```

**Network Check:**
```
Check: LMS Supabase calls for employee data
URL: ivfovdutzaejsfbhqdks.supabase.co
Endpoints: /employee_onboarding_data, /employees
```

**Result:** ✅ PASS / ❌ FAIL  
**Notes:**

---

### 7. Explore Dropdown Navigation
**URL:** Top navigation "Explore" menu

**Checks:**
- [ ] Dropdown opens on click/hover
- [ ] All menu items display
- [ ] Links navigate correctly
- [ ] No broken routes (404s)
- [ ] Submenu items work

**Test Links:**
- [ ] DQ Media Center
- [ ] Knowledge Hub
- [ ] Learning Center
- [ ] Work Directory
- [ ] Asset Library
- [ ] Communities

**Result:** ✅ PASS / ❌ FAIL  
**Notes:**

---

### 8. Dashboard (if authenticated)
**URL:** `/dashboard`

**Checks:**
- [ ] Dashboard loads after login
- [ ] Widgets/cards display
- [ ] Navigation sidebar works
- [ ] Overview page shows data
- [ ] Profile page accessible
- [ ] Settings page accessible

**Result:** ✅ PASS / ❌ FAIL  
**Notes:**

---

## 🔍 Specific Checks for Known Issues

### Environment Variables
- [ ] Supabase URLs resolve correctly (check Network tab)
- [ ] Azure AD client ID is valid (check MSAL logs)
- [ ] No "undefined" in API URLs

### MSAL Authentication
- [ ] No cache guard reload loops
- [ ] Token acquisition succeeds
- [ ] No CORS errors for auth endpoints

### KnowledgeHub
- [ ] Data loads from correct Supabase instance
- [ ] No 403/404 for knowledge endpoints
- [ ] Console shows successful data fetch

---

## 📊 Summary Report

### ✅ Passed Areas
- 
- 
- 

### ❌ Failed Areas / Blockers
**Issue 1:**
- **Route/Page:** 
- **Steps to Reproduce:** 
- **Console Error:** 
- **Network Error:** 
- **Screenshot/Evidence:** 

**Issue 2:**
- **Route/Page:** 
- **Steps to Reproduce:** 
- **Console Error:** 
- **Network Error:** 
- **Screenshot/Evidence:** 

### ⚠️ Warnings (Non-blocking)
- 
- 

---

## 🎯 Final Verdict

**Status:** [ ] ✅ Safe to merge to develop  /  [ ] ❌ Blockers exist

**Confidence Level:** [ ] High  /  [ ] Medium  /  [ ] Low

**Recommendation:**
- 

**Additional Notes:**
- 

---

## 📸 Evidence Collection

### Console Screenshots
1. Homepage console: [attach]
2. KnowledgeHub console: [attach]
3. Media Center console: [attach]
4. Any error screens: [attach]

### Network Tab Screenshots
1. Failed requests (if any): [attach]
2. Auth token flow: [attach]
3. Supabase API calls: [attach]

---

**Tester Signature:** _______________  
**Date Completed:** _______________  
**Time Spent:** _______________
