# Anonymous Responses Analysis for Pulse Marketplace

## Executive Summary

**Answer: YES, it is possible to support truly anonymous responses**, but significant changes are required to the database schema, constraints, RLS policies, and API logic.

---

## Current State Analysis

### 1. Database Schema

#### `pulse_responses` table (Surveys & Polls)
- ✅ `user_id` is **nullable** (`UUID REFERENCES auth.users(id)`)
- ✅ `user_name` and `user_email` are **nullable** (`TEXT`)
- ❌ **UNIQUE constraint**: `(pulse_item_id, user_id)` - **BLOCKER**
- ❌ **RLS Policy**: Requires `authenticated` role for INSERT

#### `pulse_feedback_responses` table (Feedback)
- ✅ `user_id` is **nullable** (`UUID REFERENCES auth.users(id)`)
- ❌ **UNIQUE constraint**: `(event_id, question_id, user_id)` - **BLOCKER**
- ❌ **RLS Policy**: Requires `authenticated` role and `auth.uid() = user_id`

### 2. UNIQUE Constraint Issue

**Problem**: In PostgreSQL, NULL values in UNIQUE constraints are treated as distinct. This means:
- Multiple rows with `user_id = NULL` are **allowed** (not prevented)
- Cannot enforce "one anonymous response per item" using standard UNIQUE constraint
- Current constraint `UNIQUE(pulse_item_id, user_id)` allows unlimited anonymous responses per item

**Example**:
```sql
-- These would all be allowed:
INSERT INTO pulse_responses (pulse_item_id, user_id, ...) VALUES ('item-1', NULL, ...);
INSERT INTO pulse_responses (pulse_item_id, user_id, ...) VALUES ('item-1', NULL, ...);
INSERT INTO pulse_responses (pulse_item_id, user_id, ...) VALUES ('item-1', NULL, ...);
```

### 3. API Logic Blockers

**Current behavior** (PulseDetailPage.tsx:358-460):
- ❌ **Always requires authentication** (line 362-366)
- ❌ **Always stores user_id** (lines 427, 454)
- ❌ **Always stores user_name and user_email** (lines 455-456)
- ✅ `is_anonymous` flag is stored but ignored

---

## Required Changes

### Option A: Allow Unlimited Anonymous Responses (Simplest)

If you want to allow multiple anonymous responses per item (no duplicate prevention):

#### 1. Database Schema Changes

**Migration for `pulse_responses`:**
```sql
-- Remove the UNIQUE constraint that includes user_id
ALTER TABLE pulse_responses DROP CONSTRAINT IF EXISTS pulse_responses_pulse_item_id_user_id_key;

-- Create partial unique index for authenticated users only
CREATE UNIQUE INDEX idx_pulse_responses_unique_authenticated 
ON pulse_responses(pulse_item_id, user_id) 
WHERE user_id IS NOT NULL;

-- This allows:
-- - One response per authenticated user per item
-- - Unlimited anonymous responses per item
```

**Migration for `pulse_feedback_responses`:**
```sql
-- Remove the UNIQUE constraint
ALTER TABLE pulse_feedback_responses DROP CONSTRAINT IF EXISTS pulse_feedback_responses_event_id_question_id_user_id_key;

-- Create partial unique index for authenticated users only
CREATE UNIQUE INDEX idx_pulse_feedback_responses_unique_authenticated 
ON pulse_feedback_responses(event_id, question_id, user_id) 
WHERE user_id IS NOT NULL;
```

#### 2. RLS Policy Changes

**For `pulse_responses`:**
```sql
-- Allow anonymous inserts
DROP POLICY IF EXISTS "Authenticated users can create pulse responses" ON pulse_responses;

CREATE POLICY "Anyone can create pulse responses"
    ON pulse_responses FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        -- If anonymous, user_id must be NULL
        (is_anonymous = true AND user_id IS NULL AND user_name IS NULL AND user_email IS NULL)
        OR
        -- If authenticated, user_id must match auth.uid()
        (is_anonymous = false AND auth.uid() = user_id)
    );
```

**For `pulse_feedback_responses`:**
```sql
-- Allow anonymous inserts
DROP POLICY IF EXISTS "Users can insert their own feedback responses" ON pulse_feedback_responses;

CREATE POLICY "Anyone can insert feedback responses"
    ON pulse_feedback_responses FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        -- Anonymous: user_id must be NULL
        (user_id IS NULL)
        OR
        -- Authenticated: user_id must match auth.uid()
        (auth.uid() = user_id)
    );
```

#### 3. API Code Changes

**In `PulseDetailPage.tsx` - `handleSubmitResponse` function:**

```typescript
const handleSubmitResponse = async () => {
  if (!item || !id) return;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    const isAnonymous = item.anonymous === true;
    
    // Only require auth if NOT anonymous
    if (!isAnonymous && !user) {
      alert("Please sign in to respond");
      return;
    }

    let responseData: any = {};
    // ... existing response data logic ...

    if (item.type === 'feedback') {
      // ... existing feedback logic ...
      
      for (const question of questionsToSave) {
        const questionId = question.id || question.question_id;
        const response = feedbackAnswers[questionId];
        
        if (response) {
          // For anonymous: don't check existing response, just insert
          if (isAnonymous) {
            await supabase
              .from("pulse_feedback_responses")
              .insert({
                question_id: questionId,
                event_id: id,
                user_id: null,  // Explicitly NULL for anonymous
                response: typeof response === 'string' ? response : JSON.stringify(response)
              });
          } else {
            // Existing authenticated logic...
            const { data: existingResponse } = await supabase
              .from("pulse_feedback_responses")
              .select("id")
              .eq("event_id", id)
              .eq("question_id", questionId)
              .eq("user_id", user.id)
              .single();

            if (existingResponse) {
              await supabase
                .from("pulse_feedback_responses")
                .update({
                  response: typeof response === 'string' ? response : JSON.stringify(response),
                  updated_at: new Date().toISOString()
                })
                .eq("id", existingResponse.id);
            } else {
              await supabase
                .from("pulse_feedback_responses")
                .insert({
                  question_id: questionId,
                  event_id: id,
                  user_id: user.id,
                  response: typeof response === 'string' ? response : JSON.stringify(response)
                });
            }
          }
        }
      }
      
      responseData = { feedback: feedbackAnswers };
    }

    // For pulse_responses table
    if (isAnonymous) {
      // Insert anonymous response
      await supabase
        .from("pulse_responses")
        .insert({
          pulse_item_id: id,
          user_id: null,        // NULL for anonymous
          user_name: null,       // NULL for anonymous
          user_email: null,      // NULL for anonymous
          response_data: responseData,
          is_anonymous: true
        });
    } else {
      // Existing authenticated logic...
      if (hasResponded) {
        await supabase
          .from("pulse_responses")
          .update({
            response_data: responseData,
            updated_at: new Date().toISOString()
          })
          .eq("pulse_item_id", id)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("pulse_responses")
          .insert({
            pulse_item_id: id,
            user_id: user.id,
            user_name: user.user_metadata?.full_name || user.email,
            user_email: user.email,
            response_data: responseData,
            is_anonymous: false
          });
      }
    }

    setHasResponded(true);
    setSubmitted(true);
    // ... rest of existing logic ...
  } catch (err: any) {
    console.error('Error submitting response:', err);
    alert("Failed to submit response. Please try again.");
  }
};
```

---

### Option B: Prevent Duplicate Anonymous Responses (More Complex)

If you want to prevent duplicate anonymous responses, you need session tracking:

#### Additional Schema Changes

```sql
-- Add session_id column for anonymous tracking
ALTER TABLE pulse_responses 
ADD COLUMN session_id TEXT;

ALTER TABLE pulse_feedback_responses 
ADD COLUMN session_id TEXT;

-- Create partial unique index for anonymous responses using session_id
CREATE UNIQUE INDEX idx_pulse_responses_unique_anonymous 
ON pulse_responses(pulse_item_id, session_id) 
WHERE user_id IS NULL AND session_id IS NOT NULL;

CREATE UNIQUE INDEX idx_pulse_feedback_responses_unique_anonymous 
ON pulse_feedback_responses(event_id, question_id, session_id) 
WHERE user_id IS NULL AND session_id IS NOT NULL;
```

#### API Changes

Generate and store a session ID (browser localStorage or cookie):
```typescript
// Generate or retrieve session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('pulse_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('pulse_session_id', sessionId);
  }
  return sessionId;
};

// Use in insert:
if (isAnonymous) {
  await supabase
    .from("pulse_responses")
    .insert({
      pulse_item_id: id,
      user_id: null,
      user_name: null,
      user_email: null,
      session_id: getSessionId(),  // Track anonymous sessions
      response_data: responseData,
      is_anonymous: true
    });
}
```

---

## Summary of Blockers & Solutions

| Blocker | Solution |
|---------|----------|
| UNIQUE constraint requires user_id | Use partial unique index (WHERE user_id IS NOT NULL) |
| RLS requires authenticated role | Update policies to allow `anon` role with conditions |
| API always requires auth | Conditionally check auth based on `item.anonymous` |
| API always stores user info | Conditionally set user_id/user_name/user_email to NULL |
| No duplicate prevention for anonymous | Option A: Allow unlimited, or Option B: Use session_id |

---

## Recommended Approach

**Option A (Allow Unlimited Anonymous)** is recommended because:
1. Simpler implementation
2. No client-side session tracking needed
3. True anonymity (no tracking mechanism)
4. Matches common anonymous survey behavior

**Option B (Session-based)** if you need to prevent duplicate anonymous submissions, but this reduces anonymity since sessions can be tracked.

---

## Testing Checklist

After implementation:
- [ ] Anonymous users can submit without authentication
- [ ] No user_id, user_name, or user_email stored for anonymous responses
- [ ] Authenticated users still work as before
- [ ] Multiple anonymous responses allowed per item (Option A) OR one per session (Option B)
- [ ] RLS policies allow anonymous inserts
- [ ] Partial unique indexes prevent duplicate authenticated responses


