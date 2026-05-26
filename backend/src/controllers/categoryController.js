const db = require('../config/db');

const getCategories = (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM categories WHERE is_default = 1 OR user_id = ?').all(req.user.id);
    res.json(rows.map(r => ({ ...r, _id: r.id, isDefault: !!r.is_default })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = (req, res) => {
  try {
    const { name, type } = req.body;
    const result = db.prepare('INSERT INTO categories (user_id, name, type, is_default) VALUES (?, ?, ?, 0)').run(req.user.id, name, type || 'both');
    const row = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ ...row, _id: row.id, isDefault: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM categories WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ message: 'Category not found' });
    db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, createCategory, deleteCategory };
