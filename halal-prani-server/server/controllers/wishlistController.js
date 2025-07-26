const { addToWishlist, getWishlist, removeFromWishlist } = require('../services/wishlistService');

const addToWishlistController = async (req, res) => {
  try {
    const item = req.body;
    const userId = req.user.id;
    const savedItem = await addToWishlist(item, userId);
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getWishlistController = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await getWishlist(userId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFromWishlistController = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;
    await removeFromWishlist(itemId, userId);
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addToWishlistController,
  getWishlistController,
  removeFromWishlistController
};
