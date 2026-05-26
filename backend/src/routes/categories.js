const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(protect);
router.get('/', getCategories);
router.post('/', validate([
  body('name').notEmpty().isString().isLength({ max: 50 }).withMessage('Name is required and must be under 50 characters'),
  body('type').isIn(['income', 'expense', 'both']).withMessage('Type must be income, expense, or both'),
]), createCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
