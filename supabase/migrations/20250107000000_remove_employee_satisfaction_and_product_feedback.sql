-- Migration: Remove Employee Satisfaction Survey and Product Feedback Poll
-- Description: Permanently removes the specified Pulse marketplace items and all associated data
-- Date: 2025-01-07

DO $$
DECLARE
  employee_survey_id UUID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;
  product_poll_id UUID := 'b2c3d4e5-f6a7-8901-bcde-f12345678901'::uuid;
BEGIN
  -- Delete all responses for Employee Satisfaction Survey
  DELETE FROM pulse_responses
  WHERE pulse_item_id = employee_survey_id;
  
  -- Delete all responses for Product Feedback Poll
  DELETE FROM pulse_responses
  WHERE pulse_item_id = product_poll_id;
  
  -- Delete all comments for Employee Satisfaction Survey
  DELETE FROM pulse_comments
  WHERE pulse_item_id = employee_survey_id;
  
  -- Delete all comments for Product Feedback Poll
  DELETE FROM pulse_comments
  WHERE pulse_item_id = product_poll_id;
  
  -- Delete all likes for Employee Satisfaction Survey
  DELETE FROM pulse_likes
  WHERE pulse_item_id = employee_survey_id;
  
  -- Delete all likes for Product Feedback Poll
  DELETE FROM pulse_likes
  WHERE pulse_item_id = product_poll_id;
  
  -- Delete the pulse items themselves
  DELETE FROM pulse_items
  WHERE id IN (employee_survey_id, product_poll_id);
  
  RAISE NOTICE 'Successfully removed Employee Satisfaction Survey and Product Feedback Poll from Pulse marketplace';
END $$;


