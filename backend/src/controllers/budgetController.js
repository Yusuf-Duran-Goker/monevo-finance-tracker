const db = require('../config/db');

const getBudgets = (req, res) => {
  try {
    const { month, year } = req.query;
    let query = 'SELECT b.*, c.name as category_name, c.type as category_type FROM budgets b JOIN categories c ON b.category_id = c.id WHERE b.user_id = ?';
    const params = [req.user.id];
    if (month) { query += ' AND b.month = ?'; params.push(Number(month)); }
    if (year) { query += ' AND b.year = ?'; params.push(Number(year)); }
    const rows = db.prepare(query).all(...params);
    res.json(rows.map(r => ({ ...r, _id: r.id, category: { _id: r.category_id, name: r.category_name, type: r.category_type } })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrUpdateBudget = (req, res) => {
  try {
    const { category, amount, month, year } = req.body;
    db.prepare(`
      INSERT INTO budgets (user_id, category_id, amount, month, year) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, category_id, month, year) DO UPDATE SET amount = excluded.amount
    `).run(req.user.id, category, amount, month, year);
    const row = db.prepare('SELECT b.*, c.name as category_name, c.type as category_type FROM budgets b JOIN categories c ON b.category_id = c.id WHERE b.user_id = ? AND b.category_id = ? AND b.month = ? AND b.year = ?').get(req.user.id, category, month, year);
    res.status(201).json({ ...row, _id: row.id, category: { _id: row.category_id, name: row.category_name, type: row.category_type } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBudget = (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM budgets WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ message: 'Budget not found' });
    db.prepare('DELETE FROM budgets WHERE id = ?').run(req.params.id);
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBudgetSummary = (req, res) => {
  try {
    const m = Number(req.query.month) || new Date().getMonth() + 1;
    const y = Number(req.query.year) || new Date().getFullYear();
    const budgets = db.prepare(`
      SELECT b.*, c.name as category_name, c.type as category_type
      FROM budgets b JOIN categories c ON b.category_id = c.id
      WHERE b.user_id = ? AND b.month = ? AND b.year = ?
    `).all(req.user.id, m, y);

    const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
    const endDate = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, '0')}-01`;
    const transactions = db.prepare(`SELECT category, amount FROM transactions WHERE user_id = ? AND type = 'expense' AND date >= ? AND date < ?`).all(req.user.id, startDate, endDate);

    const summary = budgets.map(b => {
      const spent = transactions.filter(t => t.category === b.category_name).reduce((s, t) => s + t.amount, 0);
      return {
        _id: b.id,
        category: { _id: b.category_id, name: b.category_name, type: b.category_type },
        budgeted: b.amount,
        spent,
        remaining: b.amount - spent,
        percentage: b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0,
      };
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBudgets, createOrUpdateBudget, deleteBudget, getBudgetSummary };
