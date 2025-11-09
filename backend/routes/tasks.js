const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

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
 * Submit answers for a task
 * @route POST /tasks/submit
 */
router.post('/submit', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { taskId, answers } = req.body;

        const studentResult = await pool.query('SELECT id FROM lms.students WHERE user_id = $1', [userId]);

        if (studentResult.rows.length === 0) return res.status(404).json({ error: 'Student not found' });

        const studentId = studentResult.rows[0].id;

        // Create submission
        const submissionResult = await pool.query(
            `INSERT INTO lms.submissions (task_id, student_id, submitted_at, submission_status, total_marks_obtained)
             VALUES ($1, $2, NOW(), 'submitted', 0) RETURNING id`,
            [taskId, studentId]
        );

        const submissionId = submissionResult.rows[0].id;

        // Insert answers
        for (const answer of answers) {
            await pool.query(
                `INSERT INTO lms.submission_answers (submission_id, question_id, answer_code, marks_awarded)
                 VALUES ($1, $2, $3, $4)`,
                [submissionId, answer.questionId, answer.code, 0]
            );
        }

        res.json({ success: true, message: 'Submission successful', submissionId });
    } catch (error) {
        console.error('❌ Submit Error:', error);
        res.status(500).json({ error: 'Failed to submit task' });
    }
});

module.exports = router;
