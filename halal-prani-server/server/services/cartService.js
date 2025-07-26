const Cart = require('../models/cartModel');
const mongoose = require('mongoose');


async function addToCart({ ownerId, productId, name, price, img, stock_status, product_stock, quantity }) {
  if (quantity <= 0) throw new Error('Invalid quantity');
  if (quantity > product_stock) throw new Error(`Only ${product_stock} items are available in stock`);

  const isObjectId = mongoose.Types.ObjectId.isValid(ownerId);

  const query = isObjectId
    ? { userId: ownerId, productId }
    : { guestId: ownerId, productId };

  const existingItem = await Cart.findOne(query);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product_stock) {
      throw new Error(`Only ${product_stock - existingItem.quantity} items are available in stock`);
    }
    existingItem.quantity = newQuantity;
    await existingItem.save();
    return existingItem;
  }

  const cleanPrice =
    typeof price === "string"
      ? parseFloat(price.replace(/,/g, '').trim())
      : price;

  const cartItemData = {
    productId,
    name,
    price: cleanPrice, 
    img,
    stock_status,
    product_stock,
    quantity,
  };

  if (isObjectId) {
    cartItemData.userId = ownerId;
  } else {
    cartItemData.guestId = ownerId;
  }

  const cartItem = new Cart(cartItemData);
  await cartItem.save();
  return cartItem;
}




async function getCartItems(ownerId) {
  if (!ownerId) throw new Error('Owner ID is required');

  const isValidObjectId = mongoose.Types.ObjectId.isValid(ownerId);

  const query = isValidObjectId
    ? { userId: ownerId }            
    : { guestId: ownerId };          

  const cartItems = await Cart.find(query);

  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  return { cartItems, totalQuantity };
}

async function removeCartItem(ownerId, cartItemId) {
  const isObjectId = mongoose.Types.ObjectId.isValid(ownerId);
  const query = isObjectId
    ? { _id: cartItemId, userId: ownerId }
    : { _id: cartItemId, guestId: ownerId };

  const deletedItem = await Cart.findOneAndDelete(query);
  if (!deletedItem) throw new Error('Cart item not found');
  return deletedItem;
}

async function updateQuantity(ownerId, cartItemId, increment = true) {
  const isObjectId = mongoose.Types.ObjectId.isValid(ownerId);
  const query = isObjectId
    ? { _id: cartItemId, userId: ownerId }
    : { _id: cartItemId, guestId: ownerId };

  const cartItem = await Cart.findOne(query);
  if (!cartItem) throw new Error('Cart item not found');

  let newQuantity = increment ? cartItem.quantity + 1 : cartItem.quantity - 1;
  if (newQuantity < 1) throw new Error('Quantity cannot be less than 1');
  if (newQuantity > cartItem.product_stock) throw new Error(`Only ${cartItem.product_stock} items available in stock`);

  cartItem.quantity = newQuantity;
  await cartItem.save();

  const cartQuery = isObjectId ? { userId: ownerId } : { guestId: ownerId };
  return await Cart.find(cartQuery);
}

async function clearCart(ownerId) {
  const isObjectId = mongoose.Types.ObjectId.isValid(ownerId);
  const query = isObjectId ? { userId: ownerId } : { guestId: ownerId };

  const result = await Cart.deleteMany(query);
  if (result.deletedCount === 0) throw new Error('No items found in the cart to delete');
  return result.deletedCount;
}


async function mergeGuestCart(userId, guestId) {

  const guestCartItems = await Cart.find({ guestId });

  for (const guestItem of guestCartItems) {
    
    const existingItem = await Cart.findOne({ userId, productId: guestItem.productId });

    if (existingItem) {
      const maxQty = guestItem.product_stock || Infinity;
      const newQty = Math.min(existingItem.quantity + guestItem.quantity, maxQty);
      existingItem.quantity = newQty;
      await existingItem.save();
    } else {
      guestItem.userId = userId;
      guestItem.guestId = undefined;
      await guestItem.save();
    }
  }

  return await Cart.find({ userId });
}


module.exports = {
  addToCart,
  getCartItems,
  removeCartItem,
  updateQuantity,
  clearCart,
  mergeGuestCart,
};
