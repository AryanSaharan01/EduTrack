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

      // Get subjects taught by teacher
      const subjectsResult = await pool.query(
        `SELECT id, name, code, description
         FROM lms.subjects
         WHERE teacher_id = $1
         ORDER BY name`,
        [teacher.id]
      );

      // Get total students
      const studentsResult = await pool.query(
        `SELECT COUNT(DISTINCT e.student_id) as total
         FROM lms.enrollments e
         JOIN lms.courses c ON e.course_id = c.id
         JOIN lms.subjects s ON c.subject_id = s.id
         WHERE s.teacher_id = $1`,
        [teacher.id]
      );

      // Get total tasks
      const tasksResult = await pool.query(
        `SELECT COUNT(t.id) as total
         FROM lms.tasks t
         JOIN lms.courses c ON t.course_id = c.id
         JOIN lms.subjects s ON c.subject_id = s.id
         WHERE s.teacher_id = $1`,
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

// GET /api/teacher/subjects
router.get("/subjects", verifyToken, authorizeTeacher, async (req, res) => {
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
      `SELECT id, name, code, description
       FROM lms.subjects
       WHERE teacher_id = $1
       ORDER BY name`,
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

// POST /api/teacher/subjects
// Accepts either { subjects: [{name, code, description}, ...] } OR a single subject object
router.post('/subjects', verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const { userId } = req.user;
    
    // Find teacher id
    const teacherResult = await pool.query('SELECT id FROM lms.teachers WHERE user_id = $1', [userId]);
    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    const teacherId = teacherResult.rows[0].id;

    // Accept either array or single subject
    const incoming = req.body.subjects || (req.body.name ? [req.body] : []);
    if (!Array.isArray(incoming) || incoming.length === 0) {
      return res.status(400).json({ error: 'No subject data provided' });
    }

    const created = [];
    await pool.query('BEGIN');
    
    for (const subject of incoming) {
      // Normalize data
      const name = (subject.name || '').trim();
      const code = (subject.code || '').trim().toUpperCase();
      const description = subject.description || null;
      
      if (!name || !code) continue;

      // Try insert - code has UNIQUE constraint in schema
      try {
        const insertResult = await pool.query(
          `INSERT INTO lms.subjects (teacher_id, name, code, description, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NOW(), NOW()) 
           RETURNING *`,
          [teacherId, name, code, description]
        );
        created.push(insertResult.rows[0]);
      } catch (err) {
        // Handle unique violation gracefully
        if (err.code === '23505') {
          // Unique violation - subject code already exists
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
          // Other DB error - rethrow to abort transaction
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

// GET /api/teacher/students
// Returns distinct students enrolled in courses belonging to subjects taught by this teacher
router.get('/students', verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const { userId } = req.user;
    
    const teacherResult = await pool.query(
      'SELECT id FROM lms.teachers WHERE user_id = $1', 
      [userId]
    );
    
    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    
    const teacherId = teacherResult.rows[0].id;

    const studentsQuery = `
      SELECT DISTINCT 
        s.id, 
        s.name, 
        s.roll_no, 
        s.email, 
        c.id as course_id, 
        c.name as course_name, 
        sec.id as section_id, 
        sec.name as section
      FROM lms.students s
      JOIN lms.enrollments e ON e.student_id = s.id
      JOIN lms.courses c ON e.course_id = c.id
      JOIN lms.sections sec ON e.section_id = sec.id
      JOIN lms.subjects sub ON c.subject_id = sub.id
      WHERE sub.teacher_id = $1
      ORDER BY s.name
    `;
    
    const studentsResult = await pool.query(studentsQuery, [teacherId]);
    
    res.json({ 
      success: true, 
      students: studentsResult.rows 
    });
  } catch (error) {
    console.error('❌ Teacher students list error:', error);
    res.status(500).json({ error: 'Failed to load students' });
  }
});

// POST /api/teacher/enrollments
// Body: { course_id, section_id, student_ids: [1,2,3] }
// Idempotent: uses ON CONFLICT DO NOTHING based on unique(student_id, course_id, section_id)
router.post('/enrollments', verifyToken, authorizeTeacher, async (req, res) => {
  try {
    const { userId } = req.user;
    const { course_id, section_id, student_ids } = req.body;
    
    if (!course_id || !section_id || !Array.isArray(student_ids) || student_ids.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'course_id, section_id, and student_ids array are required' 
      });
    }

    // Verify teacher owns the subject that the course belongs to
    const courseCheck = await pool.query(
      `SELECT c.id, c.subject_id, s.teacher_id
       FROM lms.courses c
       JOIN lms.subjects s ON c.subject_id = s.id
       WHERE c.id = $1`,
      [course_id]
    );
    
    if (courseCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const teacherResult = await pool.query(
      'SELECT id FROM lms.teachers WHERE user_id = $1', 
      [userId]
    );
    
    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    
    const teacherId = teacherResult.rows[0].id;
    
    // Ensure teacher owns the subject
    if (courseCheck.rows[0].teacher_id && courseCheck.rows[0].teacher_id !== teacherId) {
      return res.status(403).json({ 
        error: 'Permission denied',
        message: 'You do not have permission to enroll students in this course' 
      });
    }

    // Insert enrollments (ON CONFLICT prevents duplicates)
    const enrollmentStmt = `
      INSERT INTO lms.enrollments (student_id, course_id, section_id, enrolled_at)
      VALUES ($1, $2, $3, NOW()) 
      ON CONFLICT (student_id, course_id, section_id) DO NOTHING 
      RETURNING id
    `;
    
    await pool.query('BEGIN');
    const inserted = [];
    
    for (const studentId of student_ids) {
      const result = await pool.query(enrollmentStmt, [studentId, course_id, section_id]);
      if (result.rows.length) {
        inserted.push(result.rows[0]);
      }
    }
    
    await pool.query('COMMIT');
    
    res.json({ 
      success: true, 
      inserted_count: inserted.length,
      total_attempted: student_ids.length,
      message: `Successfully enrolled ${inserted.length} student(s)`
    });
  } catch (error) {
    await pool.query('ROLLBACK').catch(() => {});
    console.error('❌ Enrollments error:', error);
    res.status(500).json({ error: 'Failed to enroll students' });
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

module.exports = router;