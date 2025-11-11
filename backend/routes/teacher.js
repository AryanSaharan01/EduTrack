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
      `SELECT DISTINCT s.id, s.name, s.code, s.description,
       json_agg(json_build_object(
         'assignment_id', tsa.id,
         'course_id', c.id,
         'course_name', c.name,
         'course_code', c.code,
         'section_id', sec.id,
         'section_name', sec.name
       )) as assignments
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
    
    const students = await pool.query(
      `SELECT s.id, s.name, s.roll_no, s.course, s.section, u.email
       FROM lms.students s
       JOIN lms.users u ON s.user_id = u.id
       WHERE s.course = (SELECT code FROM lms.courses WHERE id = $1)
       AND s.section = (SELECT name FROM lms.sections WHERE id = $2)
       ORDER BY s.name`,
      [courseId, sectionId]
    );

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

module.exports = router;