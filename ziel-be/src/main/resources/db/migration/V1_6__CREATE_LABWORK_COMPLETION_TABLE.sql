CREATE TABLE IF NOT EXISTS labwork_completion (
    labwork_id UUID NOT NULL,
    user_id UUID NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (labwork_id, user_id),
    FOREIGN KEY (labwork_id) REFERENCES labwork(element_id),
    FOREIGN KEY (user_id) REFERENCES usr(user_id)
);
