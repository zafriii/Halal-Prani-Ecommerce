const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { required } = require("../middlewares/auth-middleware");

router.post('/', required,  contactController.submitContactForm);

module.exports = router;
