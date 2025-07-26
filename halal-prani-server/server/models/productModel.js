const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  img: String,
  category: String,
  type: String,
  description: String,
  dishes: String,
  popular_dishes: String,
  cooking_style: String,
  tags: [String],
  stock_status: String,
  product_stock: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;


