
const mongoose = require('mongoose');

const WishlistItemSchema  = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  price: String,
  img: String,
  stock_status: String
});

module.exports = mongoose.model('WishlistItem', WishlistItemSchema);