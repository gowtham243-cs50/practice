import Database from 'better-sqlite3';
const db = new Database(":memory:")

db.exec(
    `CREATE table user(
    id integer PRIMARY KEY AUTOINCREMENT,
    username text unique,
    password text 
    )`
)

db.exec(
    `CREATE TABLE todos(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        task TEXT,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES user(id) 
    )`
)

export default db;