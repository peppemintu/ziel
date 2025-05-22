CREATE TYPE attestation_form_enum AS ENUM ('EXAM', 'CREDIT');

CREATE TABLE IF NOT EXISTS course (
    course_id UUID PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    major_code VARCHAR(50) NOT NULL,
    major_name VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    semester INT NOT NULL,
    total_hours INT NOT NULL,
    credit_units INT NOT NULL,
    auditory_hours_total INT NOT NULL,
    lectures INT NOT NULL,
    labworks INT,
    practices INT,
    attestation_form attestation_form_enum NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
