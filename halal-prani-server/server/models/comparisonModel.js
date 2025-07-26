const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: String,
      img: String,
      price: String,
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Comparison', comparisonSchema);
