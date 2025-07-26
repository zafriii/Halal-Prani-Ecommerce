const express = require('express');
const router = express.Router();
const billingAddressController = require('../controllers/billingAddressController');
const { required } = require('../middlewares/auth-middleware');

router.post('/', required, billingAddressController.saveOrUpdateAddress);
router.get('/', required, billingAddressController.getAddress);

module.exports = router;
