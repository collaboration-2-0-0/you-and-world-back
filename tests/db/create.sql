DROP DATABASE IF EXISTS you_and_world;
DROP USER IF EXISTS you_and_world;
CREATE USER you_and_world WITH PASSWORD 'you_and_world';
CREATE DATABASE you_and_world WITH
    OWNER = you_and_world
    TEMPLATE = template0
    LC_COLLATE = 'C'
    LC_CTYPE = 'C';
