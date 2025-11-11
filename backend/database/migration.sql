-- Migration Script: Transition to new database structure
-- Run this AFTER backing up your database!

-- Step 1: Drop old foreign key constraints and indexes
DROP INDEX IF EXISTS lms.idx_subjects_teacher_id;
DROP INDEX IF EXISTS lms.idx_courses_subject_id;
DROP INDEX IF EXISTS lms.idx_enrollments_course_section;
DROP INDEX IF EXISTS lms.idx_tasks_teacher;
DROP INDEX IF EXISTS lms.idx_tasks_course_section;

-- Step 2: Backup existing data (optional but recommended)
CREATE TABLE IF NOT EXISTS lms.backup_subjects AS SELECT * FROM lms.subjects;
CREATE TABLE IF NOT EXISTS lms.backup_courses AS SELECT * FROM lms.courses;
CREATE TABLE IF NOT EXISTS lms.backup_enrollments AS SELECT * FROM lms.enrollments;
CREATE TABLE IF NOT EXISTS lms.backup_tasks AS SELECT * FROM lms.tasks;

-- Step 3: Drop old tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS lms.submissions CASCADE;
DROP TABLE IF EXISTS lms.task_questions CASCADE;
DROP TABLE IF EXISTS lms.tasks CASCADE;
DROP TABLE IF EXISTS lms.enrollments CASCADE;
DROP TABLE IF EXISTS lms.sections CASCADE;
DROP TABLE IF EXISTS lms.courses CASCADE;
DROP TABLE IF EXISTS lms.subjects CASCADE;

-- Step 4: Create new tables with updated structure
-- Subjects (independent, master list)
CREATE TABLE lms.subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Courses (independent, master list)
CREATE TABLE lms.courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sections (independent, master list)
CREATE TABLE lms.sections (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES lms.courses(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(course_id, name)
);

-- Teacher-Subject-Course-Section mapping
CREATE TABLE lms.teacher_subject_assignments (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER NOT NULL REFERENCES lms.teachers(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES lms.subjects(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES lms.courses(id) ON DELETE CASCADE,
    section_id INTEGER NOT NULL REFERENCES lms.sections(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(teacher_id, subject_id, course_id, section_id)
);

-- Student enrollments to teacher's subject via course and section
CREATE TABLE lms.enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES lms.students(id) ON DELETE CASCADE,
    teacher_subject_assignment_id INTEGER NOT NULL REFERENCES lms.teacher_subject_assignments(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id, teacher_subject_assignment_id)
);

-- Tasks created by teachers for specific subject assignments
CREATE TABLE lms.tasks (
    id SERIAL PRIMARY KEY,
    teacher_subject_assignment_id INTEGER NOT NULL REFERENCES lms.teacher_subject_assignments(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    time_limit_minutes INTEGER DEFAULT 60,
    deadline TIMESTAMP,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Task questions associated with tasks
CREATE TABLE lms.task_questions (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES lms.tasks(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    programming_language VARCHAR(50) DEFAULT 'python',
    expected_output TEXT DEFAULT NULL,
    marks INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(task_id, question_number)
);

-- Submissions by students for tasks
CREATE TABLE lms.submissions (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES lms.tasks(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES lms.students(id) ON DELETE CASCADE,
    submitted_at TIMESTAMP DEFAULT NOW(),
    total_marks_obtained INTEGER DEFAULT 0,
    submission_status VARCHAR(50) DEFAULT 'submitted' CHECK (submission_status IN ('submitted', 'graded', 'pending')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(task_id, student_id)
);

-- Answers given by students for each question
CREATE TABLE lms.submission_answers (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER NOT NULL REFERENCES lms.submissions(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES lms.task_questions(id) ON DELETE CASCADE,
    answer_code TEXT DEFAULT NULL,
    marks_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(submission_id, question_id)
);

-- Step 5: Create indexes for performance optimization
CREATE INDEX idx_students_course_section ON lms.students(course, section);
CREATE INDEX idx_sections_course_id ON lms.sections(course_id);
CREATE INDEX idx_teacher_subject_assignments_teacher ON lms.teacher_subject_assignments(teacher_id);
CREATE INDEX idx_teacher_subject_assignments_subject ON lms.teacher_subject_assignments(subject_id);
CREATE INDEX idx_teacher_subject_assignments_course_section ON lms.teacher_subject_assignments(course_id, section_id);
CREATE INDEX idx_enrollments_student ON lms.enrollments(student_id);
CREATE INDEX idx_enrollments_assignment ON lms.enrollments(teacher_subject_assignment_id);
CREATE INDEX idx_tasks_assignment ON lms.tasks(teacher_subject_assignment_id);
CREATE INDEX idx_tasks_status ON lms.tasks(status);
CREATE INDEX idx_task_questions_task ON lms.task_questions(task_id);
CREATE INDEX idx_submissions_task ON lms.submissions(task_id);
CREATE INDEX idx_submissions_student ON lms.submissions(student_id);
CREATE INDEX idx_submission_answers_submission ON lms.submission_answers(submission_id);

-- Step 6: Add comments for documentation
COMMENT ON TABLE lms.subjects IS 'Master list of academic subjects (independent)';
COMMENT ON TABLE lms.courses IS 'Master list of courses (independent)';
COMMENT ON TABLE lms.sections IS 'Class sections within courses';
COMMENT ON TABLE lms.teacher_subject_assignments IS 'Links teachers to subjects they teach for specific course-sections';
COMMENT ON TABLE lms.enrollments IS 'Student enrollments to teacher subject assignments';
COMMENT ON TABLE lms.tasks IS 'Coding tasks/assignments created by teachers';

-- Step 7: Seed with sample data (MODIFY THIS BASED ON YOUR NEEDS)
-- Add some sample courses
INSERT INTO lms.courses (name, code, description) VALUES
('Computer Science', 'CS', 'Bachelor of Computer Science'),
('Information Technology', 'IT', 'Bachelor of Information Technology'),
('Software Engineering', 'SE', 'Bachelor of Software Engineering')
ON CONFLICT (code) DO NOTHING;

-- Add some sample sections for each course
INSERT INTO lms.sections (course_id, name) VALUES
((SELECT id FROM lms.courses WHERE code = 'CS'), 'A'),
((SELECT id FROM lms.courses WHERE code = 'CS'), 'B'),
((SELECT id FROM lms.courses WHERE code = 'CS'), 'C'),
((SELECT id FROM lms.courses WHERE code = 'IT'), 'A'),
((SELECT id FROM lms.courses WHERE code = 'IT'), 'B'),
((SELECT id FROM lms.courses WHERE code = 'SE'), 'A')
ON CONFLICT (course_id, name) DO NOTHING;

-- Step 8: Verification queries
-- Check if tables were created successfully
SELECT 'Subjects' as table_name, COUNT(*) as count FROM lms.subjects
UNION ALL
SELECT 'Courses', COUNT(*) FROM lms.courses
UNION ALL
SELECT 'Sections', COUNT(*) FROM lms.sections
UNION ALL
SELECT 'Teacher Subject Assignments', COUNT(*) FROM lms.teacher_subject_assignments
UNION ALL
SELECT 'Enrollments', COUNT(*) FROM lms.enrollments
UNION ALL
SELECT 'Tasks', COUNT(*) FROM lms.tasks;

-- Success message
SELECT 'Migration completed successfully!' as status;
