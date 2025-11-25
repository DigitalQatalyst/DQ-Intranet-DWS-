# Pulse Responses - Quick Reference Guide

## How to Differentiate Responses by Type

### ✅ **Simple Method: Use the Type-Specific Views**

After running migration `20250106000006_create_type_specific_response_views.sql`, you can use these views:

```sql
-- Get all poll responses
SELECT * FROM poll_responses;

-- Get all survey responses  
SELECT * FROM survey_responses;

-- Get feedback responses (summary from pulse_responses)
SELECT * FROM feedback_responses_summary;

-- Get detailed feedback responses (from pulse_feedback_responses with question details)
SELECT * FROM feedback_responses_detailed;

-- Get statistics by type
SELECT * FROM response_statistics_by_type;
```

### ✅ **Alternative: JOIN with pulse_items**

```sql
-- Filter by type using JOIN
SELECT pr.*, pi.type, pi.title
FROM pulse_responses pr
JOIN pulse_items pi ON pr.pulse_item_id = pi.id
WHERE pi.type = 'poll';  -- or 'survey' or 'feedback'
```

## Anonymous Response Handling

All methods work with anonymous responses because:

- ✅ Uses `session_id` instead of `user_id` for tracking
- ✅ `user_id`, `user_name`, `user_email` are NULL for anonymous responses
- ✅ Unique constraints use `(pulse_item_id, session_id)` not `(pulse_item_id, user_id)`

### Example: Query Anonymous Responses

```sql
-- Get anonymous poll responses
SELECT * FROM poll_responses
WHERE user_id IS NULL 
  AND session_id IS NOT NULL;
```

## Response Data Structure

### Poll Responses
```json
{
  "selected_options": ["option_id_1", "option_id_2"]
}
```

### Survey Responses
```json
{
  "answers": {
    "q1": "answer1",
    "q2": "answer2"
  }
}
```

### Feedback Responses (in pulse_responses)
```json
{
  "feedback": {
    "question_id": "answer"
  }
}
```

### Feedback Responses (in pulse_feedback_responses)
- Stored per question in separate rows
- Each row has: `question_id`, `response`, `event_id`, `session_id`

## Common Queries

### Count responses by type
```sql
SELECT type, COUNT(*) as count
FROM response_statistics_by_type
GROUP BY type;
```

### Get responses for a specific pulse item
```sql
-- For polls/surveys
SELECT * FROM pulse_responses
WHERE pulse_item_id = 'your-item-id';

-- For feedback (detailed)
SELECT * FROM feedback_responses_detailed
WHERE pulse_item_id = 'your-item-id';
```

### Get unique sessions (anonymous users) per type
```sql
SELECT 
    pi.type,
    COUNT(DISTINCT pr.session_id) as unique_anonymous_sessions
FROM pulse_items pi
LEFT JOIN pulse_responses pr ON pi.id = pr.pulse_item_id
WHERE pr.user_id IS NULL
GROUP BY pi.type;
```


