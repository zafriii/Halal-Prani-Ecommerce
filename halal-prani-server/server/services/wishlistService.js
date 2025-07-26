const WishlistItem = require('../models/wishlistModel');

const addToWishlist = async (item, userId) => {
  const exists = await WishlistItem.findOne({ productId: item.productId, userId });
  if (exists) throw new Error('Item already in wishlist');

  return await WishlistItem.create({
    userId,
    productId: item.productId,
    name: item.name,
    price: item.price,
    img: item.img,
    stock_status: item.stock_status, 
  });
};


const getWishlist = async (userId) => {
  return await WishlistItem.find({ userId });
};

const removeFromWishlist = async (itemId, userId) => {
  return await WishlistItem.findOneAndDelete({ _id: itemId, userId });
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
