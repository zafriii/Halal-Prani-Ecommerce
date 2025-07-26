const mongoose = require('mongoose');

const billingAddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true, 
    ref: 'User',
  },
  name: String,
  phone: String,
  email: String,
  address: String,
  country: String,
  postcode: String,
}, { timestamps: true });

module.exports = mongoose.model('BillingAddress', billingAddressSchema);
