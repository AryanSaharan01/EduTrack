const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'User not authenticated' });
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied', message: `Requires ${roles.join(' or ')} role` });
        }
        next();
    };
};

// GET /api/performance/leaderboard - Get leaderboard of students from same course and section
router.get('/leaderboard', verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    
    // Get current student's course and section
    const currentStudent = await pool.query(
      'SELECT course, section FROM lms.students WHERE user_id = $1',
      [userId]
    );
    
    if (currentStudent.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const { course, section } = currentStudent.rows[0];
    
    // Get leaderboard for students from same course and section only
    const leaderboard = await pool.query(
      `SELECT 
        s.id,
        s.name,
        s.roll_no,
        s.course,
        s.section,
        COALESCE(SUM(sub.total_marks_obtained), 0) as total_marks,
        ROUND(COALESCE(AVG(sub.total_marks_obtained), 0)) as accuracy_percentage,
        COUNT(sub.id) as tasks_completed,
        CASE 
          WHEN COALESCE(SUM(sub.total_marks_obtained), 0) >= 500 THEN 'Master'
          WHEN COALESCE(SUM(sub.total_marks_obtained), 0) >= 300 THEN 'Expert'
          WHEN COALESCE(SUM(sub.total_marks_obtained), 0) >= 100 THEN 'Intermediate'
          ELSE 'Beginner'
        END as badge
       FROM lms.students s
       LEFT JOIN lms.submissions sub ON s.id = sub.student_id AND sub.submission_status = 'graded'
       WHERE s.course = $1 AND s.section = $2
       GROUP BY s.id, s.name, s.roll_no, s.course, s.section
       ORDER BY total_marks DESC, tasks_completed DESC
       LIMIT 50`,
      [course, section]
    );

    // Add rank to each student
    const leaderboardWithRank = leaderboard.rows.map((student, index) => ({
      ...student,
      rank: index + 1,
      total_marks: parseInt(student.total_marks) || 0,
      accuracy_percentage: parseInt(student.accuracy_percentage) || 0,
      tasks_completed: parseInt(student.tasks_completed) || 0
    }));

    res.json({
      success: true,
      leaderboard: leaderboardWithRank
    });
  } catch (error) {
    console.error('❌ Leaderboard Error:', error);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
});

// GET /api/performance/student/:studentId - Individual student performance
router.get('/student/:studentId', verifyToken, async (req, res) => {
    try {
        const { studentId } = req.params;
        const rankResult = await pool.query(
            `WITH ranked_students AS (
                SELECT s.id, s.name, COALESCE(SUM(sub.total_marks_obtained), 0) as total_marks,
                ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(sub.total_marks_obtained), 0) DESC) as rank
                FROM lms.students s
                LEFT JOIN lms.submissions sub ON s.id = sub.student_id
                GROUP BY s.id, s.name
            )
            SELECT rank, total_marks FROM ranked_students WHERE id = $1`,
            [studentId]
        );
        const performanceResult = await pool.query(
            `SELECT COUNT(sub.id) as tasks_completed, COALESCE(AVG(sub.total_marks_obtained), 0) as avg_marks,
             COALESCE(SUM(sub.total_marks_obtained), 0) as total_marks
             FROM lms.submissions sub WHERE sub.student_id = $1`,
            [studentId]
        );
        const recentSubmissions = await pool.query(
            `SELECT t.title as task_title, sub.total_marks_obtained, sub.submitted_at
             FROM lms.submissions sub
             JOIN lms.tasks t ON sub.task_id = t.id
             WHERE sub.student_id = $1
             ORDER BY sub.submitted_at DESC LIMIT 10`,
            [studentId]
        );
        const rank = rankResult.rows[0] || { rank: null, total_marks: 0 };
        const performance = performanceResult.rows[0];
        res.json({
            success: true,
            data: {
                rank: rank.rank,
                totalMarks: rank.total_marks,
                tasksCompleted: parseInt(performance.tasks_completed) || 0,
                averageMarks: parseFloat(performance.avg_marks).toFixed(2),
                recentSubmissions: recentSubmissions.rows
            }
        });
    } catch (error) {
        console.error('❌ Student Performance Error:', error);
        res.status(500).json({ error: 'Failed to load performance data' });
    }
});

// GET /api/performance/class/:subjectId - Class performance (Teachers only)
router.get('/class/:subjectId', verifyToken, authorize(['teacher']), async (req, res) => {
    try {
        const { subjectId } = req.params;
        const classPerformance = await pool.query(
            `SELECT s.id, s.name, s.roll_no, COUNT(sub.id) as tasks_completed,
             COALESCE(AVG(sub.total_marks_obtained), 0) as avg_marks,
             COALESCE(SUM(sub.total_marks_obtained), 0) as total_marks
             FROM lms.students s
             JOIN lms.enrollments e ON s.id = e.student_id
             JOIN lms.courses c ON e.course_id = c.id
             LEFT JOIN lms.tasks t ON c.id = t.course_id
             LEFT JOIN lms.submissions sub ON t.id = sub.task_id AND sub.student_id = s.id
             WHERE c.subject_id = $1
             GROUP BY s.id, s.name, s.roll_no
             ORDER BY total_marks DESC`,
            [subjectId]
        );
        res.json({ success: true, classPerformance: classPerformance.rows });
    } catch (error) {
        console.error('❌ Class Performance Error:', error);
        res.status(500).json({ error: 'Failed to load class performance' });
    }
});

module.exports = router;