const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getTransactions, createTransaction, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/', getTransactions);
router.post('/', validate([
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('category').notEmpty().withMessage('Category is required'),
]), createTransaction);
router.put('/:id', validate([
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  body('description').optional().isString().isLength({ max: 200 }).withMessage('Description too long'),
]), updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
