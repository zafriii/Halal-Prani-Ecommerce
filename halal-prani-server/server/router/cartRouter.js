const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { required, optional } = require('../middlewares/auth-middleware');

router.post('/add', optional, cartController.addToCart);
router.get('/', optional, cartController.getCart);
router.delete('/remove/:cartItemId', optional, cartController.removeFromCart);
router.put('/increase/:cartItemId', optional, cartController.increaseQuantity);
router.put('/decrease/:cartItemId', optional, cartController.decreaseQuantity);
router.delete('/clear', optional, cartController.clearCart);

router.post('/merge', required, cartController.mergeGuestCart);

module.exports = router;
