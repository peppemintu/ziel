CREATE TYPE element_type_enum AS ENUM ('LABWORK', 'LECTURE', 'PRACTICE', 'ATTESTATION');
CREATE CAST (character varying AS element_type_enum) WITH INOUT AS ASSIGNMENT;

CREATE TABLE IF NOT EXISTS element (
    element_id UUID PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    description TEXT,
    type element_type_enum NOT NULL,
    course_id UUID NOT NULL,
    FOREIGN KEY (course_id) REFERENCES course(course_id)
);

CREATE TABLE IF NOT EXISTS lecture (
    element_id UUID PRIMARY KEY,
    FOREIGN KEY (element_id) REFERENCES element(element_id)
);

CREATE TABLE IF NOT EXISTS labwork (
    element_id UUID PRIMARY KEY,
    FOREIGN KEY (element_id) REFERENCES element(element_id)
);

CREATE TABLE IF NOT EXISTS practice (
    element_id UUID PRIMARY KEY,
    FOREIGN KEY (element_id) REFERENCES element(element_id)
);

CREATE TABLE IF NOT EXISTS attestation (
    element_id UUID PRIMARY KEY,
    FOREIGN KEY (element_id) REFERENCES element(element_id)
);

CREATE TABLE IF NOT EXISTS roadmap_connection (
    connection_id UUID PRIMARY KEY,
    source_element_id UUID NOT NULL,
    target_element_id UUID NOT NULL,
    course_id UUID NOT NULL,
    label VARCHAR(50),
    FOREIGN KEY (source_element_id) REFERENCES element(element_id),
    FOREIGN KEY (target_element_id) REFERENCES element(element_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    CONSTRAINT unique_connection UNIQUE (source_element_id, target_element_id)
);
