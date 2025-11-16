-- Create schema
CREATE SCHEMA IF NOT EXISTS lms;

-- Users table for both teachers and students
CREATE TABLE lms.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'student')),
    otp_code VARCHAR(6),
    otp_expires_at TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Teachers table linked to users
CREATE TABLE lms.teachers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES lms.users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50), -- Your: employee_code
    name VARCHAR(255), -- Your: name
    phone VARCHAR(15) DEFAULT NULL, -- EXTRA - nullable
    department VARCHAR(100) DEFAULT 'Not Specified', -- EXTRA - default value
    qualification VARCHAR(255) DEFAULT NULL, -- EXTRA - nullable
    experience_years INTEGER DEFAULT 0, -- EXTRA - default 0
    bio TEXT DEFAULT NULL, -- EXTRA - nullable
    profile_image_url VARCHAR(255) DEFAULT NULL, -- EXTRA - nullable
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Students table linked to users
CREATE TABLE lms.students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES lms.users(id) ON DELETE CASCADE,
    roll_no VARCHAR(50), -- Your: roll_no
    name VARCHAR(255), -- Your: name
    course VARCHAR(100), -- Your: course
    section VARCHAR(50), -- Your: section
    phone VARCHAR(15) DEFAULT NULL, -- EXTRA - nullable
    profile_image_url VARCHAR(255) DEFAULT NULL, -- EXTRA - nullable
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

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

-- Notifications sent to students
CREATE TABLE lms.notifications (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT NOW()
);

-- Student notification read tracking
CREATE TABLE lms.student_notification_read (
    id SERIAL PRIMARY KEY,
    notification_id INTEGER NOT NULL REFERENCES lms.notifications(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES lms.students(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    UNIQUE(notification_id, student_id)
);

-- Indexes for performance optimization
CREATE INDEX idx_users_email ON lms.users(email);
CREATE INDEX idx_users_role ON lms.users(role);
CREATE INDEX idx_teachers_user_id ON lms.teachers(user_id);
CREATE INDEX idx_teachers_employee_id ON lms.teachers(employee_id);
CREATE INDEX idx_students_user_id ON lms.students(user_id);
CREATE INDEX idx_students_roll_no ON lms.students(roll_no);
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
CREATE INDEX idx_notification_read_student ON lms.student_notification_read(student_id);
CREATE INDEX idx_notification_read_notification ON lms.student_notification_read(notification_id);

-- Comments for documentation
COMMENT ON TABLE lms.users IS 'Stores authentication data for teachers and students';
COMMENT ON TABLE lms.teachers IS 'Extended profile information for teachers';
COMMENT ON TABLE lms.students IS 'Extended profile information for students';
COMMENT ON TABLE lms.subjects IS 'Master list of academic subjects (independent)';
COMMENT ON TABLE lms.courses IS 'Master list of courses (independent)';
COMMENT ON TABLE lms.sections IS 'Class sections within courses';
COMMENT ON TABLE lms.teacher_subject_assignments IS 'Links teachers to subjects they teach for specific course-sections';
COMMENT ON TABLE lms.enrollments IS 'Student enrollments to teacher subject assignments';
COMMENT ON TABLE lms.tasks IS 'Coding tasks/assignments created by teachers';
COMMENT ON TABLE lms.task_questions IS 'Individual questions within tasks';
COMMENT ON TABLE lms.submissions IS 'Student task submissions';
COMMENT ON TABLE lms.submission_answers IS 'Student answers for each question';
COMMENT ON TABLE lms.notifications IS 'System notifications';
COMMENT ON TABLE lms.student_notification_read IS 'Tracks which students have read notifications';

