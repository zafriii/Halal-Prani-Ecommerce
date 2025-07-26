const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const { required } = require('../middlewares/auth-middleware');

router.post('/', required, orderController.placeOrderController);

router.get('/', required, orderController.getUserOrdersController);

router.get('/id/:id', required, orderController.getOrderDetailsController);

router.get('/number/:orderNumber', required, orderController.getOrderByNumberController);


module.exports = router;
