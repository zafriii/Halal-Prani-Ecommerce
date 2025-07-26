import React, { useEffect, useState } from 'react';
import CouponBox from './CouponBox';
import CheckoutAddresses from './CheckoutAddresses';
import CheckoutItems from './CheckoutItems';
import '../styles/Checkout.css';
import { useNavigate, NavLink } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import Footer from '../Footer';

function CheckoutPage() {
  const [addresses, setAddresses] = useState({ billing: {}, shipping: {} });
  const [isMember, setIsMember] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [placingOrder, setPlacingOrder] = useState(false); 
  const shippingFee = 120;
  const navigate = useNavigate();
  const [orderNotesFromAddresses, setOrderNotesFromAddresses] = useState('');

  const handleAddressChange = ({ billing, shipping, orderNotes }) => {
    setAddresses({ billing, shipping });
    setOrderNotesFromAddresses(orderNotes);
  };

  const fetchMemberData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/member', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setIsMember(response.ok && data.member ? true : false);
    } catch (error) {
      console.error('Error fetching member data:', error);
      setIsMember(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('http://localhost:5000/api/cart', { headers });
      const data = await res.json();
      if (res.ok && data.cartItems) {
        setCartItems(data.cartItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchMemberData();
    fetchCartItems();

    document.title = 'Checkout - Halal Prani'
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * Number(item.price),
    0
  );

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to place your order.");
      setTimeout(() => {
        navigate('/my-account');
      }, 100);
      return;
    }

    const requiredBilling = ['name', 'phone', 'email', 'address', 'postcode'];
    const requiredShipping = ['name', 'street', 'district', 'postcode'];

    const isBillingInvalid = requiredBilling.some(
      (field) => !addresses.billing[field]?.trim()
    );

    const isSeparateShippingActive = addresses.shipping && addresses.shipping.name?.trim();

    const isShippingInvalid = isSeparateShippingActive
      ? requiredShipping.some((field) => !addresses.shipping[field]?.trim())
      : false;

    if (isBillingInvalid || (isSeparateShippingActive && isShippingInvalid)) {
      alert('Please fill in all required fields for billing and shipping.');
      return;
    }

    const orderData = {
      billing: addresses.billing,
      shipping: isSeparateShippingActive ? addresses.shipping : addresses.billing,
      orderNotes: orderNotesFromAddresses,
      cartItems,
      subtotal,
      shippingFee,
      coupon: appliedCoupon,
      isMember,
      paymentMethod: 'Cash on Delivery',
    };

    try {
      setPlacingOrder(true); 
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`/order-received/${data.orderNumber}`);
      } else {
        alert(data.message || 'Failed to place order');
      }
    } catch (error) {
      alert('Error placing order: ' + error.message);
    } finally {
      setPlacingOrder(false); 
    }
  };

  return (
    <>

     <nav className="cart-navbar">
        <div className="container">
          <NavLink to="/" className="home-link">Home</NavLink>
          <span className="icon"><IoIosArrowForward size={12} /></span>
          <span className="current-page">Checkout</span>
        </div>
        <h2>Checkout</h2>
      </nav>

      <div className="coupon-section">
        <CouponBox
          isMember={isMember}
          appliedCoupon={appliedCoupon}
          setAppliedCoupon={setAppliedCoupon}
        />
      </div>

      <div className="checkout-page-container">
        <div className="checkout-left">
          <CheckoutAddresses onAddressChange={handleAddressChange} />
        </div>

        <div className="checkout-right">
          <CheckoutItems isMember={isMember} appliedCoupon={appliedCoupon} />

          <button
            className="place-order-button"
            onClick={handlePlaceOrder}
            disabled={placingOrder} 
          >
            {placingOrder ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>

      <Footer/>
    </>
  );
}

export default CheckoutPage;
