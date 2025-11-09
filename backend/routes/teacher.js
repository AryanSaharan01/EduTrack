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
    const { name, phone, department } = req.body;

    const result = await pool.query(
      `UPDATE lms.teachers 
       SET name = $1, phone = $2, department = $3, updated_at = NOW()
       WHERE user_id = $4
       RETURNING *`,
      [name, phone, department, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json({
      success: true,
      teacher: result.rows[0]
    });
  } catch (error) {
    console.error("❌ Update Teacher Profile Error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;