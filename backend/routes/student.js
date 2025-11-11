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

router.get('/dashboard', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const studentResult = await pool.query(
            `SELECT s.*, u.email FROM lms.students s JOIN lms.users u ON s.user_id = u.id WHERE s.user_id = $1`,
            [userId]
        );
        if (studentResult.rows.length === 0) return res.status(404).json({ error: 'Student profile not found' });
        const student = studentResult.rows[0];

        const subjectsResult = await pool.query(
            `SELECT DISTINCT sub.id, sub.name, sub.code, sub.description, t.name as teacher_name
             FROM lms.enrollments e
             JOIN lms.courses c ON e.course_id = c.id
             JOIN lms.subjects sub ON c.subject_id = sub.id
             LEFT JOIN lms.teachers t ON sub.teacher_id = t.id
             WHERE e.student_id = $1 ORDER BY sub.name`,
            [student.id]
        );

        const upcomingTasksResult = await pool.query(
            `SELECT DISTINCT t.id, t.title, t.description, t.difficulty, t.deadline, sub.name as subject
             FROM lms.tasks t
             JOIN lms.courses c ON t.course_id = c.id
             JOIN lms.subjects sub ON c.subject_id = sub.id
             JOIN lms.enrollments e ON c.id = e.course_id
             LEFT JOIN lms.submissions s ON t.id = s.task_id AND s.student_id = $1
             WHERE e.student_id = $1 AND t.status = 'published' AND t.deadline > NOW() AND s.id IS NULL
             ORDER BY t.deadline ASC LIMIT 5`,
            [student.id]
        );

        const notificationsResult = await pool.query(
            `SELECT n.id, n.message, n.sent_at as timestamp, COALESCE(snr.is_read, false) as is_read
             FROM lms.notifications n
             LEFT JOIN lms.student_notification_read snr ON n.id = snr.notification_id AND snr.student_id = $1
             ORDER BY n.sent_at DESC LIMIT 10`,
            [student.id]
        );

        const statsResult = await pool.query(
            `SELECT COUNT(DISTINCT t.id) as total_tasks, COUNT(DISTINCT sub.id) as submitted_tasks,
             COALESCE(AVG(sub.total_marks_obtained), 0) as avg_marks
             FROM lms.tasks t
             JOIN lms.courses c ON t.course_id = c.id
             JOIN lms.enrollments e ON c.id = e.course_id
             LEFT JOIN lms.submissions sub ON t.id = sub.task_id AND sub.student_id = $1
             WHERE e.student_id = $1 AND t.status = 'published'`,
            [student.id]
        );
        
        // Handle stats with default values
        const stats = statsResult.rows[0] || { total_tasks: 0, submitted_tasks: 0, avg_marks: 0 };

        // Determine if student is enrolled anywhere
        const enrolledCheck = await pool.query(
            `SELECT 1 FROM lms.enrollments e WHERE e.student_id = $1 LIMIT 1`, 
            [student.id]
        );
        const enrolled = enrolledCheck.rows.length > 0;

        res.json({
            success: true,
            data: {
                student: {
                    id: student.id, 
                    name: student.name, 
                    email: student.email,
                    roll_no: student.roll_no, 
                    course: student.course, 
                    section: student.section,
                },
                subjects: subjectsResult.rows,
                upcomingTasks: upcomingTasksResult.rows,
                notifications: notificationsResult.rows,
                rank: null,
                streak: 0,
                enrolled,
                stats: {
                    totalTasks: parseInt(stats.total_tasks) || 0,
                    submittedTasks: parseInt(stats.submitted_tasks) || 0,
                    averageMarks: Number(parseFloat(stats.avg_marks || 0).toFixed(2)) || 0
                }
            }
        });
    } catch (error) {
        console.error('❌ Dashboard Error:', error);
        res.status(500).json({ error: 'Failed to load dashboard data' });
    }
});

router.get('/subjects', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const studentResult = await pool.query('SELECT id FROM lms.students WHERE user_id = $1', [userId]);
        if (studentResult.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
        const studentId = studentResult.rows[0].id;
        const subjects = await pool.query(
            `SELECT DISTINCT sub.id, sub.name, sub.code, sub.description, t.name as teacher_name, t.employee_id
             FROM lms.enrollments e JOIN lms.courses c ON e.course_id = c.id
             JOIN lms.subjects sub ON c.subject_id = sub.id
             LEFT JOIN lms.teachers t ON sub.teacher_id = t.id
             WHERE e.student_id = $1 ORDER BY sub.name`,
            [studentId]
        );
        res.json({ success: true, subjects: subjects.rows });
    } catch (error) {
        console.error('❌ Subjects Error:', error);
        res.status(500).json({ error: 'Failed to load subjects' });
    }
});

router.get('/subjects/:subjectId', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { subjectId } = req.params;
        const studentResult = await pool.query('SELECT id FROM lms.students WHERE user_id = $1', [userId]);
        if (studentResult.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
        const studentId = studentResult.rows[0].id;
        const subjectResult = await pool.query(
            `SELECT sub.id, sub.name, sub.code, sub.description, t.name as teacher_name
             FROM lms.subjects sub LEFT JOIN lms.teachers t ON sub.teacher_id = t.id WHERE sub.id = $1`,
            [subjectId]
        );
        if (subjectResult.rows.length === 0) return res.status(404).json({ error: 'Subject not found' });
        const tasksResult = await pool.query(
            `SELECT DISTINCT t.id, t.title, t.description, t.difficulty, t.deadline, t.status,
             CASE WHEN sub.id IS NOT NULL THEN true ELSE false END as is_submitted
             FROM lms.tasks t JOIN lms.courses c ON t.course_id = c.id
             JOIN lms.enrollments e ON c.id = e.course_id
             LEFT JOIN lms.submissions sub ON t.id = sub.task_id AND sub.student_id = $1
             WHERE e.student_id = $1 AND c.subject_id = $2 AND t.status = 'published'
             ORDER BY t.deadline DESC`,
            [studentId, subjectId]
        );
        res.json({ success: true, subject: subjectResult.rows[0], tasks: tasksResult.rows });
    } catch (error) {
        console.error('❌ Subject Details Error:', error);
        res.status(500).json({ error: 'Failed to load subject details' });
    }
});

router.get('/profile', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const result = await pool.query(
            `SELECT s.*, u.email FROM lms.students s JOIN lms.users u ON s.user_id = u.id WHERE s.user_id = $1`,
            [userId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
        res.json({ success: true, student: result.rows[0] });
    } catch (error) {
        console.error('❌ Profile Error:', error);
        res.status(500).json({ error: 'Failed to load profile' });
    }
});

router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { name, phone } = req.body;
        const result = await pool.query(
            `UPDATE lms.students SET name = $1, phone = $2, updated_at = NOW() WHERE user_id = $3 RETURNING *`,
            [name, phone, userId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
        res.json({ success: true, student: result.rows[0] });
    } catch (error) {
        console.error('❌ Update Profile Error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

router.get('/notifications', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const studentResult = await pool.query('SELECT id FROM lms.students WHERE user_id = $1', [userId]);
        if (studentResult.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
        const studentId = studentResult.rows[0].id;
        const notifications = await pool.query(
            `SELECT n.id, n.message, n.sent_at, COALESCE(snr.is_read, false) as is_read
             FROM lms.notifications n
             LEFT JOIN lms.student_notification_read snr ON n.id = snr.notification_id AND snr.student_id = $1
             ORDER BY n.sent_at DESC`,
            [studentId]
        );
        res.json({ success: true, notifications: notifications.rows });
    } catch (error) {
        console.error('❌ Notifications Error:', error);
        res.status(500).json({ error: 'Failed to load notifications' });
    }
});

router.get('/analytics', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const studentResult = await pool.query('SELECT id FROM lms.students WHERE user_id = $1', [userId]);
        if (studentResult.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
        const studentId = studentResult.rows[0].id;
        const statsResult = await pool.query(
            `SELECT COUNT(sub.id) as tasks_completed, COALESCE(SUM(sub.total_marks_obtained), 0) as total_marks,
             COALESCE(AVG(sub.total_marks_obtained), 0) as avg_marks
             FROM lms.submissions sub WHERE sub.student_id = $1`,
            [studentId]
        );
        const stats = statsResult.rows[0];
        const markTrendResult = await pool.query(
            `SELECT TO_CHAR(sub.submitted_at, 'MM/DD') as date, sub.total_marks_obtained as marks
             FROM lms.submissions sub WHERE sub.student_id = $1 ORDER BY sub.submitted_at DESC LIMIT 10`,
            [studentId]
        );
        const subjectDistResult = await pool.query(
            `SELECT s.name as subject, COUNT(sub.id) as value
             FROM lms.submissions sub JOIN lms.tasks t ON sub.task_id = t.id
             JOIN lms.courses c ON t.course_id = c.id JOIN lms.subjects s ON c.subject_id = s.id
             WHERE sub.student_id = $1 GROUP BY s.name`,
            [studentId]
        );
        const perfPerSubjectResult = await pool.query(
            `SELECT s.name as subject, COALESCE(AVG(sub.total_marks_obtained), 0) as marks
             FROM lms.subjects s
             LEFT JOIN lms.courses c ON s.id = c.subject_id
             LEFT JOIN lms.tasks t ON c.id = t.course_id
             LEFT JOIN lms.submissions sub ON t.id = sub.task_id AND sub.student_id = $1
             GROUP BY s.name ORDER BY marks DESC`,
            [studentId]
        );
        res.json({
            success: true,
            data: {
                totalMarks: parseInt(stats.total_marks) || 0,
                accuracyPercent: Number(parseFloat(stats.avg_marks || 0).toFixed(2)) || 0,
                tasksCompleted: parseInt(stats.tasks_completed) || 0,
                markTrend: markTrendResult.rows.reverse(),
                subjectDistribution: subjectDistResult.rows,
                performancePerSubject: perfPerSubjectResult.rows
            }
        });
    } catch (error) {
        console.error('❌ Analytics Error:', error);
        res.status(500).json({ error: 'Failed to load analytics' });
    }
});

router.get("/tasks", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const studentResult = await pool.query('SELECT id FROM lms.students WHERE user_id = $1', [userId]);
    if (studentResult.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    const studentId = studentResult.rows[0].id;

    // Get all tasks for subjects the student is enrolled in
    const tasksResult = await pool.query(
      `SELECT DISTINCT t.id, t.title, t.description, t.difficulty, t.deadline, t.time_limit, t.status,
       sub.id as subject_id, sub.name as subject_name, sub.code as subject_code,
       (SELECT COUNT(*) FROM lms.questions WHERE task_id = t.id) as question_count,
       CASE WHEN s.id IS NOT NULL THEN true ELSE false END as is_submitted
       FROM lms.tasks t
       JOIN lms.courses c ON t.course_id = c.id
       JOIN lms.subjects sub ON c.subject_id = sub.id
       JOIN lms.enrollments e ON c.id = e.course_id
       LEFT JOIN lms.submissions s ON t.id = s.task_id AND s.student_id = $1
       WHERE e.student_id = $1 AND t.status = 'published'
       ORDER BY t.deadline DESC`,
      [studentId]
    );

    const tasks = tasksResult.rows.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      difficulty: task.difficulty,
      deadline: task.deadline,
      timeLimit: task.time_limit,
      status: task.status,
      questionCount: parseInt(task.question_count) || 0,
      isSubmitted: task.is_submitted,
      subject: {
        id: task.subject_id,
        name: task.subject_name,
        code: task.subject_code
      }
    }));

    res.json({ success: true, tasks });
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to load tasks" });
  }
});

module.exports = router;




