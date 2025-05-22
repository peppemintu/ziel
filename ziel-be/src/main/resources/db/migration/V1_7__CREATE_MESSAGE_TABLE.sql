CREATE TABLE IF NOT EXISTS message (
    message_id UUID PRIMARY KEY,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES usr(user_id)
);

CREATE TABLE IF NOT EXISTS element_message (
    message_id UUID PRIMARY KEY,
    element_id UUID NOT NULL,
    is_public BOOLEAN NOT NULL,
    FOREIGN KEY (message_id) REFERENCES message(message_id),
    FOREIGN KEY (element_id) REFERENCES element(element_id)
);
