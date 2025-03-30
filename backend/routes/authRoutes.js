const express = require('express');
const { register, login, updatePassword} = require('../controllers/authController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/update-password', authMiddleware, updatePassword);

module.exports = router;
