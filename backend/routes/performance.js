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
        
        // Get total tasks assigned to this student
        const totalTasksResult = await pool.query(
            `SELECT COUNT(DISTINCT t.id) as total
             FROM lms.tasks t
             JOIN lms.teacher_subject_assignments tsa ON t.teacher_subject_assignment_id = tsa.id
             JOIN lms.enrollments e ON e.teacher_subject_assignment_id = tsa.id
             WHERE e.student_id = $1 AND t.status = 'published'`,
            [studentId]
        );
        
        const totalTasks = parseInt(totalTasksResult.rows[0]?.total) || 0;

        // Get completed tasks count
        const completedTasksResult = await pool.query(
            `SELECT COUNT(DISTINCT sub.task_id) as completed
             FROM lms.submissions sub
             WHERE sub.student_id = $1`,
            [studentId]
        );
        
        const completedTasks = parseInt(completedTasksResult.rows[0]?.completed) || 0;

        // Get average marks (considering each question is 5 marks)
        const avgMarksResult = await pool.query(
            `SELECT 
                COALESCE(AVG(sub.total_marks_obtained), 0) as avg_marks,
                COUNT(sub.id) as graded_count
             FROM lms.submissions sub
             WHERE sub.student_id = $1 AND sub.submission_status = 'graded'`,
            [studentId]
        );
        
        const avgMarks = parseFloat(avgMarksResult.rows[0]?.avg_marks) || 0;
        const gradedCount = parseInt(avgMarksResult.rows[0]?.graded_count) || 0;

        // Calculate average accuracy (assuming each task has questions worth 5 marks each)
        const accuracyResult = await pool.query(
            `SELECT 
                COALESCE(AVG((sub.total_marks_obtained::float / (tq_count.total_questions * 5)) * 100), 0) as avg_accuracy
             FROM lms.submissions sub
             JOIN (
                 SELECT t.id, COUNT(tq.id) as total_questions
                 FROM lms.tasks t
                 LEFT JOIN lms.task_questions tq ON t.id = tq.task_id
                 GROUP BY t.id
             ) tq_count ON sub.task_id = tq_count.id
             WHERE sub.student_id = $1 AND sub.submission_status = 'graded'
             AND tq_count.total_questions > 0`,
            [studentId]
        );
        
        const avgAccuracy = parseFloat(accuracyResult.rows[0]?.avg_accuracy) || 0;

        // Get task-wise performance
        const tasksPerformance = await pool.query(
            `SELECT 
                t.title as "taskName",
                sub.total_marks_obtained as marks,
                sub.submitted_at,
                COUNT(tq.id) as question_count
             FROM lms.submissions sub
             JOIN lms.tasks t ON sub.task_id = t.id
             LEFT JOIN lms.task_questions tq ON t.id = tq.task_id
             WHERE sub.student_id = $1 AND sub.submission_status = 'graded'
             GROUP BY t.id, t.title, sub.total_marks_obtained, sub.submitted_at
             ORDER BY sub.submitted_at DESC
             LIMIT 10`,
            [studentId]
        );

        // Get trend data (performance over time)
        const trendData = await pool.query(
            `SELECT 
                TO_CHAR(sub.submitted_at, 'Mon DD') as date,
                sub.total_marks_obtained as marks
             FROM lms.submissions sub
             WHERE sub.student_id = $1 AND sub.submission_status = 'graded'
             ORDER BY sub.submitted_at ASC
             LIMIT 10`,
            [studentId]
        );

        // Get recent submissions
        const recentSubmissions = await pool.query(
            `SELECT 
                t.title as task,
                sub.total_marks_obtained as marks,
                TO_CHAR(sub.submitted_at, 'Mon DD, YYYY') as submitted
             FROM lms.submissions sub
             JOIN lms.tasks t ON sub.task_id = t.id
             WHERE sub.student_id = $1
             ORDER BY sub.submitted_at DESC
             LIMIT 5`,
            [studentId]
        );

        // Determine strengths and weaknesses based on performance
        const strengths = [];
        const weaknesses = [];

        if (avgAccuracy >= 80) {
            strengths.push('High accuracy in task completion');
        } else if (avgAccuracy < 50) {
            weaknesses.push('Low accuracy - needs improvement');
        }

        if (completedTasks >= totalTasks * 0.8) {
            strengths.push('Excellent task completion rate');
        } else if (completedTasks < totalTasks * 0.5) {
            weaknesses.push('Low task completion rate');
        }

        if (avgMarks >= 40) {
            strengths.push('Strong performance in assessments');
        } else if (avgMarks < 25) {
            weaknesses.push('Needs to improve assessment scores');
        }

        // Add default messages if empty
        if (strengths.length === 0 && gradedCount > 0) {
            strengths.push('Consistent effort in completing tasks');
        }
        
        if (weaknesses.length === 0 && gradedCount > 0) {
            weaknesses.push('Focus on improving speed and accuracy');
        }

        if (gradedCount === 0) {
            strengths.push('Ready to start learning journey');
            weaknesses.push('No graded submissions yet');
        }

        res.json({
            success: true,
            data: {
                average_marks: avgMarks,
                average_accuracy: avgAccuracy,
                completed_tasks: completedTasks,
                total_tasks: totalTasks,
                tasks: tasksPerformance.rows,
                trend: trendData.rows,
                recentSubmissions: recentSubmissions.rows,
                strengths,
                weaknesses
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