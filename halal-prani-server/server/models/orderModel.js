const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  billing: {
    name: String,
    phone: String,
    email: String,
    address: String,
    country: String,
    postcode: String
  },

  shipping: {
    name: String,
    street: String,
    apartment: String,
    district: String,
    country: String,
    postcode: String
  },

  orderNotes: { type: String, default: '' },

  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number
    }
  ],

  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },

  coupon: { type: String, default: null },
  isMemberDiscount: { type: Boolean, default: false },

  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery'],
    default: 'Cash on Delivery'
  },

  orderNumber: { type: Number, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Auto-increment orderNumber before saving
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const latestOrder = await mongoose.model('Order').findOne().sort({ orderNumber: -1 });
    this.orderNumber = latestOrder ? latestOrder.orderNumber + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
