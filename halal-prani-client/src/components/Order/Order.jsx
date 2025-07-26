import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/Order.css'; 
import { FaRegCheckCircle } from "react-icons/fa";

function Order() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    document.title = 'Order Received - Halal Prani'

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/orders/number/${orderNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setOrder(data);
        } else {
          console.error('Error fetching order:', data.message);
        }
      } catch (error) {
        console.error('Error fetching order:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) return <p>Loading your order...</p>;
  if (!order) return <p>Order not found.</p>;

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="order-received-container">
      <h2>Thank you! Your order has been placed. <FaRegCheckCircle className='order-placed' size={24} color='#f8b71d' /></h2>

      <div className="order-summary-box">
        <p><strong>Order Number:</strong> {order.orderNumber}</p>
        <p><strong>Order Date:</strong> {orderDate}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
      </div>

      <h2>Order Details:</h2>

      <div className="order-details">
        <div className="order-details-header">
          <span><strong>Product</strong></span>
          <span><strong>Total</strong></span>
        </div>

        <ul className="ordered-items">
          {order.cartItems.map((item, idx) => (
            <li key={idx}>
              <span>{item.name} × {item.quantity} </span>
              <span>{item.price * item.quantity} ৳</span>
            </li>
          ))}
        </ul>

        <div className="price-breakdown">
          <div className="price-row">
            <span>Subtotal:</span>
            <span>
              {order.cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              )} ৳
            </span>
          </div>

          <div className="price-row">
            <span>Shipping Fee:</span>
            <span>{order.shippingFee || 0} ৳</span>
          </div>

          <div className="price-row">
          <span>Discount:</span>
          <span>{order.discount ? `- ${order.discount.toFixed(2)} ৳` : '0 ৳'}</span>
        </div>

          <div className="price-row">
          <span><strong>Total Amount:</strong></span>
          <span className='order-total'><strong>{order.totalAmount} ৳</strong></span>
          </div>

          
        </div>
      </div>


      <div className="address-container">
        <div className="address-box">
          <h3>Billing Address</h3>
          <p><strong>Name:</strong> {order.billing?.name}</p>
          <p><strong>Address:</strong> {order.billing?.address}</p>
          <p><strong>Postcode:</strong> {order.billing?.postcode}</p>
          <p><strong>Phone:</strong> {order.billing?.phone}</p>
          <p><strong>Email:</strong> {order.billing?.email}</p>
        </div>

        <div className="address-box">
          <h3>Shipping Address</h3>
          <p><strong>Name:</strong> {order.shipping?.name}</p>
          <p><strong>Street:</strong> {order.shipping?.street}</p>
          <p><strong>District:</strong> {order.shipping?.district}</p>
          <p><strong>Postcode:</strong> {order.shipping?.postcode}</p>
          <p><strong>Notes:</strong> {order.orderNotes || 'No special instructions.'}</p>
        </div>
      </div>

      <Link to="/" className="home-button">Back to Home</Link>
    </div>
  );
}

export default Order;
