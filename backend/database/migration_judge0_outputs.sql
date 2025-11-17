-- Migration: Add Judge0 output and test results columns
-- Date: 2025-11-18
-- Description: Store code execution output and test case results for student submissions

-- Add columns to submission_answers table to store Judge0 results
ALTER TABLE lms.submission_answers 
ADD COLUMN IF NOT EXISTS code_output TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS execution_time DECIMAL(10, 3) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS memory_used INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS execution_status VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS test_case_passed BOOLEAN DEFAULT NULL,
ADD COLUMN IF NOT EXISTS expected_output TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS actual_output TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS error_message TEXT DEFAULT NULL;

-- Add comments for documentation
COMMENT ON COLUMN lms.submission_answers.code_output IS 'Raw output from code execution (Judge0)';
COMMENT ON COLUMN lms.submission_answers.execution_time IS 'Time taken to execute code in seconds';
COMMENT ON COLUMN lms.submission_answers.memory_used IS 'Memory used during execution in KB';
COMMENT ON COLUMN lms.submission_answers.execution_status IS 'Judge0 execution status (Accepted, Compilation Error, etc.)';
COMMENT ON COLUMN lms.submission_answers.test_case_passed IS 'Whether the output matched expected output';
COMMENT ON COLUMN lms.submission_answers.expected_output IS 'Expected output for the question';
COMMENT ON COLUMN lms.submission_answers.actual_output IS 'Actual output produced by student code';
COMMENT ON COLUMN lms.submission_answers.error_message IS 'Error message if execution failed';

-- Create index for faster queries on test results
CREATE INDEX IF NOT EXISTS idx_submission_answers_test_passed 
ON lms.submission_answers(test_case_passed);

CREATE INDEX IF NOT EXISTS idx_submission_answers_execution_status 
ON lms.submission_answers(execution_status);

-- Add starter_code column to task_questions if not exists
ALTER TABLE lms.task_questions 
ADD COLUMN IF NOT EXISTS starter_code TEXT DEFAULT NULL;

COMMENT ON COLUMN lms.task_questions.starter_code IS 'Initial code template provided to students';
