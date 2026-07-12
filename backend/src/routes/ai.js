const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { chat } = require('../controllers/aiController');
router.post('/chat', auth, chat);
module.exports = router;
