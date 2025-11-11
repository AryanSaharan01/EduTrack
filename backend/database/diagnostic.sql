-- Database Diagnostic Script
-- Run this to check what's wrong with your database

-- 1. Check if schema exists
SELECT 'Schema Check' as test, 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'lms')
  THEN '✓ lms schema exists'
  ELSE '✗ lms schema MISSING'
  END as result;

-- 2. Check which tables exist
SELECT 'Table Existence' as test, 
  string_agg(table_name, ', ') as result
FROM information_schema.tables 
WHERE table_schema = 'lms'
GROUP BY table_schema;

-- 3. Check table structure - NEW vs OLD
SELECT 'subjects table structure' as test,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'lms' 
    AND table_name = 'subjects' 
    AND column_name = 'teacher_id'
  )
  THEN '✗ OLD structure (has teacher_id column)'
  ELSE '✓ NEW structure (no teacher_id column)'
  END as result;

SELECT 'courses table structure' as test,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'lms' 
    AND table_name = 'courses' 
    AND column_name = 'subject_id'
  )
  THEN '✗ OLD structure (has subject_id column)'
  ELSE '✓ NEW structure (no subject_id column)'
  END as result;

SELECT 'enrollments table structure' as test,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'lms' 
    AND table_name = 'enrollments' 
    AND column_name = 'teacher_subject_assignment_id'
  )
  THEN '✓ NEW structure (has teacher_subject_assignment_id)'
  ELSE '✗ OLD structure (missing teacher_subject_assignment_id)'
  END as result;

-- 4. Check if teacher_subject_assignments table exists
SELECT 'teacher_subject_assignments' as test,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'lms' 
    AND table_name = 'teacher_subject_assignments'
  )
  THEN '✓ Table exists (NEW structure)'
  ELSE '✗ Table MISSING (OLD structure)'
  END as result;

-- 5. Check data counts
SELECT 'users' as table_name, COUNT(*) as count FROM lms.users
UNION ALL
SELECT 'teachers', COUNT(*) FROM lms.teachers
UNION ALL
SELECT 'students', COUNT(*) FROM lms.students
UNION ALL
SELECT 'subjects', COUNT(*) FROM lms.subjects
UNION ALL
SELECT 'courses', COUNT(*) FROM lms.courses
UNION ALL
SELECT 'sections', COUNT(*) FROM lms.sections
UNION ALL
SELECT 'teacher_subject_assignments', COUNT(*) 
  FROM lms.teacher_subject_assignments
  WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'lms' AND table_name = 'teacher_subject_assignments')
UNION ALL
SELECT 'enrollments', COUNT(*) FROM lms.enrollments
UNION ALL
SELECT 'tasks', COUNT(*) FROM lms.tasks;

-- 6. Check for data integrity issues
SELECT 'Student course code validation' as test,
  CASE WHEN COUNT(*) = 0
  THEN '✓ All student courses match course codes'
  ELSE '✗ ' || COUNT(*) || ' students have invalid course codes'
  END as result
FROM lms.students s
LEFT JOIN lms.courses c ON s.course = c.code
WHERE c.id IS NULL;

SELECT 'Student section validation' as test,
  CASE WHEN COUNT(*) = 0
  THEN '✓ All student sections exist'
  ELSE '✗ ' || COUNT(*) || ' students have invalid sections'
  END as result
FROM lms.students s
LEFT JOIN lms.courses c ON s.course = c.code
LEFT JOIN lms.sections sec ON c.id = sec.course_id AND s.section = sec.name
WHERE c.id IS NOT NULL AND sec.id IS NULL;

-- 7. List students with their course/section info
SELECT 
  'Student Data Sample' as info,
  s.name as student_name,
  s.course as course_code,
  s.section as section_name,
  CASE WHEN c.id IS NOT NULL THEN '✓' ELSE '✗' END as course_exists,
  CASE WHEN sec.id IS NOT NULL THEN '✓' ELSE '✗' END as section_exists
FROM lms.students s
LEFT JOIN lms.courses c ON s.course = c.code
LEFT JOIN lms.sections sec ON c.id = sec.course_id AND s.section = sec.name
LIMIT 10;

-- 8. Final recommendation
SELECT 'RECOMMENDATION' as action,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'lms' AND table_name = 'teacher_subject_assignments')
    THEN 'RUN MIGRATION: Your database uses OLD structure. Run migration.sql'
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'lms' AND table_name = 'subjects' AND column_name = 'teacher_id')
    THEN 'RUN MIGRATION: Your subjects table still has teacher_id. Run migration.sql'
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'lms' AND table_name = 'courses' AND column_name = 'subject_id')
    THEN 'RUN MIGRATION: Your courses table still has subject_id. Run migration.sql'
    ELSE 'DATABASE IS UPDATED: Check application code for errors'
  END as recommendation;
