const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingAddressController');
const { required } = require('../middlewares/auth-middleware');

router.post('/', required, shippingController.saveOrUpdateShippingAddress);
router.get('/', required, shippingController.getShippingAddress);

module.exports = router;
