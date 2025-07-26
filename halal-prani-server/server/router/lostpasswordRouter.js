const express = require('express');
const router = express.Router();
const { lostPassword, resetPassword } = require('../controllers/lostPasswordController');

router.post('/lost-password', lostPassword);
router.post('/reset-password/:resetToken', resetPassword);

module.exports = router;
