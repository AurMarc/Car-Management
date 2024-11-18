const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  signup,
  login,
  getMe,
  logout
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);

router.use(protect);
router.get('/me', getMe);
router.post('/logout', logout);

module.exports = router;