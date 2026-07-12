const router = require('express').Router();
const { auth } = require('../middleware/auth');
const c = require('../controllers/tripController');
router.get('/', auth, c.getAll);
router.post('/', auth, c.create);
router.put('/:id/status', auth, c.updateStatus);
module.exports = router;
