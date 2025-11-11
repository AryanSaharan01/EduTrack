# DATABASE RECOVERY GUIDE

## Problem
The database structure changed, causing the application to crash. The new schema removes the direct link between subjects and courses, introducing a many-to-many relationship through `teacher_subject_assignments`.

## Solution Steps

### STEP 1: BACKUP YOUR DATABASE (IMPORTANT!)
```bash
# PostgreSQL backup command
pg_dump -U your_username -d your_database_name > backup_$(date +%Y%m%d_%H%M%S).sql
```

### STEP 2: Run Migration Script
```bash
# Connect to PostgreSQL
psql -U your_username -d your_database_name

# Run the migration script
\i backend/database/migration.sql
```

OR manually run the migration.sql file I created.

### STEP 3: Verify Database Structure
```sql
-- Check if new tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'lms' 
AND table_name IN ('subjects', 'courses', 'sections', 'teacher_subject_assignments', 'enrollments');

-- Should return 5 rows
```

### STEP 4: Seed Required Data
```sql
-- Add courses (if not already added by migration)
INSERT INTO lms.courses (name, code, description) VALUES
('Computer Science', 'CS', 'Bachelor of Computer Science'),
('Information Technology', 'IT', 'Bachelor of Information Technology'),
('Software Engineering', 'SE', 'Bachelor of Software Engineering'),
('Data Science', 'DS', 'Bachelor of Data Science')
ON CONFLICT (code) DO NOTHING;

-- Add sections for each course
INSERT INTO lms.sections (course_id, name)
SELECT c.id, s.name
FROM lms.courses c
CROSS JOIN (VALUES ('A'), ('B'), ('C')) AS s(name)
ON CONFLICT (course_id, name) DO NOTHING;

-- Verify
SELECT c.name as course, s.name as section
FROM lms.courses c
JOIN lms.sections s ON c.id = s.course_id
ORDER BY c.name, s.name;
```

### STEP 5: Update Students Table (if needed)
Make sure students have course and section values that match your courses/sections:
```sql
-- Check current student data
SELECT DISTINCT course, section FROM lms.students;

-- If students have course codes that don't match, update them
-- Example: If students have 'BCS' but courses have 'CS'
UPDATE lms.students 
SET course = 'CS' 
WHERE course = 'BCS';

-- Add any missing students (example)
-- Make sure student.course matches courses.code
-- Make sure student.section matches sections.name
```

### STEP 6: Restart Your Application
```bash
# Stop the backend
# Restart the backend
npm run dev  # or your start command
```

## Common Errors and Fixes

### Error: "relation lms.subjects does not exist"
**Fix**: Run the migration.sql script

### Error: "column teacher_id does not exist in subjects"
**Fix**: You're using old queries. The teacher.js file has been updated.

### Error: "foreign key violation"
**Fix**: Make sure courses and sections exist before trying to create teacher_subject_assignments

### Error: "students.course value doesn't match courses.code"
**Fix**: Update student records to use correct course codes:
```sql
-- Check mismatches
SELECT DISTINCT s.course, c.code
FROM lms.students s
LEFT JOIN lms.courses c ON s.course = c.code
WHERE c.code IS NULL;

-- Fix them (example)
UPDATE lms.students SET course = 'CS' WHERE course IN ('BCS', 'CSE');
UPDATE lms.students SET course = 'IT' WHERE course IN ('BIT', 'BSIT');
```

## Verification Checklist

- [ ] All tables created successfully
- [ ] Courses table has at least 1 course
- [ ] Sections table has at least 1 section for each course
- [ ] Students table: all students.course values exist in courses.code
- [ ] Students table: all students.section values exist in sections.name
- [ ] Backend starts without database errors
- [ ] Frontend loads without errors
- [ ] Teacher can view dashboard
- [ ] Student can view dashboard

## Testing the New Flow

### 1. Test Teacher Workflow
```bash
# Login as teacher
# Navigate to /teacher/setup
# Create a new subject (e.g., "Data Structures", code: "DS101")
# Navigate to /teacher/subjects/assign
# Select the subject
# Select a course
# Select a section
# Select students
# Confirm assignment
```

### 2. Test Student Workflow
```bash
# Login as student
# Check dashboard - should see enrolled subjects
# Navigate to subjects page
# Verify can see subjects they're enrolled in
```

## Rollback (if needed)
```sql
-- Restore from backup
psql -U your_username -d your_database_name < your_backup_file.sql
```

## Need Help?
If errors persist, check:
1. PostgreSQL logs
2. Node.js console output
3. Browser console errors
4. Network tab in browser DevTools

## Database Schema Diagram (New Structure)
```
teachers (1) ----< teacher_subject_assignments >---- (M) subjects
                            |
                            |---- (M) courses
                            |
                            |---- (M) sections
                            |
                            V
                      enrollments >---- (M) students
```

Each teacher_subject_assignment represents:
- Teacher X teaches Subject Y to Course Z in Section W
- Students from Course Z, Section W can be enrolled
