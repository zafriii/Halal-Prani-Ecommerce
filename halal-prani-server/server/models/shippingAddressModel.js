const mongoose = require('mongoose');

const shippingAddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  country: { type: String, default: "Bangladesh" },
  street: { type: String, required: true },
  apartment: { type: String },
  district: { type: String, required: true },
  postcode: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ShippingAddress', shippingAddressSchema);
