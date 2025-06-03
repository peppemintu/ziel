-- Enable citext extension for case-insensitive email
CREATE EXTENSION IF NOT EXISTS citext;

-- Email domain
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'email') THEN
        CREATE DOMAIN email AS citext
        CHECK (VALUE ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
    END IF;
END $$;

-- ENUM Types
CREATE TYPE role_enum AS ENUM ('STUDENT', 'TEACHER');
CREATE TYPE element_type_enum AS ENUM ('LABWORK', 'LECTURE', 'PRACTICE', 'ATTESTATION');
CREATE TYPE message_status_enum AS ENUM ('READ', 'NOT_READ');
CREATE TYPE progress_status_enum AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'ACCEPTED', 'NEEDS_CHANGES', 'OVERDUE');
CREATE TYPE attestation_form_enum AS ENUM ('EXAM', 'CREDIT', 'QUESTIONING', 'REPORT');

-- Optional casts
CREATE CAST (varchar AS element_type_enum) WITH INOUT AS ASSIGNMENT;
CREATE CAST (varchar AS message_status_enum) WITH INOUT AS ASSIGNMENT;
CREATE CAST (varchar AS progress_status_enum) WITH INOUT AS ASSIGNMENT;
CREATE CAST (varchar AS role_enum) WITH INOUT AS ASSIGNMENT;
CREATE CAST (varchar AS attestation_form_enum) WITH INOUT AS ASSIGNMENT;

-- Discipline Table
CREATE TABLE IF NOT EXISTS discipline (
    discipline_id         BIGSERIAL PRIMARY KEY,
    name                  VARCHAR(255) NOT NULL,
    abbreviation          VARCHAR(10) NOT NULL
);

-- Specialty Table
CREATE TABLE IF NOT EXISTS specialty (
    specialty_id          BIGSERIAL PRIMARY KEY,
    code                  VARCHAR(25) NOT NULL UNIQUE,
    name                  VARCHAR(255) NOT NULL,
    abbreviation          VARCHAR(10) NOT NULL
);

-- Study Plan
CREATE TABLE IF NOT EXISTS study_plan (
    study_plan_id         BIGSERIAL PRIMARY KEY,
    discipline_id         BIGINT NOT NULL REFERENCES discipline(discipline_id),
    specialty_id          BIGINT NOT NULL REFERENCES specialty(specialty_id),
    study_year            SMALLINT NOT NULL,
    semester              SMALLINT NOT NULL,
    total_hours           SMALLINT NOT NULL,
    credit_units          SMALLINT NOT NULL,
    total_auditory_hours  SMALLINT NOT NULL,
    lecture_hours         SMALLINT NOT NULL,
    practice_hours        SMALLINT,
    lab_hours             SMALLINT,
    attestation_form      attestation_form_enum NOT NULL
);

-- Course Group
CREATE TABLE IF NOT EXISTS student_group (
    group_id              BIGSERIAL PRIMARY KEY,
    specialty_id          BIGINT NOT NULL REFERENCES specialty(specialty_id),
    group_number          SMALLINT NOT NULL
);

-- User Table
CREATE TABLE IF NOT EXISTS usr (
    user_id               BIGSERIAL PRIMARY KEY,
    email                 email NOT NULL UNIQUE,
    password              VARCHAR(255) NOT NULL,
    first_name            VARCHAR(100) NOT NULL,
    last_name             VARCHAR(100) NOT NULL,
    patronymic            VARCHAR(100) NOT NULL,
    role                  role_enum NOT NULL
);

-- Teacher
CREATE TABLE IF NOT EXISTS teacher (
    teacher_id            BIGSERIAL PRIMARY KEY,
    user_id               BIGINT NOT NULL REFERENCES usr(user_id),
    title                 VARCHAR(100)
);

-- Student
CREATE TABLE IF NOT EXISTS student (
    student_id            BIGSERIAL PRIMARY KEY,
    group_id              BIGINT NOT NULL REFERENCES student_group(group_id),
    user_id               BIGINT NOT NULL REFERENCES usr(user_id)
);

-- Academic Course
CREATE TABLE IF NOT EXISTS course (
    course_id             BIGSERIAL PRIMARY KEY,
    study_plan_id         BIGINT NOT NULL REFERENCES study_plan(study_plan_id),
    group_id              BIGINT NOT NULL REFERENCES student_group(group_id)
);

-- Grade Sheet
CREATE TABLE IF NOT EXISTS grade_sheet (
    grade_sheet_id        BIGSERIAL PRIMARY KEY,
    course_id             BIGINT NOT NULL REFERENCES course(course_id),
    date_held             TIMESTAMP NOT NULL
);

-- Grade
CREATE TABLE IF NOT EXISTS final_grade (
    grade_id              BIGSERIAL PRIMARY KEY,
    grade_sheet_id        BIGINT NOT NULL REFERENCES grade_sheet(grade_sheet_id),
    student_id            BIGINT NOT NULL REFERENCES student(student_id),
    ticket_number         SMALLINT NOT NULL,
    numeric_grade         SMALLINT NOT NULL
);

-- Course Element
CREATE TABLE IF NOT EXISTS course_element (
    course_element_id     BIGSERIAL PRIMARY KEY,
    course_id             BIGINT NOT NULL REFERENCES course(course_id),
    hours                 SMALLINT NOT NULL,
    is_published          BOOLEAN NOT NULL DEFAULT false,
    element_type          element_type_enum NOT NULL,
    assessment_form       attestation_form_enum
);

-- Course Element Progress
CREATE TABLE IF NOT EXISTS course_element_progress (
    progress_id           BIGSERIAL PRIMARY KEY,
    status                progress_status_enum NOT NULL,
    grade                 INTEGER,
    course_element_id     BIGINT NOT NULL REFERENCES course_element(course_element_id),
    student_id            BIGINT NOT NULL REFERENCES student(student_id)
);

-- File Table
CREATE TABLE IF NOT EXISTS file (
    file_id               BIGSERIAL PRIMARY KEY,
    path                  VARCHAR(255) NOT NULL,
    name                  VARCHAR(255) NOT NULL,
    uploaded_at           TIMESTAMP NOT NULL
);

-- Methodical Material
CREATE TABLE IF NOT EXISTS methodical_material (
    material_id           BIGSERIAL PRIMARY KEY,
    file_id               BIGINT NOT NULL REFERENCES file(file_id),
    course_element_id     BIGINT NOT NULL REFERENCES course_element(course_element_id)
);

-- Message
CREATE TABLE IF NOT EXISTS message (
    message_id            BIGSERIAL PRIMARY KEY,
    content               VARCHAR(255) NOT NULL,
    sent_at               TIMESTAMP NOT NULL,
    status                message_status_enum NOT NULL,
    user_id               BIGINT NOT NULL REFERENCES usr(user_id),
    course_element_id     BIGINT NOT NULL REFERENCES course_element(course_element_id)
);

-- Message Reply
CREATE TABLE IF NOT EXISTS message_reply (
    reply_id              BIGSERIAL PRIMARY KEY,
    parent_message_id     BIGINT NOT NULL REFERENCES message(message_id)
);

-- Report
CREATE TABLE IF NOT EXISTS report (
    report_id             BIGSERIAL PRIMARY KEY,
    message_id            BIGINT NOT NULL REFERENCES message(message_id),
    file_id               BIGINT NOT NULL REFERENCES file(file_id)
);

-- Course Manager
CREATE TABLE IF NOT EXISTS course_teacher (
    course_teacher_id     BIGSERIAL PRIMARY KEY,
    teacher_id            BIGINT NOT NULL REFERENCES teacher(teacher_id),
    course_id             BIGINT NOT NULL REFERENCES course(course_id)
);

-- Course Element Relationship
CREATE TABLE IF NOT EXISTS element_relationship (
    relationship_id       BIGSERIAL PRIMARY KEY,
    source_element_id     BIGINT NOT NULL REFERENCES course_element(course_element_id),
    target_element_id     BIGINT NOT NULL REFERENCES course_element(course_element_id)
);
