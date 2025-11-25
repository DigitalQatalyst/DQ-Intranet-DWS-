# Anonymous Responses Testing Checklist

## Pre-Deployment Testing

### Database Migrations
- [ ] Run migration `20250106000003_make_pulse_responses_anonymous.sql`
- [ ] Run migration `20250106000004_make_pulse_feedback_responses_anonymous.sql`
- [ ] Verify `session_id` column exists in both tables
- [ ] Verify UNIQUE constraints are removed
- [ ] Verify partial unique indexes are created
- [ ] Verify RLS policies allow `anon` role inserts
- [ ] Verify user fields can be NULL

### Anonymous Submission Testing

#### Polls
- [ ] **Anonymous user can submit poll response without authentication**
  - Open poll in incognito/private browser
  - Select option and submit
  - Verify no "Please sign in" error
  - Verify response is saved with `user_id = NULL`, `user_name = NULL`, `user_email = NULL`
  - Verify `session_id` is stored

- [ ] **Duplicate prevention works**
  - Submit response
  - Try to submit again in same session
  - Verify "You have already submitted" message appears
  - Verify only one response exists in database

- [ ] **Multiple sessions can submit**
  - Submit response in one browser session
  - Open in different browser/incognito
  - Verify can submit again (different session_id)
  - Verify both responses exist in database

#### Surveys
- [ ] **Anonymous user can submit survey without authentication**
  - Open survey in incognito/private browser
  - Answer all questions
  - Submit survey
  - Verify no authentication error
  - Verify response saved with all user fields NULL
  - Verify `session_id` is stored

- [ ] **Duplicate prevention works**
  - Submit survey response
  - Try to submit again in same session
  - Verify duplicate prevention message
  - Verify only one response per session

- [ ] **Survey answers are saved correctly**
  - Submit survey with various question types (text, scale)
  - Verify all answers are stored in `response_data.answers`
  - Verify answers are retrievable

#### Feedback
- [ ] **Anonymous user can submit feedback without authentication**
  - Open feedback form in incognito/private browser
  - Answer all feedback questions
  - Submit feedback
  - Verify no authentication error
  - Verify responses saved to `pulse_feedback_responses` with `user_id = NULL`
  - Verify `session_id` is stored for each question response

- [ ] **Duplicate prevention works**
  - Submit feedback response
  - Try to submit again in same session
  - Verify duplicate prevention message
  - Verify only one set of responses per session

- [ ] **Feedback questions are saved correctly**
  - Submit feedback with multiple questions
  - Verify each question response is saved separately
  - Verify responses are linked to correct `question_id` and `event_id`

### Data Integrity Testing

- [ ] **No user identification stored**
  - Submit responses as anonymous user
  - Query database directly
  - Verify `user_id`, `user_name`, `user_email` are all NULL
  - Verify `is_anonymous = true`

- [ ] **Session tracking works**
  - Submit response
  - Check `session_id` in database
  - Verify `session_id` is a valid UUID
  - Verify same `session_id` used for all responses in same submission

- [ ] **Response data structure is correct**
  - Polls: Verify `response_data.selected_options` contains selected option IDs
  - Surveys: Verify `response_data.answers` contains question-answer pairs
  - Feedback: Verify `response_data.feedback` contains feedback answers

### Existing Functionality Testing

- [ ] **Likes still work for authenticated users**
  - Sign in as authenticated user
  - Like a pulse item
  - Verify like is saved with `user_id`
  - Verify like count updates

- [ ] **Comments still work (if applicable)**
  - Sign in as authenticated user
  - Add comment
  - Verify comment is saved correctly

- [ ] **View counts still increment**
  - Open pulse item
  - Verify view count increments
  - Works for both anonymous and authenticated users

- [ ] **Results/analytics display correctly**
  - Submit multiple anonymous responses
  - View results page
  - Verify response counts are accurate
  - Verify no user identification is shown

### Edge Cases

- [ ] **Session storage cleared**
  - Submit response
  - Clear browser sessionStorage
  - Try to submit again
  - Verify can submit again (new session_id generated)

- [ ] **Multiple tabs**
  - Open same pulse item in multiple tabs
  - Submit in one tab
  - Verify other tab shows "already responded" state
  - Verify session_id is shared across tabs

- [ ] **Browser refresh**
  - Submit response
  - Refresh page
  - Verify "already responded" state persists
  - Verify session_id persists in sessionStorage

- [ ] **Network errors**
  - Submit response with network disconnected
  - Verify error handling
  - Reconnect and verify can retry submission

### Security Testing

- [ ] **RLS policies prevent unauthorized access**
  - Try to insert response with `user_id` set (should fail)
  - Try to insert response with `user_name` set (should fail)
  - Try to insert response with `user_email` set (should fail)
  - Verify only NULL values allowed for user fields

- [ ] **Anonymous responses cannot be updated**
  - Submit anonymous response
  - Try to update it (should fail due to RLS policy)
  - Verify response remains unchanged

- [ ] **No SQL injection vulnerabilities**
  - Test with special characters in responses
  - Verify data is properly escaped
  - Verify no database errors

### Performance Testing

- [ ] **Multiple concurrent submissions**
  - Open multiple browser sessions
  - Submit responses simultaneously
  - Verify all submissions succeed
  - Verify no race conditions

- [ ] **Large response data**
  - Submit survey with very long text answers
  - Verify data is stored correctly
  - Verify no performance issues

### UI/UX Testing

- [ ] **No authentication prompts shown**
  - Verify no "Please sign in" messages for anonymous users
  - Verify response forms are accessible without login
  - Verify submit buttons are enabled

- [ ] **Success messages display correctly**
  - Submit response
  - Verify success message appears
  - Verify appropriate confirmation for each type (poll/survey/feedback)

- [ ] **Already responded state**
  - Submit response
  - Verify UI shows "already responded" state
  - Verify form is disabled or shows appropriate message

- [ ] **Error messages are clear**
  - Try to submit without completing required fields
  - Verify clear error messages
  - Verify validation works correctly

## Post-Deployment Verification

- [ ] **Production database migration successful**
  - Verify migrations ran without errors
  - Verify no data loss
  - Verify existing responses still accessible

- [ ] **Monitor error logs**
  - Check for any RLS policy violations
  - Check for any constraint violations
  - Check for any authentication errors

- [ ] **User feedback**
  - Monitor user reports
  - Verify no complaints about authentication requirements
  - Verify responses are being submitted successfully

## Rollback Plan Testing

If issues arise, verify rollback procedure:
- [ ] Can restore original UNIQUE constraints
- [ ] Can restore original RLS policies
- [ ] Existing anonymous responses remain in database
- [ ] System can function with mixed anonymous/authenticated responses

---

## Test Scenarios Summary

| Scenario | Expected Result | Status |
|----------|----------------|--------|
| Anonymous poll submission | Success, no auth required | ⬜ |
| Anonymous survey submission | Success, no auth required | ⬜ |
| Anonymous feedback submission | Success, no auth required | ⬜ |
| Duplicate prevention (same session) | Blocked with message | ⬜ |
| Multiple sessions | Allowed | ⬜ |
| No user data stored | All user fields NULL | ⬜ |
| Session persistence | Works across page refreshes | ⬜ |
| Existing features intact | Likes, comments, views work | ⬜ |

---

## Notes

- All tests should be performed in both development and staging environments before production deployment
- Test with various browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices if applicable
- Document any issues found during testing


