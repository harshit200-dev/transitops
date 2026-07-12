const router = require('express').Router();
const { auth } = require('../middleware/auth');
const fuel = require('../controllers/fuelController');
const expense = require('../controllers/expenseController');

router.get('/fuel', auth, fuel.getAll);
router.post('/fuel', auth, fuel.create);
router.get('/expenses', auth, expense.getAll);
router.post('/expenses', auth, expense.create);
module.exports = router;
