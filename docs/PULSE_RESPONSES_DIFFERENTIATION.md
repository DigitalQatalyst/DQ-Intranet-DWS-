# Differentiating Pulse Responses by Type (Poll, Survey, Feedback)

## Current Database Structure

The Pulse marketplace uses **two response tables**:

1. **`pulse_responses`** - General responses for polls, surveys, and feedback
   - `pulse_item_id` → Links to `pulse_items.id`
   - `session_id` → For anonymous duplicate prevention
   - `response_data` (JSONB) → Varies by type

2. **`pulse_feedback_responses`** - Individual question responses for feedback items
   - `event_id` → Links to `pulse_items.id`
   - `question_id` → Links to `pulse_feedback_questions.id`
   - `session_id` → For anonymous duplicate prevention

3. **`pulse_items`** - Main table with type information
   - `type` → 'poll', 'survey', or 'feedback'
   - `id` → Primary key

## Best Approaches to Differentiate Responses

### ✅ **Approach 1: JOIN with pulse_items.type (Recommended)**

**Best for:** Most queries, reporting, analytics

Join responses with `pulse_items` to filter by type:

```sql
-- Get all poll responses
SELECT pr.*, pi.title, pi.type
FROM pulse_responses pr
JOIN pulse_items pi ON pr.pulse_item_id = pi.id
WHERE pi.type = 'poll';

-- Get all survey responses
SELECT pr.*, pi.title, pi.type
FROM pulse_responses pr
JOIN pulse_items pi ON pr.pulse_item_id = pi.id
WHERE pi.type = 'survey';

-- Get all feedback responses
SELECT pr.*, pi.title, pi.type
FROM pulse_responses pr
JOIN pulse_items pi ON pr.pulse_item_id = pi.id
WHERE pi.type = 'feedback';
```

**Advantages:**
- ✅ Simple and straightforward
- ✅ Works with anonymous responses (uses session_id)
- ✅ No schema changes needed
- ✅ Efficient with proper indexes
- ✅ Can filter by multiple criteria (type, department, date, etc.)

**Performance:** Add composite index for better performance:
```sql
CREATE INDEX idx_pulse_items_type_id ON pulse_items(type, id);
```

---

### ✅ **Approach 2: Create Type-Specific Views**

**Best for:** Simplified queries, consistent access patterns

Create views that automatically filter by type:

```sql
-- View for poll responses
CREATE OR REPLACE VIEW poll_responses AS
SELECT 
    pr.*,
    pi.title as poll_title,
    pi.question as poll_question,
    pi.options as poll_options
FROM pulse_responses pr
JOIN pulse_items pi ON pr.pulse_item_id = pi.id
WHERE pi.type = 'poll';

-- View for survey responses
CREATE OR REPLACE VIEW survey_responses AS
SELECT 
    pr.*,
    pi.title as survey_title,
    pi.questions as survey_questions
FROM pulse_responses pr
JOIN pulse_items pi ON pr.pulse_item_id = pi.id
WHERE pi.type = 'survey';

-- View for feedback responses (uses pulse_feedback_responses)
CREATE OR REPLACE VIEW feedback_responses AS
SELECT 
    pfr.*,
    pi.title as feedback_title,
    pfq.category,
    pfq.question as question_text,
    pfq.question_type
FROM pulse_feedback_responses pfr
JOIN pulse_items pi ON pfr.event_id = pi.id
JOIN pulse_feedback_questions pfq ON pfr.question_id = pfq.id
WHERE pi.type = 'feedback';

-- Grant permissions
GRANT SELECT ON poll_responses TO authenticated, anon;
GRANT SELECT ON survey_responses TO authenticated, anon;
GRANT SELECT ON feedback_responses TO authenticated, anon;
```

**Usage:**
```sql
-- Simple queries
SELECT * FROM poll_responses;
SELECT * FROM survey_responses;
SELECT * FROM feedback_responses;
```

**Advantages:**
- ✅ Clean, simple queries
- ✅ Abstracts complexity
- ✅ Easy to maintain
- ✅ Works with anonymous responses

---

### ✅ **Approach 3: Use response_data Structure**

**Best for:** Programmatic access, type detection without JOIN

The `response_data` JSONB structure differs by type:

```sql
-- Poll responses
-- response_data: {"selected_options": ["option_id_1", "option_id_2"]}

-- Survey responses  
-- response_data: {"answers": {"q1": "answer1", "q2": "answer2"}}

-- Feedback responses (in pulse_responses)
-- response_data: {"feedback": {"question_id": "answer"}}
```

**Query examples:**
```sql
-- Detect poll responses
SELECT * FROM pulse_responses
WHERE response_data ? 'selected_options';

-- Detect survey responses
SELECT * FROM pulse_responses
WHERE response_data ? 'answers';

-- Detect feedback responses (in pulse_responses)
SELECT * FROM pulse_responses
WHERE response_data ? 'feedback';
```

**Advantages:**
- ✅ No JOIN needed
- ✅ Fast for type detection
- ✅ Works with anonymous responses

**Disadvantages:**
- ⚠️ Less reliable (structure could change)
- ⚠️ Doesn't work for feedback items using `pulse_feedback_responses`

---

### ✅ **Approach 4: Add Computed Column (Materialized)**

**Best for:** High-performance queries, frequent type filtering

Add a computed column that stores the type directly in the response table:

```sql
-- Add type column to pulse_responses
ALTER TABLE pulse_responses
ADD COLUMN item_type TEXT;

-- Populate existing data
UPDATE pulse_responses pr
SET item_type = pi.type
FROM pulse_items pi
WHERE pr.pulse_item_id = pi.id;

-- Create trigger to auto-update
CREATE OR REPLACE FUNCTION set_pulse_response_type()
RETURNS TRIGGER AS $$
BEGIN
    SELECT type INTO NEW.item_type
    FROM pulse_items
    WHERE id = NEW.pulse_item_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_pulse_response_type
    BEFORE INSERT ON pulse_responses
    FOR EACH ROW
    EXECUTE FUNCTION set_pulse_response_type();

-- Create index
CREATE INDEX idx_pulse_responses_item_type ON pulse_responses(item_type);
```

**Usage:**
```sql
-- Direct filtering without JOIN
SELECT * FROM pulse_responses WHERE item_type = 'poll';
SELECT * FROM pulse_responses WHERE item_type = 'survey';
SELECT * FROM pulse_responses WHERE item_type = 'feedback';
```

**Advantages:**
- ✅ Fastest queries (no JOIN needed)
- ✅ Simple filtering
- ✅ Works with anonymous responses

**Disadvantages:**
- ⚠️ Requires schema change
- ⚠️ Data redundancy (type stored in two places)
- ⚠️ Need to maintain consistency

---

## Recommended Implementation Strategy

### **For Most Use Cases: Use Approach 1 (JOIN) + Approach 2 (Views)**

1. **Create the views** (Approach 2) for simplified access
2. **Use JOIN queries** (Approach 1) for complex filtering/reporting
3. **Add indexes** for performance:

```sql
-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_pulse_items_type_id 
ON pulse_items(type, id);

CREATE INDEX IF NOT EXISTS idx_pulse_responses_item_id_type 
ON pulse_responses(pulse_item_id) 
INCLUDE (session_id, created_at);
```

### **For High-Performance Needs: Add Approach 4 (Computed Column)**

If you frequently filter by type and need maximum performance, add the computed column.

---

## Anonymous Response Handling

All approaches work with anonymous responses because:

1. **Session-based tracking**: Uses `session_id` instead of `user_id`
2. **No user identification**: `user_id`, `user_name`, `user_email` are NULL
3. **Unique constraints**: Based on `(pulse_item_id, session_id)` not `(pulse_item_id, user_id)`

**Example anonymous response query:**
```sql
-- Get anonymous poll responses
SELECT pr.*, pi.title, pi.type
FROM pulse_responses pr
JOIN pulse_items pi ON pr.pulse_item_id = pi.id
WHERE pi.type = 'poll'
  AND pr.user_id IS NULL  -- Anonymous responses
  AND pr.session_id IS NOT NULL;  -- Has session tracking
```

---

## Complete Example: Type-Specific Response Queries

```sql
-- 1. Get all poll responses with poll details
SELECT 
    pr.id,
    pr.session_id,
    pr.response_data->>'selected_options' as selected_options,
    pr.created_at,
    pi.title as poll_title,
    pi.question as poll_question
FROM pulse_responses pr
JOIN pulse_items pi ON pr.pulse_item_id = pi.id
WHERE pi.type = 'poll'
ORDER BY pr.created_at DESC;

-- 2. Get all survey responses with survey details
SELECT 
    pr.id,
    pr.session_id,
    pr.response_data->'answers' as answers,
    pr.created_at,
    pi.title as survey_title,
    pi.questions as survey_questions
FROM pulse_responses pr
JOIN pulse_items pi ON pr.pulse_item_id = pi.id
WHERE pi.type = 'survey'
ORDER BY pr.created_at DESC;

-- 3. Get all feedback responses (from pulse_feedback_responses)
SELECT 
    pfr.id,
    pfr.session_id,
    pfr.response,
    pfr.created_at,
    pi.title as feedback_title,
    pfq.category,
    pfq.question as question_text
FROM pulse_feedback_responses pfr
JOIN pulse_items pi ON pfr.event_id = pi.id
JOIN pulse_feedback_questions pfq ON pfr.question_id = pfq.id
WHERE pi.type = 'feedback'
ORDER BY pfr.created_at DESC;

-- 4. Count responses by type
SELECT 
    pi.type,
    COUNT(DISTINCT pr.id) as response_count,
    COUNT(DISTINCT pr.session_id) as unique_sessions
FROM pulse_items pi
LEFT JOIN pulse_responses pr ON pi.id = pr.pulse_item_id
GROUP BY pi.type;
```

---

## Summary

| Approach | Performance | Complexity | Recommended For |
|----------|-------------|------------|-----------------|
| **1. JOIN with type** | ⭐⭐⭐⭐ | Low | Most queries, reporting |
| **2. Type-specific views** | ⭐⭐⭐⭐ | Low | Simplified access, consistent patterns |
| **3. response_data structure** | ⭐⭐⭐⭐⭐ | Low | Quick type detection |
| **4. Computed column** | ⭐⭐⭐⭐⭐ | Medium | High-performance needs |

**Best Practice:** Start with **Approach 1 + 2** (JOIN + Views), then add **Approach 4** (computed column) if performance becomes an issue.


