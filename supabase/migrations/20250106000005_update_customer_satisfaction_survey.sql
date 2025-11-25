-- Migration: Update Customer Satisfaction Survey to DWS Feedback Survey
-- Description: Updates the Customer Satisfaction Survey with new title, description, and questions
-- Date: 2025-01-06

DO $$
DECLARE
  survey_event_id UUID := 'd4e5f6a7-b8c9-0123-def0-234567890123'::uuid;
  question_order INTEGER := 0;
BEGIN
  -- 1. Update the pulse_items record
  UPDATE pulse_items
  SET 
    title = 'DWS Feedback: Share Your Experience',
    description = 'Help us improve DWS! Share your thoughts on its usability, performance, and integration. Your feedback will guide future updates and enhance your experience.',
    type = 'feedback',  -- Change from 'survey' to 'feedback' to use pulse_feedback_questions table
    questions = NULL,  -- Remove questions from JSONB field since we're using pulse_feedback_questions table
    feedback_type = 'general',
    updated_at = NOW()
  WHERE id = survey_event_id;

  -- 2. Delete any existing questions for this survey
  DELETE FROM pulse_feedback_questions
  WHERE event_id = survey_event_id;

  -- 3. Insert new questions organized by category
  
  -- General Experience
  INSERT INTO pulse_feedback_questions (category, question, event_id, question_type, scale_min, scale_max, display_order) VALUES
  ('General Experience', 'How easy was it for you to get started with DWS?', survey_event_id, 'text', NULL, NULL, question_order + 1),
  ('General Experience', 'How would you rate your overall experience with DWS so far?', survey_event_id, 'scale', 1, 5, question_order + 2),
  ('General Experience', 'What features of DWS did you find most useful?', survey_event_id, 'text', NULL, NULL, question_order + 3),
  ('General Experience', 'Were there any parts of the product that you found difficult to use? If so, which ones?', survey_event_id, 'text', NULL, NULL, question_order + 4);

  question_order := question_order + 4;

  -- Usability & Functionality
  INSERT INTO pulse_feedback_questions (category, question, event_id, question_type, scale_min, scale_max, display_order) VALUES
  ('Usability & Functionality', 'Do you feel the product''s interface is intuitive and user-friendly?', survey_event_id, 'scale', 1, 5, question_order + 1),
  ('Usability & Functionality', 'Did you encounter any technical issues while using the product?', survey_event_id, 'text', NULL, NULL, question_order + 2),
  ('Usability & Functionality', 'How well does DWS integrate with your existing tools and systems?', survey_event_id, 'scale', 1, 5, question_order + 3);

  question_order := question_order + 3;

  -- Performance & Efficiency
  INSERT INTO pulse_feedback_questions (category, question, event_id, question_type, scale_min, scale_max, display_order) VALUES
  ('Performance & Efficiency', 'Has DWS improved your work efficiency or productivity? If yes, in what ways?', survey_event_id, 'text', NULL, NULL, question_order + 1),
  ('Performance & Efficiency', 'How would you rate the speed and reliability of the system?', survey_event_id, 'scale', 1, 5, question_order + 2),
  ('Performance & Efficiency', 'Do you believe DWS has reduced time spent on manual tasks or operational overhead?', survey_event_id, 'scale', 1, 5, question_order + 3);

  question_order := question_order + 3;

  -- Collaboration & Communication
  INSERT INTO pulse_feedback_questions (category, question, event_id, question_type, scale_min, scale_max, display_order) VALUES
  ('Collaboration & Communication', 'Has DWS improved collaboration with your team or other departments?', survey_event_id, 'scale', 1, 5, question_order + 1),
  ('Collaboration & Communication', 'How well does DWS support your communication needs within your workflow?', survey_event_id, 'scale', 1, 5, question_order + 2);

  question_order := question_order + 2;

  -- Support & Documentation
  INSERT INTO pulse_feedback_questions (category, question, event_id, question_type, scale_min, scale_max, display_order) VALUES
  ('Support & Documentation', 'How helpful did you find the onboarding materials or documentation for DWS?', survey_event_id, 'scale', 1, 5, question_order + 1),
  ('Support & Documentation', 'Have you required any support for using DWS? If yes, how would you rate the support you received?', survey_event_id, 'text', NULL, NULL, question_order + 2);

  question_order := question_order + 2;

  -- Open-ended Questions
  INSERT INTO pulse_feedback_questions (category, question, event_id, question_type, scale_min, scale_max, display_order) VALUES
  ('Open-ended Questions', 'What improvements or changes would you like to see in DWS in the future?', survey_event_id, 'text', NULL, NULL, question_order + 1),
  ('Open-ended Questions', 'Any additional comments or feedback about your experience with DWS?', survey_event_id, 'text', NULL, NULL, question_order + 2);

  RAISE NOTICE 'Successfully updated Customer Satisfaction Survey to DWS Feedback Survey with % questions', question_order + 2;
END $$;


