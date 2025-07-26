const express = require('express');
const router = express.Router();
const {
  addToWishlistController,
  getWishlistController,
  removeFromWishlistController
} = require('../controllers/wishlistController');

const { required, optional } = require('../middlewares/auth-middleware');

router.route("/")
  .get(required, getWishlistController)
  .post(required, addToWishlistController);

router.route("/:id")
  .delete(required, removeFromWishlistController);

module.exports = router;
