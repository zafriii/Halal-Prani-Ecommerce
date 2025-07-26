const {
  placeOrder,
  getOrdersByUser,
  getOrderById,
  getOrderByNumber
} = require('../services/orderService');

const { clearCart } = require('../services/cartService');  

const placeOrderController = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.body.cartItems || !req.body.billing || !req.body.subtotal) {
      return res.status(400).json({ message: 'Required order data missing' });
    }

    const order = await placeOrder(req.body, userId);


    try {
      await clearCart(userId);
    } catch (clearErr) {
      console.error('Error clearing cart after order:', clearErr);
    }

    res.status(201).json({
      message: 'Order placed successfully',
      orderNumber: order.orderNumber
    });
  } catch (err) {
    console.error('Place order error:', err);
    res.status(500).json({ message: err.message || 'Failed to place order' });
  }
};


const getUserOrdersController = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await getOrdersByUser(userId);
    res.json(orders);
  } catch (err) {
    console.error('Get user orders error:', err);
    res.status(500).json({ message: err.message || 'Failed to get orders' });
  }
};

const getOrderDetailsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    const order = await getOrderById(orderId, userId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Get order details error:', err);
    res.status(500).json({ message: err.message || 'Failed to get order' });
  }
};



const getOrderByNumberController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderNumber } = req.params;

    const order = await getOrderByNumber(orderNumber, userId); 

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Get order by number error:', err);
    res.status(500).json({ message: err.message || 'Failed to get order' });
  }
};



module.exports = {
  placeOrderController,
  getUserOrdersController,
  getOrderDetailsController,
  getOrderByNumberController
};
