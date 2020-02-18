DROP TABLE IF EXISTS profile;

CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    age INT,
    city VARCHAR,
    url VARCHAR,
    userId NOT NULL UNIQUE REFERENCES users(id)
);
