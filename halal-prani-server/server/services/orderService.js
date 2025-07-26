const Order = require('../models/orderModel');

const placeOrder = async (orderData, userId) => {
  const {
    billing,
    shipping,
    orderNotes,
    cartItems,
    subtotal,
    shippingFee,
    coupon,
    isMember,
    paymentMethod,
  } = orderData;

  const discount = isMember && coupon === 'DISCOUNT10' ? subtotal * 0.10 : 0;
  const totalAmount = subtotal + shippingFee - discount;

  const order = new Order({
    userId,
    billing,
    shipping,
    orderNotes,
    cartItems,
    subtotal,
    shippingFee,
    discount,
    totalAmount,
    coupon,
    isMemberDiscount: isMember,
    paymentMethod,
    orderNumber: (Date.now() + Math.floor(Math.random() * 1000)).toString(),
  });

  return await order.save();
};


const getOrdersByUser = async (userId) => {
  return await Order.find({ userId }).sort({ createdAt: -1 });
};

const getOrderById = async (orderId, userId) => {
  return await Order.findOne({ _id: orderId, userId });
};

const getOrderByNumber = async (orderNumber, userId) => {
  return await Order.findOne({ orderNumber, userId });
};


module.exports = {
  placeOrder,
  getOrdersByUser,
  getOrderById,
  getOrderByNumber
};
