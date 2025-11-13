const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

// Inline verifyToken middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      error: "Authentication required",
      message: "No token provided"
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: "Authentication required",
      message: "Invalid token format"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Authentication required",
      message: "Invalid or expired token"
    });
  }
};

// Authorize teacher role
const authorizeTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({
      error: "Access denied",
      message: "This action requires teacher role"
    });
  }
  next();
};

// GET /api/teacher/dashboard
router.get(
  "/dashboard",
  verifyToken,
  authorizeTeacher,
  async (req, res) => {
    try {
      const { userId } = req.user;

      // Get teacher profile
      const teacherResult = await pool.query(
        `SELECT t.*, u.email 
         FROM lms.teachers t
         JOIN lms.users u ON t.user_id = u.id
         WHERE t.user_id = $1`,
        [userId]
      );

      if (teacherResult.rows.length === 0) {
        return res.status(404).json({ error: "Teacher profile not found" });
      }

      const teacher = teacherResult.rows[0];

      // Get subjects taught by teacher with course/section details
      const subjectsResult = await pool.query(
        `SELECT DISTINCT s.id, s.name, s.code, s.description,
         COUNT(DISTINCT tsa.id) as assignment_count
         FROM lms.subjects s
         LEFT JOIN lms.teacher_subject_assignments tsa ON s.id = tsa.subject_id AND tsa.teacher_id = $1
         WHERE tsa.teacher_id = $1
         GROUP BY s.id, s.name, s.code, s.description
         ORDER BY s.name`,
        [teacher.id]
      );

      // Get total students enrolled under this teacher
      const studentsResult = await pool.query(
        `SELECT COUNT(DISTINCT e.student_id) as total
         FROM lms.enrollments e
         JOIN lms.teacher_subject_assignments tsa ON e.teacher_subject_assignment_id = tsa.id
         WHERE tsa.teacher_id = $1`,
        [teacher.id]
      );

      // Get total tasks created by teacher
      const tasksResult = await pool.query(
        `SELECT COUNT(t.id) as total
         FROM lms.tasks t
         JOIN lms.teacher_subject_assignments tsa ON t.teacher_subject_assignment_id = tsa.id
         WHERE tsa.teacher_id = $1`,
        [teacher.id]
      );

      res.json({
        success: true,
        data: {
          teacher: {
            id: teacher.id,
            name: teacher.name,
            email: teacher.email,
            employee_id: teacher.employee_id,
            department: teacher.department
          },
          subjects: subjectsResult.rows,
          stats: {
            totalStudents: parseInt(studentsResult.rows[0].total) || 0,
            totalTasks: parseInt(tasksResult.rows[0].total) || 0,
            totalSubjects: subjectsResult.rows.length
          }
        }
      });
    } catch (error) {
      console.error("❌ Teacher Dashboard Error:", error);
      res.status(500).json({ error: "Failed to load dashboard data" });
    }
  }
);

// GET /api/teacher/subjects - Get ONLY subjects assigned to this teacher
router.get("/subjects", verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const { userId } = req.user;

    // Get teacher ID first
    const teacherResult = await pool.query(
      "SELECT id FROM lms.teachers WHERE user_id = $1",
      [userId]
    );

    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const teacherId = teacherResult.rows[0].id;

    // Get ONLY subjects that this teacher has assigned (through teacher_subject_assignments)
    const subjects = await pool.query(
      `SELECT DISTINCT s.id, s.name, s.code, s.description,
       COUNT(DISTINCT e.student_id) as "studentCount",
       COUNT(DISTINCT t.id) as "taskCount"
       FROM lms.subjects s
       JOIN lms.teacher_subject_assignments tsa ON s.id = tsa.subject_id
       LEFT JOIN lms.enrollments e ON e.teacher_subject_assignment_id = tsa.id
       LEFT JOIN lms.tasks t ON t.teacher_subject_assignment_id = tsa.id
       WHERE tsa.teacher_id = $1
       GROUP BY s.id, s.name, s.code, s.description
       ORDER BY s.name`,
      [teacherId]
    );

    res.json({
      success: true,
      subjects: subjects.rows
    });
  } catch (error) {
    console.error("❌ Teacher Subjects Error:", error);
    res.status(500).json({ error: "Failed to load subjects" });
  }
});

// GET /api/teacher/my-subjects - Get subjects assigned to this teacher
router.get("/my-subjects", verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const { userId } = req.user;

    const teacherResult = await pool.query(
      "SELECT id FROM lms.teachers WHERE user_id = $1",
      [userId]
    );

    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const teacherId = teacherResult.rows[0].id;

    const subjects = await pool.query(
      `SELECT 
         s.id, 
         s.name, 
         s.code, 
         s.description,
         json_agg(
           json_build_object(
             'assignment_id', tsa.id,
             'course_id', c.id,
             'course_name', c.name,
             'course_code', c.code,
             'section_id', sec.id,
             'section_name', sec.name
           ) ORDER BY c.name, sec.name
         ) as assignments
       FROM lms.subjects s
       JOIN lms.teacher_subject_assignments tsa ON s.id = tsa.subject_id
       JOIN lms.courses c ON tsa.course_id = c.id
       JOIN lms.sections sec ON tsa.section_id = sec.id
       WHERE tsa.teacher_id = $1
       GROUP BY s.id, s.name, s.code, s.description
       ORDER BY s.name`,
      [teacherId]
    );

    res.json({
      success: true,
      subjects: subjects.rows
    });
  } catch (error) {
    console.error("❌ My Subjects Error:", error);
    res.status(500).json({ error: "Failed to load your subjects" });
  }
});

// POST /api/teacher/subjects - Create subjects in master list (not assign)
router.post('/subjects', verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const incoming = req.body.subjects || (req.body.name ? [req.body] : []);
    if (!Array.isArray(incoming) || incoming.length === 0) {
      return res.status(400).json({ error: 'No subject data provided' });
    }

    const created = [];
    await pool.query('BEGIN');
    
    for (const subject of incoming) {
      const name = (subject.name || '').trim();
      const code = (subject.code || '').trim().toUpperCase();
      const description = subject.description || null;
      
      if (!name || !code) continue;

      try {
        const insertResult = await pool.query(
          `INSERT INTO lms.subjects (name, code, description, created_at, updated_at)
           VALUES ($1, $2, $3, NOW(), NOW()) 
           RETURNING *`,
          [name, code, description]
        );
        created.push(insertResult.rows[0]);
      } catch (err) {
        if (err.code === '23505') {
          const existing = await pool.query(
            'SELECT * FROM lms.subjects WHERE code = $1', 
            [code]
          );
          created.push({ 
            note: 'Subject code already exists', 
            code: code,
            existing: existing.rows[0] 
          });
        } else {
          throw err;
        }
      }
    }
    
    await pool.query('COMMIT');
    return res.json({ 
      success: true, 
      created,
      message: `Successfully processed ${created.length} subject(s)`
    });
  } catch (error) {
    await pool.query('ROLLBACK').catch(() => {});
    console.error('❌ Create Subjects Error:', error);
    return res.status(500).json({ error: 'Failed to create subjects' });
  }
});

// GET /api/teacher/subjects/available - Get all subjects available for assignment
router.get("/subjects/available", verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const subjects = await pool.query(
      `SELECT id, name, code, description
       FROM lms.subjects
       ORDER BY name`
    );

    res.json({
      success: true,
      subjects: subjects.rows
    });
  } catch (error) {
    console.error("❌ Available Subjects Error:", error);
    res.status(500).json({ error: "Failed to load available subjects" });
  }
});

// GET /api/teacher/courses - Get all courses
router.get('/courses', verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const courses = await pool.query(
      `SELECT id, name, code, description
       FROM lms.courses
       ORDER BY name`
    );

    res.json({
      success: true,
      courses: courses.rows
    });
  } catch (error) {
    console.error('❌ Get Courses Error:', error);
    res.status(500).json({ error: 'Failed to load courses' });
  }
});

// GET /api/teacher/sections/:courseId - Get sections for a course
router.get('/sections/:courseId', verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const sections = await pool.query(
      `SELECT id, name
       FROM lms.sections
       WHERE course_id = $1
       ORDER BY name`,
      [courseId]
    );

    res.json({
      success: true,
      sections: sections.rows
    });
  } catch (error) {
    console.error('❌ Get Sections Error:', error);
    res.status(500).json({ error: 'Failed to load sections' });
  }
});

// GET /api/teacher/students/by-course-section/:courseId/:sectionId - Get students by course and section
router.get('/students/by-course-section/:courseId/:sectionId', verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    
    // Get course and section data
    const courseResult = await pool.query('SELECT code, name FROM lms.courses WHERE id = $1', [courseId]);
    const sectionResult = await pool.query('SELECT name FROM lms.sections WHERE id = $1', [sectionId]);
    
    if (courseResult.rows.length === 0 || sectionResult.rows.length === 0) {
      console.log('Course or section not found:', { courseId, sectionId });
      return res.json({
        success: true,
        students: []
      });
    }
    
    const courseCode = courseResult.rows[0].code;
    const courseName = courseResult.rows[0].name;
    const sectionName = sectionResult.rows[0].name;
    
    console.log('Searching for students with:', { courseCode, courseName, sectionName });
    
    // Extract just the letter from section name (remove "Section " prefix if present)
    const sectionLetter = sectionName.replace(/^Section\s*/i, '').trim();
    
    console.log('Extracted section letter:', sectionLetter);
    
    // Search using course name (not code) and section letter
    const students = await pool.query(
      `SELECT s.id, s.name, s.roll_no, s.course, s.section, u.email
       FROM lms.students s
       JOIN lms.users u ON s.user_id = u.id
       WHERE UPPER(s.course) = UPPER($1) 
       AND UPPER(s.section) = UPPER($2)
       ORDER BY s.name`,
      [courseName, sectionLetter]
    );

    console.log(`Found ${students.rows.length} students for course: ${courseName}, section: ${sectionLetter}`);

    res.json({
      success: true,
      students: students.rows
    });
  } catch (error) {
    console.error('❌ Get Students Error:', error);
    res.status(500).json({ error: 'Failed to load students' });
  }
});

// POST /api/teacher/assign-subject - Assign subject to teacher with course-section and enroll students
router.post('/assign-subject', verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const { userId } = req.user;
    const { subject_id, course_id, section_id, student_ids } = req.body;
    
    if (!subject_id || !course_id || !section_id || !Array.isArray(student_ids) || student_ids.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'subject_id, course_id, section_id, and student_ids array are required' 
      });
    }

    const teacherResult = await pool.query(
      'SELECT id FROM lms.teachers WHERE user_id = $1', 
      [userId]
    );
    
    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    
    const teacherId = teacherResult.rows[0].id;

    await pool.query('BEGIN');

    // Create or get teacher_subject_assignment
    const assignmentResult = await pool.query(
      `INSERT INTO lms.teacher_subject_assignments (teacher_id, subject_id, course_id, section_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (teacher_id, subject_id, course_id, section_id) 
       DO UPDATE SET updated_at = NOW()
       RETURNING id`,
      [teacherId, subject_id, course_id, section_id]
    );

    const assignmentId = assignmentResult.rows[0].id;

    // Enroll students
    const enrolled = [];
    for (const studentId of student_ids) {
      const result = await pool.query(
        `INSERT INTO lms.enrollments (student_id, teacher_subject_assignment_id, enrolled_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (student_id, teacher_subject_assignment_id) DO NOTHING
         RETURNING id`,
        [studentId, assignmentId]
      );
      
      if (result.rows.length) {
        enrolled.push(result.rows[0]);
      }
    }

    await pool.query('COMMIT');
    
    res.json({ 
      success: true, 
      assignment_id: assignmentId,
      enrolled_count: enrolled.length,
      total_attempted: student_ids.length,
      message: `Successfully enrolled ${enrolled.length} student(s) in the subject`
    });
  } catch (error) {
    await pool.query('ROLLBACK').catch(() => {});
    console.error('❌ Assign Subject Error:', error);
    res.status(500).json({ error: 'Failed to assign subject and enroll students' });
  }
});

// GET /api/teacher/profile
router.get("/profile", verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await pool.query(
      `SELECT t.*, u.email 
       FROM lms.teachers t
       JOIN lms.users u ON t.user_id = u.id
       WHERE t.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json({
      success: true,
      teacher: result.rows[0]
    });
  } catch (error) {
    console.error("❌ Teacher Profile Error:", error);
    res.status(500).json({ error: "Failed to load profile" });
  }
});

// PUT /api/teacher/profile
router.put("/profile", verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, phone, department, qualification, experience_years, bio } = req.body;

    const result = await pool.query(
      `UPDATE lms.teachers 
       SET name = COALESCE($1, name), 
           phone = COALESCE($2, phone), 
           department = COALESCE($3, department),
           qualification = COALESCE($4, qualification),
           experience_years = COALESCE($5, experience_years),
           bio = COALESCE($6, bio),
           updated_at = NOW()
       WHERE user_id = $7
       RETURNING *`,
      [name, phone, department, qualification, experience_years, bio, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json({
      success: true,
      teacher: result.rows[0],
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("❌ Update Teacher Profile Error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// POST /api/teacher/tasks/create - Create a new task
router.post('/tasks/create', verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const { teacher_subject_assignment_id, title, description, difficulty, time_limit_minutes, deadline, questions } = req.body;
    
    if (!teacher_subject_assignment_id || !title || !questions || questions.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await pool.query('BEGIN');

    // Create task
    const taskResult = await pool.query(
      `INSERT INTO lms.tasks (teacher_subject_assignment_id, title, description, difficulty, time_limit_minutes, deadline, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'published', NOW(), NOW())
       RETURNING id`,
      [teacher_subject_assignment_id, title, description || null, difficulty || 'medium', time_limit_minutes || 60, deadline || null]
    );

    const taskId = taskResult.rows[0].id;

    // Insert questions
    for (const question of questions) {
      await pool.query(
        `INSERT INTO lms.task_questions (task_id, question_number, question_text, programming_language, expected_output, marks, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [taskId, question.question_number, question.question_text, question.programming_language || 'python', question.expected_output, question.marks || 10]
      );
    }

    await pool.query('COMMIT');

    res.json({
      success: true,
      task_id: taskId,
      message: 'Task created successfully'
    });
  } catch (error) {
    await pool.query('ROLLBACK').catch(() => {});
    console.error('❌ Create Task Error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// GET /api/teacher/subjects/available - Get all subjects available for assignment
router.get("/subjects/available", verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const subjects = await pool.query(
      `SELECT id, name, code, description
       FROM lms.subjects
       ORDER BY name`
    );

    res.json({
      success: true,
      subjects: subjects.rows
    });
  } catch (error) {
    console.error("❌ Available Subjects Error:", error);
    res.status(500).json({ error: "Failed to load available subjects" });
  }
});

// GET /api/teacher/my-tasks - Get all tasks created by this teacher
router.get('/my-tasks', verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const { userId } = req.user;

    const teacherResult = await pool.query(
      'SELECT id FROM lms.teachers WHERE user_id = $1',
      [userId]
    );

    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const teacherId = teacherResult.rows[0].id;

    const tasks = await pool.query(
      `SELECT 
        t.id,
        t.title,
        t.description,
        t.difficulty,
        t.time_limit_minutes,
        t.deadline,
        t.status,
        t.created_at,
        COUNT(DISTINCT tq.id) as question_count,
        COUNT(DISTINCT sub.id) as submission_count,
        s.name as subject_name,
        c.name as course_name,
        sec.name as section_name
       FROM lms.tasks t
       JOIN lms.teacher_subject_assignments tsa ON t.teacher_subject_assignment_id = tsa.id
       JOIN lms.subjects s ON tsa.subject_id = s.id
       JOIN lms.courses c ON tsa.course_id = c.id
       JOIN lms.sections sec ON tsa.section_id = sec.id
       LEFT JOIN lms.task_questions tq ON t.id = tq.task_id
       LEFT JOIN lms.submissions sub ON t.id = sub.task_id
       WHERE tsa.teacher_id = $1
       GROUP BY t.id, s.name, c.name, sec.name
       ORDER BY t.created_at DESC`,
      [teacherId]
    );

    res.json({
      success: true,
      tasks: tasks.rows
    });
  } catch (error) {
    console.error('❌ Get My Tasks Error:', error);
    res.status(500).json({ error: 'Failed to load tasks' });
  }
});

// GET /api/teacher/tasks/:taskId/submissions - Get all submissions for a task
router.get('/tasks/:taskId/submissions', verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const { taskId } = req.params;

    const submissions = await pool.query(
      `SELECT 
        sub.id as submission_id,
        sub.submitted_at,
        sub.total_marks_obtained,
        sub.submission_status,
        s.id as student_id,
        s.name as student_name,
        s.roll_no,
        u.email,
        COUNT(sa.id) as answers_count
       FROM lms.submissions sub
       JOIN lms.students s ON sub.student_id = s.id
       JOIN lms.users u ON s.user_id = u.id
       LEFT JOIN lms.submission_answers sa ON sub.id = sa.submission_id
       WHERE sub.task_id = $1
       GROUP BY sub.id, s.id, s.name, s.roll_no, u.email
       ORDER BY sub.submitted_at DESC`,
      [taskId]
    );

    res.json({
      success: true,
      submissions: submissions.rows
    });
  } catch (error) {
    console.error('❌ Get Submissions Error:', error);
    res.status(500).json({ error: 'Failed to load submissions' });
  }
});

// GET /api/teacher/submissions/:submissionId - Get detailed submission with answers
router.get('/submissions/:submissionId', verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const { submissionId } = req.params;

    // Get submission details
    const submissionResult = await pool.query(
      `SELECT 
        sub.id,
        sub.task_id,
        sub.submitted_at,
        sub.total_marks_obtained,
        sub.submission_status,
        s.id as student_id,
        s.name as student_name,
        s.roll_no,
        u.email as student_email,
        t.title as task_title,
        t.difficulty,
        t.time_limit_minutes
       FROM lms.submissions sub
       JOIN lms.students s ON sub.student_id = s.id
       JOIN lms.users u ON s.user_id = u.id
       JOIN lms.tasks t ON sub.task_id = t.id
       WHERE sub.id = $1`,
      [submissionId]
    );

    if (submissionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const submission = submissionResult.rows[0];

    // Get all answers with question details
    const answersResult = await pool.query(
      `SELECT 
        sa.id as answer_id,
        sa.answer_code,
        sa.marks_awarded,
        tq.id as question_id,
        tq.question_number,
        tq.question_text,
        tq.programming_language,
        tq.expected_output,
        tq.marks as total_marks
       FROM lms.submission_answers sa
       JOIN lms.task_questions tq ON sa.question_id = tq.id
       WHERE sa.submission_id = $1
       ORDER BY tq.question_number`,
      [submissionId]
    );

    res.json({
      success: true,
      submission: {
        ...submission,
        answers: answersResult.rows
      }
    });
  } catch (error) {
    console.error('❌ Get Submission Details Error:', error);
    res.status(500).json({ error: 'Failed to load submission details' });
  }
});

// PUT /api/teacher/submissions/:submissionId/grade - Grade a submission
router.put('/submissions/:submissionId/grade', verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { answers } = req.body; // Array of { answerId, marksAwarded }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid grading data' });
    }

    await pool.query('BEGIN');

    let totalMarks = 0;

    // Update marks for each answer
    for (const answer of answers) {
      await pool.query(
        `UPDATE lms.submission_answers 
         SET marks_awarded = $1 
         WHERE id = $2`,
        [answer.marksAwarded, answer.answerId]
      );
      totalMarks += answer.marksAwarded;
    }

    // Update submission total marks and status
    await pool.query(
      `UPDATE lms.submissions 
       SET total_marks_obtained = $1, 
           submission_status = 'graded',
           updated_at = NOW()
       WHERE id = $2`,
      [totalMarks, submissionId]
    );

    await pool.query('COMMIT');

    console.log(`✅ Submission ${submissionId} graded with total marks: ${totalMarks}`);

    res.json({
      success: true,
      message: 'Submission graded successfully',
      totalMarks
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('❌ Grade Submission Error:', error);
    res.status(500).json({ error: 'Failed to grade submission' });
  }
});

module.exports = router;