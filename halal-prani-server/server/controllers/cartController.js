const cartService = require('../services/cartService');
const Product = require('../models/productModel');
const Cart = require("../models/cartModel");

function resolveOwnerId(req) {
  return req.user?.id || req.headers['x-guest-id'];
}

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const ownerId = resolveOwnerId(req);
    if (!ownerId) return res.status(400).json({ message: 'User or guest ID required' });

    if (!productId) return res.status(400).json({ message: 'Product ID is required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, price, img, stock_status, product_stock } = product;

    const newCartItem = await cartService.addToCart({
      ownerId,
      productId,
      name,
      price,
      img,
      stock_status,
      product_stock,
      quantity,
    });

    res.status(201).json({ message: 'Product added to cart successfully', cartItem: newCartItem });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getCart = async (req, res) => {
  try {
    const ownerId = req.user?.id || req.headers['x-guest-id'];
    if (!ownerId) {
      return res.status(400).json({ message: 'User or guest ID required' });
    }
    const cart = await cartService.getCartItems(ownerId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart items', error: error.message });
  }
};


exports.removeFromCart = async (req, res) => {
  try {
    const ownerId = resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ message: 'User or guest ID required' });
    }

    const cartItemId = req.params.cartItemId;
    const deletedItem = await cartService.removeCartItem(ownerId, cartItemId);
    res.status(200).json({ message: 'Cart item deleted successfully', deletedItem });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.increaseQuantity = async (req, res) => {
  try {
    const ownerId = resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ message: 'User or guest ID required' });
    }

    const cartItemId = req.params.cartItemId;
    const updatedCart = await cartService.updateQuantity(ownerId, cartItemId, true);
    res.status(200).json({ cartItems: updatedCart });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.decreaseQuantity = async (req, res) => {
  try {
    const ownerId = resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ message: 'User or guest ID required' });
    }

    const cartItemId = req.params.cartItemId;
    const updatedCart = await cartService.updateQuantity(ownerId, cartItemId, false);
    res.status(200).json({ cartItems: updatedCart });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const ownerId = resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ message: 'User or guest ID required' });
    }

    const deletedCount = await cartService.clearCart(ownerId);
    res.status(200).json({ message: 'Cart cleared successfully', deletedCount });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



exports.mergeGuestCart = async (req, res) => {
  const userId = req.userID; 
  const { guestId } = req.body;

  if (!guestId) return res.status(400).json({ message: "Guest ID is required" });

  try {
    const guestItems = await Cart.find({ guestId });
    const userItems = await Cart.find({ userId });

    const userProductIds = userItems.map(item => item.productId.toString());

    for (const guestItem of guestItems) {
      if (userProductIds.includes(guestItem.productId.toString())) {
        await Cart.findOneAndUpdate(
          { userId, productId: guestItem.productId },
          { $inc: { quantity: guestItem.quantity } }
        );
      } else {
        await Cart.create({
          userId,
          productId: guestItem.productId,
          name: guestItem.name,
          price: guestItem.price,
          img: guestItem.img,
          stock_status: guestItem.stock_status,
          product_stock: guestItem.product_stock,
          quantity: guestItem.quantity,
        });
      }
    }

    await Cart.deleteMany({ guestId });

    res.status(200).json({ message: "Cart merged successfully" });
  } catch (error) {
    console.error("Merge Error:", error);
    res.status(500).json({ message: "Failed to merge cart" });
  }
};
