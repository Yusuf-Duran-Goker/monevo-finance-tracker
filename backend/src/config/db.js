const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../fintrack.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'both',
    is_default INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    UNIQUE(user_id, category_id, month, year),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );
`);

const defaultCategories = [
  { name: 'Food', type: 'expense' },
  { name: 'Transport', type: 'expense' },
  { name: 'Housing', type: 'expense' },
  { name: 'Health', type: 'expense' },
  { name: 'Entertainment', type: 'expense' },
  { name: 'Shopping', type: 'expense' },
  { name: 'Salary', type: 'income' },
  { name: 'Other', type: 'both' },
];

const existing = db.prepare('SELECT id FROM categories WHERE is_default = 1').get();
if (!existing) {
  const insert = db.prepare('INSERT INTO categories (name, type, is_default) VALUES (?, ?, 1)');
  defaultCategories.forEach(c => insert.run(c.name, c.type));
}

module.exports = db;
