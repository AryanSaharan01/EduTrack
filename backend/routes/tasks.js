const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const judge0Service = require('../services/judge0Service');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Authentication required', message: 'No token provided' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required', message: 'Invalid token format' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Authentication required', message: 'Invalid or expired token' });
    }
};

/**
 * Get all tasks
 * @route GET /tasks
 */
router.get('/', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;

        const studentResult = await pool.query('SELECT id FROM lms.students WHERE user_id = $1', [userId]);

        if (studentResult.rows.length === 0) return res.status(404).json({ error: 'Student not found' });

        const studentId = studentResult.rows[0].id;

        const tasks = await pool.query(
            `SELECT DISTINCT t.id, t.title, t.description, t.difficulty, t.time_limit_minutes, t.deadline, t.status,
             sub.name as subject, c.name as course_name,
             CASE WHEN s.id IS NOT NULL THEN 'graded' ELSE 'published' END as status
             FROM lms.tasks t JOIN lms.courses c ON t.course_id = c.id
             JOIN lms.subjects sub ON c.subject_id = sub.id
             JOIN lms.enrollments e ON c.id = e.course_id
             LEFT JOIN lms.submissions s ON t.id = s.task_id AND s.student_id = $1
             WHERE e.student_id = $1 AND t.status = 'published'
             ORDER BY t.deadline DESC`,
            [studentId]
        );

        res.json({ success: true, tasks: tasks.rows });
    } catch (error) {
        console.error('❌ Tasks Error:', error);
        res.status(500).json({ error: 'Failed to load tasks' });
    }
});

/**
 * Get task details including questions
 * @route GET /tasks/:taskId
 */
router.get('/:taskId', verifyToken, async (req, res) => {
    try {
        const { taskId } = req.params;

        // Get task details
        const taskResult = await pool.query(
            `SELECT t.*, sub.name as subject, c.name as course_name
             FROM lms.tasks t JOIN lms.courses c ON t.course_id = c.id
             JOIN lms.subjects sub ON c.subject_id = sub.id
             WHERE t.id = $1`,
            [taskId]
        );

        if (taskResult.rows.length === 0) return res.status(404).json({ error: 'Task not found' });

        // Get questions
        const questionsResult = await pool.query(
            `SELECT * FROM lms.task_questions WHERE task_id = $1 ORDER BY question_number`,
            [taskId]
        );

        res.json({ success: true, task: taskResult.rows[0], questions: questionsResult.rows });
    } catch (error) {
        console.error('❌ Task Details Error:', error);
        res.status(500).json({ error: 'Failed to load task details' });
    }
});

/**
 * Submit answers for a task (with Judge0 execution results)
 * @route POST /tasks/submit
 */
router.post('/submit', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { taskId, answers, executionResults } = req.body;

        console.log('[SUBMIT] Received submission:', {
            userId,
            taskId,
            answersCount: answers?.length || 0,
            hasExecutionResults: !!executionResults,
            executionResultsKeys: executionResults ? Object.keys(executionResults) : []
        });

        const studentResult = await pool.query('SELECT id FROM lms.students WHERE user_id = $1', [userId]);

        if (studentResult.rows.length === 0) {
            console.error('[SUBMIT] Student not found for userId:', userId);
            return res.status(404).json({ error: 'Student not found' });
        }

        const studentId = studentResult.rows[0].id;

        // Create submission
        const submissionResult = await pool.query(
            `INSERT INTO lms.submissions (task_id, student_id, submitted_at, submission_status, total_marks_obtained)
             VALUES ($1, $2, NOW(), 'submitted', 0) RETURNING id`,
            [taskId, studentId]
        );

        const submissionId = submissionResult.rows[0].id;
        console.log('[SUBMIT] Created submission:', submissionId);

        // Insert answers with execution results
        for (const answer of answers) {
            const questionId = answer.questionId;
            const execResult = executionResults?.[questionId];
            
            console.log('[SUBMIT] Processing answer:', {
                questionId,
                hasExecutionResult: !!execResult,
                execResult: execResult ? {
                    hasOutput: !!execResult.output,
                    hasError: !!execResult.error,
                    hasTestResult: !!execResult.testResult,
                    status: execResult.status
                } : null
            });
            
            await pool.query(
                `INSERT INTO lms.submission_answers (
                    submission_id, question_id, answer_code, marks_awarded,
                    code_output, execution_time, memory_used, execution_status,
                    test_case_passed, expected_output, actual_output, error_message
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [
                    submissionId, 
                    questionId, 
                    answer.code, 
                    0, // marks_awarded (will be graded by teacher)
                    execResult?.output || null,
                    execResult?.time || null,
                    execResult?.memory || null,
                    execResult?.status || null,
                    execResult?.testResult?.passed ?? null,
                    execResult?.testResult?.expectedOutput || null,
                    execResult?.testResult?.actualOutput || null,
                    execResult?.error || null
                ]
            );
            
            console.log('[SUBMIT] Stored answer for question:', questionId);
        }

        console.log('[SUBMIT] Submission completed successfully:', submissionId);
        res.json({ success: true, message: 'Submission successful', submissionId });
    } catch (error) {
        console.error('❌ Submit Error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Failed to submit task', message: error.message });
    }
});

/**
 * Run code using Judge0 API (also tests if expected output exists)
 * @route POST /tasks/run-code
 */
router.post('/run-code', verifyToken, async (req, res) => {
    try {
        const { code, language, stdin, questionId, expectedOutput } = req.body;

        console.log('[JUDGE0] Run Code Request:', {
            language,
            codeLength: code?.length || 0,
            hasStdin: !!stdin,
            hasExpectedOutput: !!expectedOutput
        });

        if (!code || !language) {
            console.error('[JUDGE0] Missing required fields');
            return res.status(400).json({ 
                success: false,
                error: 'Missing required fields',
                message: 'Code and language are required',
                result: {
                    success: false,
                    error: 'Code and language are required',
                    output: 'Error: Code and language are required'
                }
            });
        }

        // Execute code using Judge0
        let result;
        let testResult = null;

        if (expectedOutput && expectedOutput.trim()) {
            // Run AND test in one submission (saves API calls)
            console.log('[JUDGE0] Running with test (expected output provided)');
            result = await judge0Service.testCode(code, language, expectedOutput, stdin || '');
            testResult = {
                passed: result.passed,
                expectedOutput: result.expectedOutput,
                actualOutput: result.actualOutput,
                message: result.message
            };
        } else {
            // Just run the code
            console.log('[JUDGE0] Running without test (no expected output)');
            result = await judge0Service.executeCode(code, language, stdin || '');
        }

        console.log('[JUDGE0] Execution completed:', {
            success: result.success,
            status: result.status,
            time: result.time,
            memory: result.memory,
            hasOutput: !!result.output,
            hasError: !!result.error,
            testPassed: testResult?.passed
        });

        // Send response with consistent format
        res.json({
            success: true,
            result: {
                success: result.success,
                output: result.output || '',
                error: result.error || null,
                status: result.status || 'Unknown',
                time: result.time || null,
                memory: result.memory || null,
                statusId: result.statusId || null,
                testResult: testResult
            }
        });
    } catch (error) {
        console.error('❌ Run Code Error:', error);
        console.error('Error stack:', error.stack);
        
        res.status(500).json({ 
            success: false,
            error: 'Failed to run code',
            message: error.message,
            result: {
                success: false,
                error: error.message,
                output: `Error: ${error.message}`,
                status: 'Error',
                testResult: null
            }
        });
    }
});

/**
 * Test code against expected output using Judge0 API
 * @route POST /tasks/test-code
 */
router.post('/test-code', verifyToken, async (req, res) => {
    try {
        const { code, language, expectedOutput, stdin } = req.body;

        if (!code || !language || !expectedOutput) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                message: 'Code, language, and expectedOutput are required' 
            });
        }

        console.log('[JUDGE0] Testing code:', { language, codeLength: code.length });

        // Test code using Judge0
        const result = await judge0Service.testCode(code, language, expectedOutput, stdin || '');

        console.log('[JUDGE0] Test result:', {
            success: result.success,
            passed: result.passed,
            status: result.status
        });

        res.json({
            success: true,
            result
        });
    } catch (error) {
        console.error('❌ Test Code Error:', error);
        res.status(500).json({ 
            error: 'Failed to test code',
            message: error.message,
            result: {
                success: false,
                passed: false,
                error: error.message,
                output: error.message
            }
        });
    }
});

/**
 * Get supported programming languages
 * @route GET /tasks/languages
 */
router.get('/languages', verifyToken, async (req, res) => {
    try {
        const languages = judge0Service.getSupportedLanguages();
        res.json({ 
            success: true, 
            languages,
            count: languages.length
        });
    } catch (error) {
        console.error('❌ Languages Error:', error);
        res.status(500).json({ error: 'Failed to get languages' });
    }
});

/**
 * Validate Judge0 API connection
 * @route GET /tasks/judge0-status
 */
router.get('/judge0-status', verifyToken, async (req, res) => {
    try {
        const status = await judge0Service.validateConnection();
        res.json(status);
    } catch (error) {
        console.error('❌ Judge0 Status Error:', error);
        res.status(500).json({ 
            valid: false,
            message: 'Failed to check Judge0 status',
            error: error.message
        });
    }
});

module.exports = router;