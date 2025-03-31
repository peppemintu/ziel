CREATE TABLE IF NOT EXISTS usr (
	user_id		UUID PRIMARY KEY,
	user_email  email UNIQUE NOT NULL,
	username	varchar(100) NOT NULL,
	password	varchar(255) NOT NULL,
	user_role   role NOT NULL DEFAULT 'STUDENT'
);

CREATE INDEX IF NOT EXISTS index_usr_username ON usr (username);