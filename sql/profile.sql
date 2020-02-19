DROP TABLE IF EXISTS profile;

CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    age INT,
    city VARCHAR,
    url VARCHAR,
    user_id INTEGER NOT NULL REFERENCES users(id)
);
