-- -- Create the database
-- CREATE DATABASE "async-await-starter-db";

CREATE TABLE pokemon (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  height INTEGER,
  weight INTEGER,
  strength_index INTEGER,
  image_url VARCHAR(255)
);


CREATE TABLE account (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL
);
CREATE TABLE register (
  id SERIAL PRIMARY KEY,
  acct_id INTEGER REFERENCES account ON DELETE CASCADE NOT NULL,
  amount MONEY NOT NULL
);
INSERT INTO account (name) VALUES('Abbey''s Savings Account');
INSERT INTO register (acct_id, amount) VALUES (1, 1000);
INSERT INTO account (name) VALUES ('Abbey''s Checking Account') RETURNING id;
INSERT INTO register (acct_id, amount) VALUES (2, 100);
INSERT INTO register (acct_id, amount) VALUES (2, -500);
INSERT INTO register (acct_id, amount) VALUES (11, 500);
BEGIN;
INSERT INTO register (acct_id, amount) VALUES (2, -500);
INSERT INTO register (acct_id, amount) VALUES (11, 500);
COMMIT;

