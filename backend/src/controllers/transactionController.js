const db = require('../config/db');

const getTransactions = (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC').all(req.user.id);
    res.json(rows.map(r => ({ ...r, _id: r.id })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTransaction = (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const result = db.prepare(
      'INSERT INTO transactions (user_id, type, amount, category, description, date) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(req.user.id, type, amount, category, description || '', date);
    const row = db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ ...row, _id: row.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTransaction = (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const existing = db.prepare('SELECT id FROM transactions WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ message: 'Transaction not found' });
    db.prepare('UPDATE transactions SET type=?, amount=?, category=?, description=?, date=? WHERE id=?')
      .run(type, amount, category, description || '', date, req.params.id);
    const row = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
    res.json({ ...row, _id: row.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTransaction = (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM transactions WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ message: 'Transaction not found' });
    db.prepare('DELETE FROM transactions WHERE id = ?').run(req.params.id);
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTransactions, createTransaction, updateTransaction, deleteTransaction };
