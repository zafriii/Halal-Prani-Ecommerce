import React, { useEffect, useState } from 'react';
import '../styles/Checkout.css';

function CheckoutItems({ isMember, appliedCoupon }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const shippingFee = 120;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const guestId = localStorage.getItem('guestId');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    else if (guestId) headers['x-guest-id'] = guestId;
    return headers;
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/cart', {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load cart');
        setCartItems(data.cartItems || []);
      } catch (err) {
        console.error('CheckoutItems error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * Number(item.price), 0);

  const discount = isMember && appliedCoupon === 'DISCOUNT10' ? subtotal * 0.10 : 0;

  const total = subtotal + shippingFee - discount;

  if (loading) return <p>Loading your order...</p>;

  return (
    <div className="checkout-items-container">
      <h3 className="checkout-title">Your Order</h3>
      <div className="checkout-item-box">
        <div className="checkout-header">
          <strong>Product</strong>
          <strong>Subtotal</strong>
        </div>

        {cartItems.map((item) => (
          <div className="checkout-item" key={item._id}>
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{(item.quantity * item.price).toLocaleString()} ৳</span>
          </div>
        ))}

        <div className="checkout-summary">
          <div className="summary-line">
            <strong>Subtotal</strong>
            <span className="checkout-subtotal"> {subtotal.toLocaleString()} ৳</span>
          </div>
          <div className="summary-line">
            <strong>Shipping</strong>
            <span className="checkout-shipping"> {shippingFee.toLocaleString()} ৳</span>
          </div>
          {discount > 0 && (
            <div className="summary-line discount-line">
              <strong>Discount (10%)</strong>
              <span className="checkout-discount">- {discount.toLocaleString()} ৳</span>
            </div>
          )}

          <div className="summary-line total">
            <span>Total</span>
            <span>{total.toLocaleString()} ৳</span>
          </div>
        </div>
      </div>
      <div className="payment">
        <p className="cashon">Cash on delivery</p>
        <p className="pay-with">Pay with cash upon delivery.</p>
        <p className="personal-data">
          Your personal data will be used to process your order, support your experience throughout
          this website, and for other purposes described in our{' '}
          <span>privacy policy.</span>
        </p>
      </div>
    </div>
  );
}

export default CheckoutItems;
