DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    first VARCHAR,
    last VARCHAR,
    signature VARCHAR
);
