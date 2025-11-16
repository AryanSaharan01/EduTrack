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
        console.log(`[STUDENT DASHBOARD] Request from user ID: ${userId}`);
        
        const studentResult = await pool.query('SELECT * FROM lms.students WHERE user_id = $1', [userId]);
        console.log(`[STUDENT DASHBOARD] Student query returned ${studentResult.rows.length} rows`);
        
        if (studentResult.rows.length === 0) {
            console.warn(`[STUDENT DASHBOARD] No student found for user ID: ${userId}`);
            return res.status(404).json({ error: 'Student not found' });
        }
        
        const student = studentResult.rows[0];
        const studentId = student.id;
        console.log(`[STUDENT DASHBOARD] Found student ID: ${studentId}`);
        
        // Check enrollment
        const enrollmentCheck = await pool.query(
          'SELECT COUNT(*) as count FROM lms.enrollments WHERE student_id = $1',
          [studentId]
        );
        const enrolled = parseInt(enrollmentCheck.rows[0].count) > 0;
        console.log(`[STUDENT DASHBOARD] Enrollment status: ${enrolled}`);
        
        if (!enrolled) {
          console.log(`[STUDENT DASHBOARD] Student not enrolled, returning basic info`);
          return res.json({
            success: true,
            data: { student, enrolled: false }
          });
        }
        
        // Get enrolled subjects
        const subjects = await pool.query(
          `SELECT DISTINCT s.id, s.name, s.code
           FROM lms.subjects s
           JOIN lms.teacher_subject_assignments tsa ON s.id = tsa.subject_id
           JOIN lms.enrollments e ON tsa.id = e.teacher_subject_assignment_id
           WHERE e.student_id = $1`,
          [studentId]
        );
        
        // Get upcoming tasks
        const upcomingTasks = await pool.query(
          `SELECT t.id, t.title, t.deadline, s.name as subject
           FROM lms.tasks t
           JOIN lms.teacher_subject_assignments tsa ON t.teacher_subject_assignment_id = tsa.id
           JOIN lms.subjects s ON tsa.subject_id = s.id
           JOIN lms.enrollments e ON tsa.id = e.teacher_subject_assignment_id
           LEFT JOIN lms.submissions sub ON t.id = sub.task_id AND sub.student_id = $1
           WHERE e.student_id = $1 AND t.status = 'published' AND sub.id IS NULL
           ORDER BY t.deadline ASC LIMIT 5`,
          [studentId]
        );
        
        // Calculate student's rank in their course and section
        const rankResult = await pool.query(
          `WITH ranked_students AS (
            SELECT 
              s.id,
              COALESCE(SUM(sub.total_marks_obtained), 0) as total_marks,
              RANK() OVER (ORDER BY COALESCE(SUM(sub.total_marks_obtained), 0) DESC) as rank
            FROM lms.students s
            LEFT JOIN lms.submissions sub ON s.id = sub.student_id AND sub.submission_status = 'graded'
            WHERE s.course = $2 AND s.section = $3
            GROUP BY s.id
          )
          SELECT rank FROM ranked_students WHERE id = $1`,
          [studentId, student.course, student.section]
        );
        
    const rank = rankResult.rows.length > 0 ? parseInt(rankResult.rows[0].rank) : null;
    
    // Calculate active streak (consecutive days with submissions)
    const streakResult = await pool.query(
      `WITH RECURSIVE submission_dates AS (
        SELECT DISTINCT DATE(submitted_at) as submission_date
        FROM lms.submissions
        WHERE student_id = $1
        ORDER BY submission_date DESC
      ),
      streak_calc AS (
        SELECT 
          submission_date,
          submission_date = CURRENT_DATE OR submission_date = CURRENT_DATE - 1 as is_recent,
          LAG(submission_date) OVER (ORDER BY submission_date DESC) as prev_date
        FROM submission_dates
      )
      SELECT COUNT(*) as streak
      FROM streak_calc
      WHERE is_recent = true 
      AND (prev_date IS NULL OR submission_date - prev_date = 1 OR submission_date = prev_date)`,
      [studentId]
    );
    
    const streak = streakResult.rows.length > 0 ? parseInt(streakResult.rows[0].streak) || 0 : 0;
    
    // Get notifications (placeholder)
    const notifications = [];
    
    res.json({
      success: true,
      data: {
        student,
        enrolled: true,
        subjects: subjects.rows,
        upcomingTasks: upcomingTasks.rows,
        notifications,
        rank,
        streak
      }
    });
    console.log(`[STUDENT DASHBOARD] Successfully returned dashboard data for student ID: ${studentId}`);
  } catch (error) {
    console.error('❌ [STUDENT DASHBOARD] Error:', error);
    console.error('❌ [STUDENT DASHBOARD] Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to load dashboard', 
      details: error.message,
      hint: 'Check if lms schema exists and has data'
    });
  }
});router.get('/subjects', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const studentResult = await pool.query('SELECT id FROM lms.students WHERE user_id = $1', [userId]);
        if (studentResult.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
        const studentId = studentResult.rows[0].id;
        
        const subjects = await pool.query(
            `SELECT DISTINCT 
                sub.id, 
                sub.name, 
                sub.code, 
                sub.description, 
                t.name as teacher_name, 
                t.employee_id,
                COUNT(DISTINCT t2.id) as total_tasks,
                COUNT(DISTINCT CASE WHEN s.id IS NOT NULL THEN t2.id END) as completed_tasks,
                CASE 
                    WHEN COUNT(DISTINCT t2.id) > 0 
                    THEN ROUND((COUNT(DISTINCT CASE WHEN s.id IS NOT NULL THEN t2.id END)::numeric / COUNT(DISTINCT t2.id)::numeric) * 100, 0)
                    ELSE 0 
                END as completion_rate
             FROM lms.enrollments e
             JOIN lms.teacher_subject_assignments tsa ON e.teacher_subject_assignment_id = tsa.id
             JOIN lms.subjects sub ON tsa.subject_id = sub.id
             LEFT JOIN lms.teachers t ON tsa.teacher_id = t.id
             LEFT JOIN lms.tasks t2 ON tsa.id = t2.teacher_subject_assignment_id AND t2.status = 'published'
             LEFT JOIN lms.submissions s ON t2.id = s.task_id AND s.student_id = $1
             WHERE e.student_id = $1 
             GROUP BY sub.id, sub.name, sub.code, sub.description, t.name, t.employee_id
             ORDER BY sub.name`,
            [studentId]
        );
        
        res.json({ success: true, subjects: subjects.rows });
    } catch (error) {
        console.error('❌ Subjects Error:', error);
        res.status(500).json({ error: 'Failed to load subjects', details: error.message });
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
            `SELECT DISTINCT sub.id, sub.name, sub.code, sub.description, t.name as teacher_name
             FROM lms.subjects sub
             JOIN lms.teacher_subject_assignments tsa ON sub.id = tsa.subject_id
             JOIN lms.enrollments e ON tsa.id = e.teacher_subject_assignment_id
             LEFT JOIN lms.teachers t ON tsa.teacher_id = t.id
             WHERE sub.id = $1 AND e.student_id = $2`,
            [subjectId, studentId]
        );
        
        if (subjectResult.rows.length === 0) {
            return res.status(404).json({ error: 'Subject not found or not enrolled' });
        }
        
        const tasksResult = await pool.query(
            `SELECT DISTINCT t.id, t.title, t.description, t.difficulty, t.deadline, t.status, t.time_limit_minutes,
             CASE WHEN sub.id IS NOT NULL THEN true ELSE false END as is_submitted
             FROM lms.tasks t
             JOIN lms.teacher_subject_assignments tsa ON t.teacher_subject_assignment_id = tsa.id
             JOIN lms.enrollments e ON tsa.id = e.teacher_subject_assignment_id
             LEFT JOIN lms.submissions sub ON t.id = sub.task_id AND sub.student_id = $1
             WHERE e.student_id = $1 AND tsa.subject_id = $2 AND t.status = 'published'
             ORDER BY t.deadline DESC`,
            [studentId, subjectId]
        );
        
        // Fetch questions for each task
        const tasksWithQuestions = await Promise.all(
            tasksResult.rows.map(async (task) => {
                const questionsResult = await pool.query(
                    `SELECT id, question_number as "questionNumber", question_text as "questionText",
                     programming_language as "programmingLanguage", expected_output as "expectedOutput", marks
                     FROM lms.task_questions WHERE task_id = $1 ORDER BY question_number`,
                    [task.id]
                );
                return {
                    ...task,
                    timeLimit: task.time_limit_minutes,
                    questionCount: questionsResult.rows.length,
                    questions: questionsResult.rows
                };
            })
        );
        
        res.json({ 
            success: true, 
            subject: subjectResult.rows[0], 
            tasks: tasksWithQuestions 
        });
    } catch (error) {
        console.error('❌ Subject Details Error:', error);
        res.status(500).json({ error: 'Failed to load subject details', details: error.message });
    }
});

router.get('/profile', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const result = await pool.query(
            `SELECT s.*, u.email FROM lms.students s 
             JOIN lms.users u ON s.user_id = u.id 
             WHERE s.user_id = $1`,
            [userId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
        res.json({ success: true, student: result.rows[0] });
    } catch (error) {
        console.error('❌ Profile Error:', error);
        res.status(500).json({ error: 'Failed to load profile', details: error.message });
    }
});

router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { name, phone } = req.body;
        const result = await pool.query(
            `UPDATE lms.students SET name = $1, phone = $2, updated_at = NOW() 
             WHERE user_id = $3 RETURNING *`,
            [name, phone, userId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
        res.json({ success: true, student: result.rows[0] });
    } catch (error) {
        console.error('❌ Update Profile Error:', error);
        res.status(500).json({ error: 'Failed to update profile', details: error.message });
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
        res.status(500).json({ error: 'Failed to load notifications', details: error.message });
    }
});

router.get('/analytics', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const studentResult = await pool.query('SELECT id FROM lms.students WHERE user_id = $1', [userId]);
        if (studentResult.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
        const studentId = studentResult.rows[0].id;
        
        const statsResult = await pool.query(
            `SELECT COUNT(sub.id) as tasks_completed, 
             COALESCE(SUM(sub.total_marks_obtained), 0) as total_marks,
             COALESCE(AVG(sub.total_marks_obtained), 0) as avg_marks
             FROM lms.submissions sub WHERE sub.student_id = $1`,
            [studentId]
        );
        const stats = statsResult.rows[0];
        
        const markTrendResult = await pool.query(
            `SELECT TO_CHAR(sub.submitted_at, 'MM/DD') as date, sub.total_marks_obtained as marks
             FROM lms.submissions sub WHERE sub.student_id = $1 
             ORDER BY sub.submitted_at DESC LIMIT 10`,
            [studentId]
        );
        
        const subjectDistResult = await pool.query(
            `SELECT s.name as subject, COUNT(sub.id) as value
             FROM lms.submissions sub 
             JOIN lms.tasks t ON sub.task_id = t.id
             JOIN lms.teacher_subject_assignments tsa ON t.teacher_subject_assignment_id = tsa.id
             JOIN lms.subjects s ON tsa.subject_id = s.id
             WHERE sub.student_id = $1 
             GROUP BY s.name`,
            [studentId]
        );
        
        const perfPerSubjectResult = await pool.query(
            `SELECT s.name as subject, COALESCE(AVG(sub.total_marks_obtained), 0) as marks
             FROM lms.subjects s
             JOIN lms.teacher_subject_assignments tsa ON s.id = tsa.subject_id
             JOIN lms.enrollments e ON tsa.id = e.teacher_subject_assignment_id
             LEFT JOIN lms.tasks t ON tsa.id = t.teacher_subject_assignment_id
             LEFT JOIN lms.submissions sub ON t.id = sub.task_id AND sub.student_id = $1
             WHERE e.student_id = $1
             GROUP BY s.name 
             ORDER BY marks DESC`,
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
        res.status(500).json({ error: 'Failed to load analytics', details: error.message });
    }
});

router.get("/tasks", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const studentResult = await pool.query('SELECT id FROM lms.students WHERE user_id = $1', [userId]);
    if (studentResult.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    const studentId = studentResult.rows[0].id;

    const tasksResult = await pool.query(
      `SELECT DISTINCT t.id, t.title, t.description, t.difficulty, t.deadline, 
       t.time_limit_minutes as time_limit, t.status,
       sub.id as subject_id, sub.name as subject_name, sub.code as subject_code,
       (SELECT COUNT(*) FROM lms.task_questions WHERE task_id = t.id) as question_count,
       CASE WHEN s.id IS NOT NULL THEN true ELSE false END as is_submitted
       FROM lms.tasks t
       JOIN lms.teacher_subject_assignments tsa ON t.teacher_subject_assignment_id = tsa.id
       JOIN lms.subjects sub ON tsa.subject_id = sub.id
       JOIN lms.enrollments e ON tsa.id = e.teacher_subject_assignment_id
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
    res.status(500).json({ error: "Failed to load tasks", details: error.message });
  }
});

// POST /api/student/submissions - Submit task answers
router.post('/submissions', verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { taskId, answers, tabSwitchCount, timeTaken } = req.body;

    console.log('📝 Submission received:', { userId, taskId, answersCount: answers?.length });

    if (!taskId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid submission data' });
    }

    const studentResult = await pool.query(
      'SELECT id FROM lms.students WHERE user_id = $1',
      [userId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentId = studentResult.rows[0].id;

    await pool.query('BEGIN');

    try {
      // Create submission
      const submissionResult = await pool.query(
        `INSERT INTO lms.submissions (task_id, student_id, submitted_at, submission_status, total_marks_obtained)
         VALUES ($1, $2, NOW(), 'submitted', 0)
         RETURNING id`,
        [taskId, studentId]
      );

      const submissionId = submissionResult.rows[0].id;
      console.log('✅ Submission created:', submissionId);

      // Insert answers
      for (const answer of answers) {
        await pool.query(
          `INSERT INTO lms.submission_answers (submission_id, question_id, answer_code, marks_awarded)
           VALUES ($1, $2, $3, 0)`,
          [submissionId, answer.questionId, answer.code]
        );
      }

      await pool.query('COMMIT');
      console.log('✅ All answers saved for submission:', submissionId);

      res.json({
        success: true,
        submissionId: submissionId,
        message: 'Submission successful'
      });
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error('❌ Submission transaction error:', err);
      throw err;
    }
  } catch (error) {
    console.error('❌ Submission Error:', error);
    res.status(500).json({ error: 'Failed to submit answers', details: error.message });
  }
});

// POST /api/student/run-code - Run code (mock execution)
router.post('/run-code', verifyToken, async (req, res) => {
  try {
    const { code, language, expectedOutput } = req.body;

    console.log(`🏃 Running ${language} code...`);
    
    // Mock execution - integrate with actual code runner in production
    res.json({
      success: true,
      output: `Code executed successfully!\n\nExpected Output:\n${expectedOutput || 'No expected output provided'}\n\n✅ Code compiled and ran without errors.\n\nNote: This is a mock execution. Integrate with Judge0, Piston, or similar service for actual code execution.`
    });
  } catch (error) {
    console.error('❌ Run Code Error:', error);
    res.status(500).json({ error: 'Failed to run code', details: error.message });
  }
});

module.exports = router;




