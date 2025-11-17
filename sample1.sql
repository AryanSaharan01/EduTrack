--
-- PostgreSQL database dump
--

-- \restrict 9dD3xrfP4ETKpPExes89u6o8eDACIy1fpLsLzVDe0SZcht0Kxi7AbmKiAfkgj4x

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-16 01:54:24

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 16809)
-- Name: lms; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA IF NOT EXISTS lms;

ALTER SCHEMA lms OWNER TO CURRENT_USER;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 16889)
-- Name: courses; Type: TABLE; Schema: lms; Owner: postgres
--

CREATE TABLE lms.courses (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE lms.courses OWNER TO CURRENT_USER;

--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE courses; Type: COMMENT; Schema: lms; Owner: postgres
--

COMMENT ON TABLE lms.courses IS 'Master list of courses (independent)';

--
-- TOC entry 227 (class 1259 OID 16888)
-- Name: courses_id_seq; Type: SEQUENCE; Schema: lms; Owner: postgres
--

CREATE SEQUENCE lms.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE lms.courses_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 227
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: lms; Owner: postgres
--

ALTER SEQUENCE lms.courses_id_seq OWNED BY lms.courses.id;

--
-- TOC entry 234 (class 1259 OID 16960)
-- Name: enrollments; Type: TABLE; Schema: lms; Owner: postgres
--

CREATE TABLE lms.enrollments (
    id integer NOT NULL,
    student_id integer NOT NULL,
    teacher_subject_assignment_id integer NOT NULL,
    enrolled_at timestamp without time zone DEFAULT now()
);

ALTER TABLE lms.enrollments OWNER TO CURRENT_USER;

--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 234
-- Name: TABLE enrollments; Type: COMMENT; Schema: lms; Owner: postgres
--

COMMENT ON TABLE lms.enrollments IS 'Student enrollments to teacher subject assignments';

--
-- TOC entry 233 (class 1259 OID 16959)
-- Name: enrollments_id_seq; Type: SEQUENCE; Schema: lms; Owner: postgres
--

CREATE SEQUENCE lms.enrollments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE lms.enrollments_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 233
-- Name: enrollments_id_seq; Type: SEQUENCE OWNED BY; Schema: lms; Owner: postgres
--

ALTER SEQUENCE lms.enrollments_id_seq OWNED BY lms.enrollments.id;

--
-- TOC entry 244 (class 1259 OID 17086)
-- Name: notifications; Type: TABLE; Schema: lms; Owner: postgres
--

CREATE TABLE lms.notifications (
    id integer NOT NULL,
    message text NOT NULL,
    sent_at timestamp without time zone DEFAULT now()
);

ALTER TABLE lms.notifications OWNER TO CURRENT_USER;

--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 244
-- Name: TABLE notifications; Type: COMMENT; Schema: lms; Owner: postgres
--

COMMENT ON TABLE lms.notifications IS 'System notifications';

--
-- TOC entry 243 (class 1259 OID 17085)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: lms; Owner: postgres
--

CREATE SEQUENCE lms.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE lms.notifications_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 243
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: lms; Owner: postgres
--

ALTER SEQUENCE lms.notifications_id_seq OWNED BY lms.notifications.id;

--
-- TOC entry 230 (class 1259 OID 16905)
-- Name: sections; Type: TABLE; Schema: lms; Owner: postgres
--

CREATE TABLE lms.sections (
    id integer NOT NULL,
    course_id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE lms.sections OWNER TO CURRENT_USER;

--
-- TOC entry 5256 (class 0 OID 0)
-- Dependencies: 230
-- Name: TABLE sections; Type: COMMENT; Schema: lms; Owner: postgres
--

COMMENT ON TABLE lms.sections IS 'Class sections within courses';

--
-- TOC entry 229 (class 1259 OID 16904)
-- Name: sections_id_seq; Type: SEQUENCE; Schema: lms; Owner: postgres
--

CREATE SEQUENCE lms.sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE lms.sections_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 229
-- Name: sections_id_seq; Type: SEQUENCE OWNED BY; Schema: lms; Owner: postgres
--

ALTER SEQUENCE lms.sections_id_seq OWNED BY lms.sections.id;

--
-- TOC entry 246 (class 1259 OID 17098)
-- Name: student_notification_read; Type: TABLE; Schema: lms; Owner: postgres
--

CREATE TABLE lms.student_notification_read (
    id integer NOT NULL,
    notification_id integer NOT NULL,
    student_id integer NOT NULL,
    is_read boolean DEFAULT false,
    read_at timestamp without time zone
);

ALTER TABLE lms.student_notification_read OWNER TO CURRENT_USER;

--
-- TOC entry 5258 (class 0 OID 0)
-- Dependencies: 246
-- Name: TABLE student_notification_read; Type: COMMENT; Schema: lms; Owner: postgres
--

COMMENT ON TABLE lms.student_notification_read IS 'Tracks which students have read notifications';

--
-- TOC entry 245 (class 1259 OID 17097)
-- Name: student_notification_read_id_seq; Type: SEQUENCE; Schema: lms; Owner: postgres
--

CREATE SEQUENCE lms.student_notification_read_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE lms.student_notification_read_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5259 (class 0 OID 0)
-- Dependencies: 245
-- Name: student_notification_read_id_seq; Type: SEQUENCE OWNED BY; Schema: lms; Owner: postgres
--

ALTER SEQUENCE lms.student_notification_read_id_seq OWNED BY lms.student_notification_read.id;

--
-- TOC entry 224 (class 1259 OID 16851)
-- Name: students; Type: TABLE; Schema: lms; Owner: postgres
--

CREATE TABLE lms.students (
    id integer NOT NULL,
    user_id integer NOT NULL,
    roll_no character varying(50),
    name character varying(255),
    course character varying(100),
    section character varying(50),
    phone character varying(15) DEFAULT NULL::character varying,
    profile_image_url character varying(255) DEFAULT NULL::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE lms.students OWNER TO CURRENT_USER;

--
-- TOC entry 5260 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE students; Type: COMMENT; Schema: lms; Owner: postgres
--

COMMENT ON TABLE lms.students IS 'Extended profile information for students';

--
-- TOC entry 223 (class 1259 OID 16850)
-- Name: students_id_seq; Type: SEQUENCE; Schema: lms; Owner: postgres
--

CREATE SEQUENCE lms.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE lms.students_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5261 (class 0 OID 0)
-- Dependencies: 223
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: lms; Owner: postgres
--

ALTER SEQUENCE lms.students_id_seq OWNED BY lms.students.id;

--
-- TOC entry 226 (class 1259 OID 16873)
-- Name: subjects; Type: TABLE; Schema: lms; Owner: postgres
--

CREATE TABLE lms.subjects (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE lms.subjects OWNER TO CURRENT_USER;

--
-- TOC entry 5262 (class 0 OID 0)
-- Dependencies: 226
-- Name: TABLE subjects; Type: COMMENT; Schema: lms; Owner: postgres
--

COMMENT ON TABLE lms.subjects IS 'Master list of academic subjects (independent)';

--
-- TOC entry 225 (class 1259 OID 16872)
-- Name: subjects_id_seq; Type: SEQUENCE; Schema: lms; Owner: postgres
--

CREATE SEQUENCE lms.subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE lms.subjects_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5263 (class 0 OID 0)
-- Dependencies: 225
-- Name: subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: lms; Owner: postgres
--

ALTER SEQUENCE lms.subjects_id_seq OWNED BY lms.subjects.id;

--
-- TOC entry 242 (class 1259 OID 17059)
-- Name: submission_answers; Type: TABLE; Schema: lms; Owner: postgres
--

CREATE TABLE lms.submission_answers (
    id integer NOT NULL,
    submission_id integer NOT NULL,
    question_id integer NOT NULL,
    answer_code text,
    marks_awarded integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE lms.submission_answers OWNER TO CURRENT_USER;

--
-- TOC entry 5264 (class 0 OID 0)
-- Dependencies: 242
-- Name: TABLE submission_answers; Type: COMMENT; Schema: lms; Owner: postgres
--

COMMENT ON TABLE lms.submission_answers IS 'Student answers for each question';

--
-- TOC entry 241 (class 1259 OID 17058)
-- Name: submission_answers_id_seq; Type: SEQUENCE; Schema: lms; Owner: postgres
--

CREATE SEQUENCE lms.submission_answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE lms.submission_answers_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5265 (class 0 OID 0)
-- Dependencies: 241
-- Name: submission_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: lms; Owner: postgres
--

ALTER SEQUENCE lms.submission_answers_id_seq OWNED BY lms.submission_answers.id;

--
-- TOC entry 240 (class 1259 OID 17031)
-- Name: submissions; Type: TABLE; Schema: lms; Owner: postgres
--

CREATE TABLE lms.submissions (
    id integer NOT NULL,
    task_id integer NOT NULL,
    student_id integer NOT NULL,
    submitted_at timestamp without time zone DEFAULT now(),
    total_marks_obtained integer DEFAULT 0,
    submission_status character varying(50) DEFAULT 'submitted'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT submissions_submission_status_check CHECK (((submission_status)::text = ANY ((ARRAY['submitted'::character varying, 'graded'::character varying, 'pending'::character varying])::text[])))
);

ALTER TABLE lms.submissions OWNER TO CURRENT_USER;

--
-- TOC entry 5266 (class 0 OID 0)
-- Dependencies: 240
-- Name: TABLE submissions; Type: COMMENT; Schema: lms; Owner: postgres
--

COMMENT ON TABLE lms.submissions IS 'Student task submissions';

--
-- TOC entry 239 (class 1259 OID 17030)
-- Name: submissions_id_seq; Type: SEQUENCE; Schema: lms; Owner: postgres
--

CREATE SEQUENCE lms.submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE lms.submissions_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5267 (class 0 OID 0)
-- Dependencies: 239
-- Name: submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: lms; Owner: postgres
--

ALTER SEQUENCE lms.submissions_id_seq OWNED BY lms.submissions.id;

--
-- TOC entry 238 (class 1259 OID 17007)
-- Name: task_questions; Type: TABLE; Schema: lms; Owner: postgres
--

CREATE TABLE lms.task_questions (
    id integer NOT NULL,
    task_id integer NOT NULL,
    question_number integer NOT NULL,
    question_text text NOT NULL,
    programming_language character varying(50) DEFAULT 'python'::character varying,
    expected_output text,
    marks integer DEFAULT 10,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE lms.task_questions OWNER TO CURRENT_USER;

--
-- TOC entry 5268 (class 0 OID 0)
-- Dependencies: 238
-- Name: TABLE task_questions; Type: COMMENT; Schema: lms; Owner: postgres
--

COMMENT ON TABLE lms.task_questions IS 'Individual questions within tasks';

--
-- TOC entry 237 (class 1259 OID 17006)
-- Name: task_questions_id_seq; Type: SEQUENCE; Schema: lms; Owner: postgres
--

CREATE SEQUENCE lms.task_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE lms.task_questions_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5269 (class 0 OID 0)
-- Dependencies: 237
-- Name: task_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: lms; Owner: postgres
--

ALTER SEQUENCE lms.task_questions_id_seq OWNED BY lms.task_questions.id;

--
-- TOC entry 236 (class 1259 OID 16983)
-- Name: tasks; Type: TABLE; Schema: lms; Owner: postgres
--

CREATE TABLE lms.tasks (
    id integer NOT NULL,
    teacher_subject_assignment_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    difficulty character varying(20) DEFAULT 'medium'::character varying,
    time_limit_minutes integer DEFAULT 60,
    deadline timestamp without time zone,
    status character varying(20) DEFAULT 'draft'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT tasks_difficulty_check CHECK (((difficulty)::text = ANY ((ARRAY['easy'::character varying, 'medium'::character varying, 'hard'::character varying])::text[]))),
    CONSTRAINT tasks_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'published'::character varying, 'closed'::character varying])::text[])))
);

ALTER TABLE lms.tasks OWNER TO CURRENT_USER;

--
-- TOC entry 5270 (class 0 OID 0)
-- Dependencies: 236
-- Name: TABLE tasks; Type: COMMENT; Schema: lms; Owner: postgres
--

COMMENT ON TABLE lms.tasks IS 'Coding tasks/assignments created by teachers';

--
-- TOC entry 235 (class 1259 OID 16982)
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: lms; Owner: postgres
--

CREATE SEQUENCE lms.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE lms.tasks_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5271 (class 0 OID 0)
-- Dependencies: 235
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: lms; Owner: postgres
--

ALTER SEQUENCE lms.tasks_id_seq OWNED BY lms.tasks.id;

--
-- TOC entry 232 (class 1259 OID 16924)
-- Name: teacher_subject_assignments; Type: TABLE; Schema: lms; Owner: postgres
--

CREATE TABLE lms.teacher_subject_assignments (
    id integer NOT NULL,
    teacher_id integer NOT NULL,
    subject_id integer NOT NULL,
    course_id integer NOT NULL,
    section_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE lms.teacher_subject_assignments OWNER TO CURRENT_USER;

--
-- TOC entry 5272 (class 0 OID 0)
-- Dependencies: 232
-- Name: TABLE teacher_subject_assignments; Type: COMMENT; Schema: lms; Owner: postgres
--

COMMENT ON TABLE lms.teacher_subject_assignments IS 'Links teachers to subjects they teach for specific course-sections';

--
-- TOC entry 231 (class 1259 OID 16923)
-- Name: teacher_subject_assignments_id_seq; Type: SEQUENCE; Schema: lms; Owner: postgres
--

CREATE SEQUENCE lms.teacher_subject_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE lms.teacher_subject_assignments_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5273 (class 0 OID 0)
-- Dependencies: 231
-- Name: teacher_subject_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: lms; Owner: postgres
--

ALTER SEQUENCE lms.teacher_subject_assignments_id_seq OWNED BY lms.teacher_subject_assignments.id;

--
-- TOC entry 222 (class 1259 OID 16826)
-- Name: teachers; Type: TABLE; Schema: lms; Owner: postgres
--

CREATE TABLE lms.teachers (
    id integer NOT NULL,
    user_id integer NOT NULL,
    employee_id character varying(50),
    name character varying(255),
    phone character varying(15) DEFAULT NULL::character varying,
    department character varying(100) DEFAULT 'Not Specified'::character varying,
    qualification character varying(255) DEFAULT NULL::character varying,
    experience_years integer DEFAULT 0,
    bio text,
    profile_image_url character varying(255) DEFAULT NULL::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE lms.teachers OWNER TO CURRENT_USER;

--
-- TOC entry 5274 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE teachers; Type: COMMENT; Schema: lms; Owner: postgres
--

COMMENT ON TABLE lms.teachers IS 'Extended profile information for teachers';

--
-- TOC entry 221 (class 1259 OID 16825)
-- Name: teachers_id_seq; Type: SEQUENCE; Schema: lms; Owner: postgres
--

CREATE SEQUENCE lms.teachers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE lms.teachers_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5275 (class 0 OID 0)
-- Dependencies: 221
-- Name: teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: lms; Owner: postgres
--

ALTER SEQUENCE lms.teachers_id_seq OWNED BY lms.teachers.id;

--
-- TOC entry 220 (class 1259 OID 16811)
-- Name: users; Type: TABLE; Schema: lms; Owner: postgres
--

CREATE TABLE lms.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    otp_code character varying(6),
    otp_expires_at timestamp without time zone,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['teacher'::character varying, 'student'::character varying])::text[])))
);

ALTER TABLE lms.users OWNER TO CURRENT_USER;

--
-- TOC entry 5276 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE users; Type: COMMENT; Schema: lms; Owner: postgres
--

COMMENT ON TABLE lms.users IS 'Stores authentication data for teachers and students';

--
-- TOC entry 219 (class 1259 OID 16810)
-- Name: users_id_seq; Type: SEQUENCE; Schema: lms; Owner: postgres
--

CREATE SEQUENCE lms.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE lms.users_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5277 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: lms; Owner: postgres
--

ALTER SEQUENCE lms.users_id_seq OWNED BY lms.users.id;

--
-- TOC entry 4940 (class 2604 OID 16892)
-- Name: courses id; Type: DEFAULT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.courses ALTER COLUMN id SET DEFAULT nextval('lms.courses_id_seq'::regclass);

--
-- TOC entry 4949 (class 2604 OID 16963)
-- Name: enrollments id; Type: DEFAULT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.enrollments ALTER COLUMN id SET DEFAULT nextval('lms.enrollments_id_seq'::regclass);

--
-- TOC entry 4972 (class 2604 OID 17089)
-- Name: notifications id; Type: DEFAULT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.notifications ALTER COLUMN id SET DEFAULT nextval('lms.notifications_id_seq'::regclass);

--
-- TOC entry 4943 (class 2604 OID 16908)
-- Name: sections id; Type: DEFAULT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.sections ALTER COLUMN id SET DEFAULT nextval('lms.sections_id_seq'::regclass);

--
-- TOC entry 4974 (class 2604 OID 17101)
-- Name: student_notification_read id; Type: DEFAULT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.student_notification_read ALTER COLUMN id SET DEFAULT nextval('lms.student_notification_read_id_seq'::regclass);

--
-- TOC entry 4932 (class 2604 OID 16854)
-- Name: students id; Type: DEFAULT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.students ALTER COLUMN id SET DEFAULT nextval('lms.students_id_seq'::regclass);

--
-- TOC entry 4937 (class 2604 OID 16876)
-- Name: subjects id; Type: DEFAULT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.subjects ALTER COLUMN id SET DEFAULT nextval('lms.subjects_id_seq'::regclass);

--
-- TOC entry 4968 (class 2604 OID 17062)
-- Name: submission_answers id; Type: DEFAULT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.submission_answers ALTER COLUMN id SET DEFAULT nextval('lms.submission_answers_id_seq'::regclass);

--
-- TOC entry 4962 (class 2604 OID 17034)
-- Name: submissions id; Type: DEFAULT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.submissions ALTER COLUMN id SET DEFAULT nextval('lms.submissions_id_seq'::regclass);

--
-- TOC entry 4957 (class 2604 OID 17010)
-- Name: task_questions id; Type: DEFAULT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.task_questions ALTER COLUMN id SET DEFAULT nextval('lms.task_questions_id_seq'::regclass);

--
-- TOC entry 4951 (class 2604 OID 16986)
-- Name: tasks id; Type: DEFAULT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.tasks ALTER COLUMN id SET DEFAULT nextval('lms.tasks_id_seq'::regclass);

--
-- TOC entry 4946 (class 2604 OID 16927)
-- Name: teacher_subject_assignments id; Type: DEFAULT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.teacher_subject_assignments ALTER COLUMN id SET DEFAULT nextval('lms.teacher_subject_assignments_id_seq'::regclass);

--
-- TOC entry 4924 (class 2604 OID 16829)
-- Name: teachers id; Type: DEFAULT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.teachers ALTER COLUMN id SET DEFAULT nextval('lms.teachers_id_seq'::regclass);

--
-- TOC entry 4921 (class 2604 OID 16814)
-- Name: users id; Type: DEFAULT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.users ALTER COLUMN id SET DEFAULT nextval('lms.users_id_seq'::regclass);

--
-- TOC entry 5226 (class 0 OID 16889)
-- Dependencies: 228
-- Data for Name: courses; Type: TABLE DATA; Schema: lms; Owner: postgres
--

INSERT INTO lms.courses (id, name, code, description, created_at, updated_at) VALUES ('1', 'B.Tech CSE (Core)', 'CSE101', 'Bachelor of Technology in Computer Science Engineering.', '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.courses (id, name, code, description, created_at, updated_at) VALUES ('2', 'B.Tech CSE (AI/ML)', 'AIML201', 'B.Tech specialization in Artificial Intelligence and Machine Learning.', '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.courses (id, name, code, description, created_at, updated_at) VALUES ('3', 'B.Tech CSE (UI/UX)', 'UIUX301', 'B.Tech specialization in User Interface and User Experience Design.', '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');

--
-- TOC entry 5232 (class 0 OID 16960)
-- Dependencies: 234
-- Data for Name: enrollments; Type: TABLE DATA; Schema: lms; Owner: postgres
--

INSERT INTO lms.enrollments (id, student_id, teacher_subject_assignment_id, enrolled_at) VALUES ('1', '3', '1', '2025-11-12 03:56:22.108188');
INSERT INTO lms.enrollments (id, student_id, teacher_subject_assignment_id, enrolled_at) VALUES ('2', '1', '1', '2025-11-12 03:56:22.108188');
INSERT INTO lms.enrollments (id, student_id, teacher_subject_assignment_id, enrolled_at) VALUES ('3', '4', '1', '2025-11-12 03:56:22.108188');
INSERT INTO lms.enrollments (id, student_id, teacher_subject_assignment_id, enrolled_at) VALUES ('4', '2', '1', '2025-11-12 03:56:22.108188');
INSERT INTO lms.enrollments (id, student_id, teacher_subject_assignment_id, enrolled_at) VALUES ('5', '5', '1', '2025-11-12 03:56:22.108188');
INSERT INTO lms.enrollments (id, student_id, teacher_subject_assignment_id, enrolled_at) VALUES ('6', '3', '2', '2025-11-12 12:20:23.556558');
INSERT INTO lms.enrollments (id, student_id, teacher_subject_assignment_id, enrolled_at) VALUES ('7', '1', '2', '2025-11-12 12:20:23.556558');
INSERT INTO lms.enrollments (id, student_id, teacher_subject_assignment_id, enrolled_at) VALUES ('8', '4', '2', '2025-11-12 12:20:23.556558');
INSERT INTO lms.enrollments (id, student_id, teacher_subject_assignment_id, enrolled_at) VALUES ('9', '2', '2', '2025-11-12 12:20:23.556558');
INSERT INTO lms.enrollments (id, student_id, teacher_subject_assignment_id, enrolled_at) VALUES ('10', '5', '2', '2025-11-12 12:20:23.556558');

--
-- TOC entry 5242 (class 0 OID 17086)
-- Dependencies: 244
-- Data for Name: notifications; Type: TABLE DATA; Schema: lms; Owner: postgres
--




--
-- TOC entry 5228 (class 0 OID 16905)
-- Dependencies: 230
-- Data for Name: sections; Type: TABLE DATA; Schema: lms; Owner: postgres
--

INSERT INTO lms.sections (id, course_id, name, created_at, updated_at) VALUES ('1', '2', 'Section A', '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.sections (id, course_id, name, created_at, updated_at) VALUES ('2', '3', 'Section B', '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');

--
-- TOC entry 5244 (class 0 OID 17098)
-- Dependencies: 246
-- Data for Name: student_notification_read; Type: TABLE DATA; Schema: lms; Owner: postgres
--




--
-- TOC entry 5222 (class 0 OID 16851)
-- Dependencies: 224
-- Data for Name: students; Type: TABLE DATA; Schema: lms; Owner: postgres
--

INSERT INTO lms.students (id, user_id, roll_no, name, course, section, phone, profile_image_url, created_at, updated_at) VALUES ('1', '3', 'AIML2201', 'Aryan Saharan', 'B.Tech CSE (AI/ML)', 'A', '8.899776655e+09', NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.students (id, user_id, roll_no, name, course, section, phone, profile_image_url, created_at, updated_at) VALUES ('2', '4', 'AIML2202', 'Riya Sharma', 'B.Tech CSE (AI/ML)', 'A', '9.988776655e+09', NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.students (id, user_id, roll_no, name, course, section, phone, profile_image_url, created_at, updated_at) VALUES ('3', '5', 'AIML2203', 'Aditya Patel', 'B.Tech CSE (AI/ML)', 'A', '9.877665544e+09', NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.students (id, user_id, roll_no, name, course, section, phone, profile_image_url, created_at, updated_at) VALUES ('4', '6', 'AIML2204', 'Kavya Rao', 'B.Tech CSE (AI/ML)', 'A', '8.765432109e+09', NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.students (id, user_id, roll_no, name, course, section, phone, profile_image_url, created_at, updated_at) VALUES ('5', '7', 'AIML2205', 'Sarthak Jain', 'B.Tech CSE (AI/ML)', 'A', '9.09090909e+09', NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.students (id, user_id, roll_no, name, course, section, phone, profile_image_url, created_at, updated_at) VALUES ('6', '8', 'CSE2301', 'Priya Mehra', 'B.Tech CSE (UI/UX)', 'B', '9.81234567e+09', NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.students (id, user_id, roll_no, name, course, section, phone, profile_image_url, created_at, updated_at) VALUES ('7', '9', 'CSE2302', 'Devansh Bansal', 'B.Tech CSE (UI/UX)', 'B', '9.823456781e+09', NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.students (id, user_id, roll_no, name, course, section, phone, profile_image_url, created_at, updated_at) VALUES ('8', '10', 'CSE2303', 'Isha Kapoor', 'B.Tech CSE (UI/UX)', 'B', '9.834567892e+09', NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.students (id, user_id, roll_no, name, course, section, phone, profile_image_url, created_at, updated_at) VALUES ('9', '11', 'CSE2304', 'Yash Goel', 'B.Tech CSE (UI/UX)', 'B', '9.845678903e+09', NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.students (id, user_id, roll_no, name, course, section, phone, profile_image_url, created_at, updated_at) VALUES ('10', '12', 'CSE2305', 'Tanya Rajput', 'B.Tech CSE (UI/UX)', 'B', '9.856789014e+09', NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');

--
-- TOC entry 5224 (class 0 OID 16873)
-- Dependencies: 226
-- Data for Name: subjects; Type: TABLE DATA; Schema: lms; Owner: postgres
--

INSERT INTO lms.subjects (id, name, code, description, created_at, updated_at) VALUES ('1', 'Data Structures and Algorithms', 'DSA101', 'Covers stacks, queues, trees, graphs, and complexity analysis.', '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.subjects (id, name, code, description, created_at, updated_at) VALUES ('2', 'Java Programming', 'JAVA201', 'Object-oriented programming with Java language.', '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.subjects (id, name, code, description, created_at, updated_at) VALUES ('3', 'Python Programming', 'PY301', 'Python basics, libraries, and application development.', '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.subjects (id, name, code, description, created_at, updated_at) VALUES ('4', 'Database Management Systems', 'DB401', 'Study of relational databases and SQL.', '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.subjects (id, name, code, description, created_at, updated_at) VALUES ('5', 'Operating Systems', 'OS501', 'Concepts of process scheduling, memory, and file systems.', '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.subjects (id, name, code, description, created_at, updated_at) VALUES ('6', 'Computer Networks', 'CN601', 'Covers network topologies, protocols, and communication models.', '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');

--
-- TOC entry 5240 (class 0 OID 17059)
-- Dependencies: 242
-- Data for Name: submission_answers; Type: TABLE DATA; Schema: lms; Owner: postgres
--

INSERT INTO lms.submission_answers (id, submission_id, question_id, answer_code, marks_awarded, created_at, updated_at) VALUES ('1', '1', '1', '# Question 1\n# Write your code here\n\nx = 5\ny = 098\n\nprint (x+y)', '5', '2025-11-13 01:45:15.149585', '2025-11-13 01:45:15.149585');
INSERT INTO lms.submission_answers (id, submission_id, question_id, answer_code, marks_awarded, created_at, updated_at) VALUES ('2', '1', '2', '# Question 2\n# Write your code here\n\ndsa= 123 + 34\nfl = 23+34-432\n\nprint(dsa*fl)', '4', '2025-11-13 01:45:15.149585', '2025-11-13 01:45:15.149585');
INSERT INTO lms.submission_answers (id, submission_id, question_id, answer_code, marks_awarded, created_at, updated_at) VALUES ('3', '2', '3', 'public class AddNumbers {\n    public static void main(String[] args) {\n        int num1 = 5;\n        int num2 = 10;\n        int sum = num1 + num2;\n        System.out.println(\"The sum of \" + num1 + \" and \" + num2 + \" is: \" + sum);\n    }\n}\n', '5', '2025-11-13 12:55:46.121254', '2025-11-14 00:19:19.687242');
INSERT INTO lms.submission_answers (id, submission_id, question_id, answer_code, marks_awarded, created_at, updated_at) VALUES ('4', '2', '4', 'public class AddNumbers {\n    public static void main(String[] args) {\n        int num1 = 5;\n        int num2 = 10;\n        int sum = num1 + num2;\n        System.out.println(\"The sum of \" + num1 + \" and \" + num2 + \" is: \" + sum);\n    }\n}\n', '3', '2025-11-13 12:55:46.121254', '2025-11-14 00:19:19.687242');
INSERT INTO lms.submission_answers (id, submission_id, question_id, answer_code, marks_awarded, created_at, updated_at) VALUES ('5', '2', '5', '# Question 3\n# Write your code here\n\npublic class AddNumbers {\n    public static void main(String[] args) {\n        int num1 = 5;\n        int num2 = 10;\n        int sum = num1 + num2;\n        System.out.println(\"The sum of \" + num1 + \" and \" + num2 + \" is: \" + sum);\n    }\n}\n', '4', '2025-11-13 12:55:46.121254', '2025-11-14 00:19:19.687242');

--
-- TOC entry 5238 (class 0 OID 17031)
-- Dependencies: 240
-- Data for Name: submissions; Type: TABLE DATA; Schema: lms; Owner: postgres
--

INSERT INTO lms.submissions (id, task_id, student_id, submitted_at, total_marks_obtained, submission_status, created_at, updated_at) VALUES ('1', '1', '1', '2025-11-13 01:45:15.149585', '9', 'graded', '2025-11-13 01:45:15.149585', '2025-11-13 02:09:46.376543');
INSERT INTO lms.submissions (id, task_id, student_id, submitted_at, total_marks_obtained, submission_status, created_at, updated_at) VALUES ('2', '2', '1', '2025-11-13 12:55:46.121254', '12', 'graded', '2025-11-13 12:55:46.121254', '2025-11-14 00:19:30.563225');

--
-- TOC entry 5236 (class 0 OID 17007)
-- Dependencies: 238
-- Data for Name: task_questions; Type: TABLE DATA; Schema: lms; Owner: postgres
--

INSERT INTO lms.task_questions (id, task_id, question_number, question_text, programming_language, expected_output, marks, created_at, updated_at) VALUES ('1', '1', '1', 'sample Question 1 with nothing to say about anything. ', 'python', '123r234', '5', '2025-11-12 22:13:51.876482', '2025-11-12 22:13:51.876482');
INSERT INTO lms.task_questions (id, task_id, question_number, question_text, programming_language, expected_output, marks, created_at, updated_at) VALUES ('2', '1', '2', 'Helooo Question 2 with many things to say about my new project i dont know what i am writing.', 'python', 'ndfiunwsk 123', '5', '2025-11-12 22:13:51.876482', '2025-11-12 22:13:51.876482');
INSERT INTO lms.task_questions (id, task_id, question_number, question_text, programming_language, expected_output, marks, created_at, updated_at) VALUES ('3', '2', '1', 'Basic Addition of Two Numbers', 'java', 'The sum of 5 and 10 is: 15\n', '5', '2025-11-13 12:54:15.609175', '2025-11-13 12:54:15.609175');
INSERT INTO lms.task_questions (id, task_id, question_number, question_text, programming_language, expected_output, marks, created_at, updated_at) VALUES ('4', '2', '2', 'Check if a Number is Even or Odd', 'python', '7 is odd.\n', '1', '2025-11-13 12:54:15.609175', '2025-11-13 12:54:15.609175');
INSERT INTO lms.task_questions (id, task_id, question_number, question_text, programming_language, expected_output, marks, created_at, updated_at) VALUES ('5', '2', '3', 'Simple Loop to Print Numbers 1 to 5', 'python', '1\n2\n3\n4\n5', '5', '2025-11-13 12:54:15.609175', '2025-11-13 12:54:15.609175');
INSERT INTO lms.task_questions (id, task_id, question_number, question_text, programming_language, expected_output, marks, created_at, updated_at) VALUES ('6', '3', '1', 'sample question 1', 'javascript', 'sdh sadf sdc psdnc', '25', '2025-11-13 18:31:01.851046', '2025-11-13 18:31:01.851046');

--
-- TOC entry 5234 (class 0 OID 16983)
-- Dependencies: 236
-- Data for Name: tasks; Type: TABLE DATA; Schema: lms; Owner: postgres
--

INSERT INTO lms.tasks (id, teacher_subject_assignment_id, title, description, difficulty, time_limit_minutes, deadline, status, created_at, updated_at) VALUES ('1', '1', 'Sample Taks', 'its just sample DB checking process to see how this will look in students dashboard and i want to see its functionality', 'medium', '60', '2025-11-13 22:11:00', 'published', '2025-11-12 22:13:51.876482', '2025-11-12 22:13:51.876482');
INSERT INTO lms.tasks (id, teacher_subject_assignment_id, title, description, difficulty, time_limit_minutes, deadline, status, created_at, updated_at) VALUES ('2', '2', 'Java Fundamentals: Arithmetic Operations, Conditionals, and Loops', 'In this task, you will implement a Java program that covers essential programming concepts including arithmetic operations, conditionals, and loops.', 'medium', '60', '2025-11-15 12:50:00', 'published', '2025-11-13 12:54:15.609175', '2025-11-13 12:54:15.609175');
INSERT INTO lms.tasks (id, teacher_subject_assignment_id, title, description, difficulty, time_limit_minutes, deadline, status, created_at, updated_at) VALUES ('3', '1', 'sample 2', 'fxcghj khgh  iu lihilh iug ih ihou ', 'hard', '45', '2025-11-14 18:29:00', 'published', '2025-11-13 18:31:01.851046', '2025-11-13 18:31:01.851046');

--
-- TOC entry 5230 (class 0 OID 16924)
-- Dependencies: 232
-- Data for Name: teacher_subject_assignments; Type: TABLE DATA; Schema: lms; Owner: postgres
--

INSERT INTO lms.teacher_subject_assignments (id, teacher_id, subject_id, course_id, section_id, created_at, updated_at) VALUES ('1', '2', '1', '2', '1', '2025-11-12 03:56:22.108188', '2025-11-12 03:56:22.108188');
INSERT INTO lms.teacher_subject_assignments (id, teacher_id, subject_id, course_id, section_id, created_at, updated_at) VALUES ('2', '2', '2', '2', '1', '2025-11-12 12:20:23.556558', '2025-11-12 12:20:23.556558');

--
-- TOC entry 5220 (class 0 OID 16826)
-- Dependencies: 222
-- Data for Name: teachers; Type: TABLE DATA; Schema: lms; Owner: postgres
--

INSERT INTO lms.teachers (id, user_id, employee_id, name, phone, department, qualification, experience_years, bio, profile_image_url, created_at, updated_at) VALUES ('1', '1', 'EMP101', 'Dr. Meera Singh', '9.87654321e+09', 'Computer Science', 'Ph.D. in AI & ML', '10', NULL, NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.teachers (id, user_id, employee_id, name, phone, department, qualification, experience_years, bio, profile_image_url, created_at, updated_at) VALUES ('2', '2', 'EMP102', 'Prof. Arish S Singh', '9.823456789e+09', 'Information Technology', 'M.Tech in Software Systems', '8', NULL, NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');

--
-- TOC entry 5218 (class 0 OID 16811)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: lms; Owner: postgres
--

INSERT INTO lms.users (id, email, role, otp_code, otp_expires_at, last_login, created_at, updated_at) VALUES ('1', 'meera.singh@kru.edu.in', 'teacher', NULL, NULL, NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.users (id, email, role, otp_code, otp_expires_at, last_login, created_at, updated_at) VALUES ('4', 'riya.sharma@kru.edu.in', 'student', NULL, NULL, NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.users (id, email, role, otp_code, otp_expires_at, last_login, created_at, updated_at) VALUES ('5', 'aditya.patel@kru.edu.in', 'student', NULL, NULL, NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.users (id, email, role, otp_code, otp_expires_at, last_login, created_at, updated_at) VALUES ('6', 'kavya.rao@kru.edu.in', 'student', NULL, NULL, NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.users (id, email, role, otp_code, otp_expires_at, last_login, created_at, updated_at) VALUES ('7', 'sarthak.jain@kru.edu.in', 'student', NULL, NULL, NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.users (id, email, role, otp_code, otp_expires_at, last_login, created_at, updated_at) VALUES ('8', 'priya.mehra@kru.edu.in', 'student', NULL, NULL, NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.users (id, email, role, otp_code, otp_expires_at, last_login, created_at, updated_at) VALUES ('9', 'devansh.bansal@kru.edu.in', 'student', NULL, NULL, NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.users (id, email, role, otp_code, otp_expires_at, last_login, created_at, updated_at) VALUES ('10', 'isha.kapoor@kru.edu.in', 'student', NULL, NULL, NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.users (id, email, role, otp_code, otp_expires_at, last_login, created_at, updated_at) VALUES ('11', 'yash.goel@kru.edu.in', 'student', NULL, NULL, NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.users (id, email, role, otp_code, otp_expires_at, last_login, created_at, updated_at) VALUES ('12', 'tanya.rajput@kru.edu.in', 'student', NULL, NULL, NULL, '2025-11-12 02:48:36.53999', '2025-11-12 02:48:36.53999');
INSERT INTO lms.users (id, email, role, otp_code, otp_expires_at, last_login, created_at, updated_at) VALUES ('13', 'arryan.saharan004@gmail.com', 'teacher', '814717', '2025-11-13 00:47:34.9', NULL, '2025-11-13 00:37:34.983995', '2025-11-13 00:37:34.983995');
INSERT INTO lms.users (id, email, role, otp_code, otp_expires_at, last_login, created_at, updated_at) VALUES ('14', 'aryan@gmail.com', 'teacher', '509727', '2025-11-13 00:47:58.423', NULL, '2025-11-13 00:37:58.426193', '2025-11-13 00:37:58.426193');
INSERT INTO lms.users (id, email, role, otp_code, otp_expires_at, last_login, created_at, updated_at) VALUES ('3', '2.201010069e+09@krmu.edu.in', 'student', NULL, NULL, '2025-11-16 00:45:00.654668', '2025-11-12 02:48:36.53999', '2025-11-16 00:44:40.042188');
INSERT INTO lms.users (id, email, role, otp_code, otp_expires_at, last_login, created_at, updated_at) VALUES ('2', 'aryan.saharan004@gmail.com', 'teacher', NULL, NULL, '2025-11-16 00:45:42.958218', '2025-11-12 02:48:36.53999', '2025-11-16 00:45:22.695784');

--
-- TOC entry 5278 (class 0 OID 0)
-- Dependencies: 227
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: postgres
--

SELECT pg_catalog.setval('lms.courses_id_seq', 3, true);

--
-- TOC entry 5279 (class 0 OID 0)
-- Dependencies: 233
-- Name: enrollments_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: postgres
--

SELECT pg_catalog.setval('lms.enrollments_id_seq', 10, true);

--
-- TOC entry 5280 (class 0 OID 0)
-- Dependencies: 243
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: postgres
--

SELECT pg_catalog.setval('lms.notifications_id_seq', 1, false);

--
-- TOC entry 5281 (class 0 OID 0)
-- Dependencies: 229
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: postgres
--

SELECT pg_catalog.setval('lms.sections_id_seq', 2, true);

--
-- TOC entry 5282 (class 0 OID 0)
-- Dependencies: 245
-- Name: student_notification_read_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: postgres
--

SELECT pg_catalog.setval('lms.student_notification_read_id_seq', 1, false);

--
-- TOC entry 5283 (class 0 OID 0)
-- Dependencies: 223
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: postgres
--

SELECT pg_catalog.setval('lms.students_id_seq', 10, true);

--
-- TOC entry 5284 (class 0 OID 0)
-- Dependencies: 225
-- Name: subjects_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: postgres
--

SELECT pg_catalog.setval('lms.subjects_id_seq', 6, true);

--
-- TOC entry 5285 (class 0 OID 0)
-- Dependencies: 241
-- Name: submission_answers_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: postgres
--

SELECT pg_catalog.setval('lms.submission_answers_id_seq', 5, true);

--
-- TOC entry 5286 (class 0 OID 0)
-- Dependencies: 239
-- Name: submissions_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: postgres
--

SELECT pg_catalog.setval('lms.submissions_id_seq', 3, true);

--
-- TOC entry 5287 (class 0 OID 0)
-- Dependencies: 237
-- Name: task_questions_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: postgres
--

SELECT pg_catalog.setval('lms.task_questions_id_seq', 6, true);

--
-- TOC entry 5288 (class 0 OID 0)
-- Dependencies: 235
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: postgres
--

SELECT pg_catalog.setval('lms.tasks_id_seq', 3, true);

--
-- TOC entry 5289 (class 0 OID 0)
-- Dependencies: 231
-- Name: teacher_subject_assignments_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: postgres
--

SELECT pg_catalog.setval('lms.teacher_subject_assignments_id_seq', 2, true);

--
-- TOC entry 5290 (class 0 OID 0)
-- Dependencies: 221
-- Name: teachers_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: postgres
--

SELECT pg_catalog.setval('lms.teachers_id_seq', 2, true);

--
-- TOC entry 5291 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: postgres
--

SELECT pg_catalog.setval('lms.users_id_seq', 15, true);

--
-- TOC entry 5004 (class 2606 OID 16903)
-- Name: courses courses_code_key; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.courses
    ADD CONSTRAINT courses_code_key UNIQUE (code);

--
-- TOC entry 5006 (class 2606 OID 16901)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);

--
-- TOC entry 5020 (class 2606 OID 16969)
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);

--
-- TOC entry 5022 (class 2606 OID 16971)
-- Name: enrollments enrollments_student_id_teacher_subject_assignment_id_key; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.enrollments
    ADD CONSTRAINT enrollments_student_id_teacher_subject_assignment_id_key UNIQUE (student_id, teacher_subject_assignment_id);

--
-- TOC entry 5046 (class 2606 OID 17096)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);

--
-- TOC entry 5009 (class 2606 OID 16917)
-- Name: sections sections_course_id_name_key; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.sections
    ADD CONSTRAINT sections_course_id_name_key UNIQUE (course_id, name);

--
-- TOC entry 5011 (class 2606 OID 16915)
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);

--
-- TOC entry 5050 (class 2606 OID 17109)
-- Name: student_notification_read student_notification_read_notification_id_student_id_key; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.student_notification_read
    ADD CONSTRAINT student_notification_read_notification_id_student_id_key UNIQUE (notification_id, student_id);

--
-- TOC entry 5052 (class 2606 OID 17107)
-- Name: student_notification_read student_notification_read_pkey; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.student_notification_read
    ADD CONSTRAINT student_notification_read_pkey PRIMARY KEY (id);

--
-- TOC entry 4996 (class 2606 OID 16864)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);

--
-- TOC entry 4998 (class 2606 OID 16866)
-- Name: students students_user_id_key; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.students
    ADD CONSTRAINT students_user_id_key UNIQUE (user_id);

--
-- TOC entry 5000 (class 2606 OID 16887)
-- Name: subjects subjects_code_key; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.subjects
    ADD CONSTRAINT subjects_code_key UNIQUE (code);

--
-- TOC entry 5002 (class 2606 OID 16885)
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);

--
-- TOC entry 5042 (class 2606 OID 17072)
-- Name: submission_answers submission_answers_pkey; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.submission_answers
    ADD CONSTRAINT submission_answers_pkey PRIMARY KEY (id);

--
-- TOC entry 5044 (class 2606 OID 17074)
-- Name: submission_answers submission_answers_submission_id_question_id_key; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.submission_answers
    ADD CONSTRAINT submission_answers_submission_id_question_id_key UNIQUE (submission_id, question_id);

--
-- TOC entry 5037 (class 2606 OID 17045)
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);

--
-- TOC entry 5039 (class 2606 OID 17047)
-- Name: submissions submissions_task_id_student_id_key; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.submissions
    ADD CONSTRAINT submissions_task_id_student_id_key UNIQUE (task_id, student_id);

--
-- TOC entry 5031 (class 2606 OID 17022)
-- Name: task_questions task_questions_pkey; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.task_questions
    ADD CONSTRAINT task_questions_pkey PRIMARY KEY (id);

--
-- TOC entry 5033 (class 2606 OID 17024)
-- Name: task_questions task_questions_task_id_question_number_key; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.task_questions
    ADD CONSTRAINT task_questions_task_id_question_number_key UNIQUE (task_id, question_number);

--
-- TOC entry 5028 (class 2606 OID 17000)
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);

--
-- TOC entry 5016 (class 2606 OID 16936)
-- Name: teacher_subject_assignments teacher_subject_assignments_pkey; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.teacher_subject_assignments
    ADD CONSTRAINT teacher_subject_assignments_pkey PRIMARY KEY (id);

--
-- TOC entry 5018 (class 2606 OID 16938)
-- Name: teacher_subject_assignments teacher_subject_assignments_teacher_id_subject_id_course_id_key; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.teacher_subject_assignments
    ADD CONSTRAINT teacher_subject_assignments_teacher_id_subject_id_course_id_key UNIQUE (teacher_id, subject_id, course_id, section_id);

--
-- TOC entry 4989 (class 2606 OID 16842)
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);

--
-- TOC entry 4991 (class 2606 OID 16844)
-- Name: teachers teachers_user_id_key; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.teachers
    ADD CONSTRAINT teachers_user_id_key UNIQUE (user_id);

--
-- TOC entry 4983 (class 2606 OID 16824)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.users
    ADD CONSTRAINT users_email_key UNIQUE (email);

--
-- TOC entry 4985 (class 2606 OID 16822)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

--
-- TOC entry 5023 (class 1259 OID 17132)
-- Name: idx_enrollments_assignment; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_enrollments_assignment ON lms.enrollments USING btree (teacher_subject_assignment_id);

--
-- TOC entry 5024 (class 1259 OID 17131)
-- Name: idx_enrollments_student; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_enrollments_student ON lms.enrollments USING btree (student_id);

--
-- TOC entry 5047 (class 1259 OID 17140)
-- Name: idx_notification_read_notification; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_notification_read_notification ON lms.student_notification_read USING btree (notification_id);

--
-- TOC entry 5048 (class 1259 OID 17139)
-- Name: idx_notification_read_student; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_notification_read_student ON lms.student_notification_read USING btree (student_id);

--
-- TOC entry 5007 (class 1259 OID 17127)
-- Name: idx_sections_course_id; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_sections_course_id ON lms.sections USING btree (course_id);

--
-- TOC entry 4992 (class 1259 OID 17126)
-- Name: idx_students_course_section; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_students_course_section ON lms.students USING btree (course, section);

--
-- TOC entry 4993 (class 1259 OID 17125)
-- Name: idx_students_roll_no; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_students_roll_no ON lms.students USING btree (roll_no);

--
-- TOC entry 4994 (class 1259 OID 17124)
-- Name: idx_students_user_id; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_students_user_id ON lms.students USING btree (user_id);

--
-- TOC entry 5040 (class 1259 OID 17138)
-- Name: idx_submission_answers_submission; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_submission_answers_submission ON lms.submission_answers USING btree (submission_id);

--
-- TOC entry 5034 (class 1259 OID 17137)
-- Name: idx_submissions_student; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_submissions_student ON lms.submissions USING btree (student_id);

--
-- TOC entry 5035 (class 1259 OID 17136)
-- Name: idx_submissions_task; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_submissions_task ON lms.submissions USING btree (task_id);

--
-- TOC entry 5029 (class 1259 OID 17135)
-- Name: idx_task_questions_task; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_task_questions_task ON lms.task_questions USING btree (task_id);

--
-- TOC entry 5025 (class 1259 OID 17133)
-- Name: idx_tasks_assignment; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_tasks_assignment ON lms.tasks USING btree (teacher_subject_assignment_id);

--
-- TOC entry 5026 (class 1259 OID 17134)
-- Name: idx_tasks_status; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_tasks_status ON lms.tasks USING btree (status);

--
-- TOC entry 5012 (class 1259 OID 17130)
-- Name: idx_teacher_subject_assignments_course_section; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_teacher_subject_assignments_course_section ON lms.teacher_subject_assignments USING btree (course_id, section_id);

--
-- TOC entry 5013 (class 1259 OID 17129)
-- Name: idx_teacher_subject_assignments_subject; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_teacher_subject_assignments_subject ON lms.teacher_subject_assignments USING btree (subject_id);

--
-- TOC entry 5014 (class 1259 OID 17128)
-- Name: idx_teacher_subject_assignments_teacher; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_teacher_subject_assignments_teacher ON lms.teacher_subject_assignments USING btree (teacher_id);

--
-- TOC entry 4986 (class 1259 OID 17123)
-- Name: idx_teachers_employee_id; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_teachers_employee_id ON lms.teachers USING btree (employee_id);

--
-- TOC entry 4987 (class 1259 OID 17122)
-- Name: idx_teachers_user_id; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_teachers_user_id ON lms.teachers USING btree (user_id);

--
-- TOC entry 4980 (class 1259 OID 17120)
-- Name: idx_users_email; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_users_email ON lms.users USING btree (email);

--
-- TOC entry 4981 (class 1259 OID 17121)
-- Name: idx_users_role; Type: INDEX; Schema: lms; Owner: postgres
--

CREATE INDEX idx_users_role ON lms.users USING btree (role);

--
-- TOC entry 5060 (class 2606 OID 16972)
-- Name: enrollments enrollments_student_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.enrollments
    ADD CONSTRAINT enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES lms.students(id) ON DELETE CASCADE;

--
-- TOC entry 5061 (class 2606 OID 16977)
-- Name: enrollments enrollments_teacher_subject_assignment_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.enrollments
    ADD CONSTRAINT enrollments_teacher_subject_assignment_id_fkey FOREIGN KEY (teacher_subject_assignment_id) REFERENCES lms.teacher_subject_assignments(id) ON DELETE CASCADE;

--
-- TOC entry 5055 (class 2606 OID 16918)
-- Name: sections sections_course_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.sections
    ADD CONSTRAINT sections_course_id_fkey FOREIGN KEY (course_id) REFERENCES lms.courses(id) ON DELETE CASCADE;

--
-- TOC entry 5068 (class 2606 OID 17110)
-- Name: student_notification_read student_notification_read_notification_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.student_notification_read
    ADD CONSTRAINT student_notification_read_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES lms.notifications(id) ON DELETE CASCADE;

--
-- TOC entry 5069 (class 2606 OID 17115)
-- Name: student_notification_read student_notification_read_student_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.student_notification_read
    ADD CONSTRAINT student_notification_read_student_id_fkey FOREIGN KEY (student_id) REFERENCES lms.students(id) ON DELETE CASCADE;

--
-- TOC entry 5054 (class 2606 OID 16867)
-- Name: students students_user_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.students
    ADD CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES lms.users(id) ON DELETE CASCADE;

--
-- TOC entry 5066 (class 2606 OID 17080)
-- Name: submission_answers submission_answers_question_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.submission_answers
    ADD CONSTRAINT submission_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES lms.task_questions(id) ON DELETE CASCADE;

--
-- TOC entry 5067 (class 2606 OID 17075)
-- Name: submission_answers submission_answers_submission_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.submission_answers
    ADD CONSTRAINT submission_answers_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES lms.submissions(id) ON DELETE CASCADE;

--
-- TOC entry 5064 (class 2606 OID 17053)
-- Name: submissions submissions_student_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.submissions
    ADD CONSTRAINT submissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES lms.students(id) ON DELETE CASCADE;

--
-- TOC entry 5065 (class 2606 OID 17048)
-- Name: submissions submissions_task_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.submissions
    ADD CONSTRAINT submissions_task_id_fkey FOREIGN KEY (task_id) REFERENCES lms.tasks(id) ON DELETE CASCADE;

--
-- TOC entry 5063 (class 2606 OID 17025)
-- Name: task_questions task_questions_task_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.task_questions
    ADD CONSTRAINT task_questions_task_id_fkey FOREIGN KEY (task_id) REFERENCES lms.tasks(id) ON DELETE CASCADE;

--
-- TOC entry 5062 (class 2606 OID 17001)
-- Name: tasks tasks_teacher_subject_assignment_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.tasks
    ADD CONSTRAINT tasks_teacher_subject_assignment_id_fkey FOREIGN KEY (teacher_subject_assignment_id) REFERENCES lms.teacher_subject_assignments(id) ON DELETE CASCADE;

--
-- TOC entry 5056 (class 2606 OID 16949)
-- Name: teacher_subject_assignments teacher_subject_assignments_course_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.teacher_subject_assignments
    ADD CONSTRAINT teacher_subject_assignments_course_id_fkey FOREIGN KEY (course_id) REFERENCES lms.courses(id) ON DELETE CASCADE;

--
-- TOC entry 5057 (class 2606 OID 16954)
-- Name: teacher_subject_assignments teacher_subject_assignments_section_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.teacher_subject_assignments
    ADD CONSTRAINT teacher_subject_assignments_section_id_fkey FOREIGN KEY (section_id) REFERENCES lms.sections(id) ON DELETE CASCADE;

--
-- TOC entry 5058 (class 2606 OID 16944)
-- Name: teacher_subject_assignments teacher_subject_assignments_subject_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.teacher_subject_assignments
    ADD CONSTRAINT teacher_subject_assignments_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES lms.subjects(id) ON DELETE CASCADE;

--
-- TOC entry 5059 (class 2606 OID 16939)
-- Name: teacher_subject_assignments teacher_subject_assignments_teacher_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.teacher_subject_assignments
    ADD CONSTRAINT teacher_subject_assignments_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES lms.teachers(id) ON DELETE CASCADE;

--
-- TOC entry 5053 (class 2606 OID 16845)
-- Name: teachers teachers_user_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: postgres
--

ALTER TABLE ONLY lms.teachers
    ADD CONSTRAINT teachers_user_id_fkey FOREIGN KEY (user_id) REFERENCES lms.users(id) ON DELETE CASCADE;

-- Completed on 2025-11-16 01:54:24

--
-- PostgreSQL database dump complete
--

-- \unrestrict 9dD3xrfP4ETKpPExes89u6o8eDACIy1fpLsLzVDe0SZcht0Kxi7AbmKiAfkgj4x
