const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function () { return !this.guestId; }  
  },
  guestId: {
    type: String,
    required: function () { return !this.userId; }  
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
  stock_status: String,
  product_stock: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
