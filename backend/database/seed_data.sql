-- Seed data for subjects, courses, and sections

-- Insert Subjects
INSERT INTO lms.subjects (name, code, description) VALUES
('Data Structures and Algorithms', 'CS201', 'Learn fundamental data structures and algorithms'),
('Database Management Systems', 'CS301', 'Study of database design and SQL'),
('Web Development', 'CS302', 'Modern web development with HTML, CSS, JavaScript'),
('Operating Systems', 'CS303', 'Understanding OS concepts and system calls'),
('Computer Networks', 'CS304', 'Network protocols and architecture'),
('Software Engineering', 'CS305', 'Software development methodologies and practices'),
('Artificial Intelligence', 'CS401', 'Introduction to AI and machine learning'),
('Machine Learning', 'CS402', 'Advanced machine learning techniques'),
('Cloud Computing', 'CS403', 'Cloud platforms and distributed systems'),
('Mobile App Development', 'CS404', 'iOS and Android application development')
ON CONFLICT (code) DO NOTHING;

-- Insert Courses
INSERT INTO lms.courses (name, description) VALUES
('B.Tech Computer Science', 'Bachelor of Technology in Computer Science'),
('B.Tech Information Technology', 'Bachelor of Technology in Information Technology'),
('BCA', 'Bachelor of Computer Applications'),
('MCA', 'Master of Computer Applications'),
('M.Tech Computer Science', 'Master of Technology in Computer Science')
ON CONFLICT (name) DO NOTHING;

-- Insert Sections
INSERT INTO lms.sections (name) VALUES
('Section A'),
('Section B'),
('Section C'),
('Section D'),
('Section E')
ON CONFLICT (name) DO NOTHING;
