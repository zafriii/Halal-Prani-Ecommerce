import React, { useEffect, useState } from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Cart.css';
import Loading from '../Loading';
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import Footer from '../Footer';
import { useAuth } from '../../store/Auth';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();
  const { updateCartCount } = useAuth()

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    const guestId = localStorage.getItem("guestId");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (guestId) {
      headers["x-guest-id"] = guestId;
    }
    return headers;
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load cart");
      setCartItems(data.cartItems || []);
      updateCartCount();
    } catch (err) {
      console.error(err);
      alert("Error loading cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Cart - Halal Prani'
    fetchCart();
  }, []);

  const increaseQuantity = async (cartItemId) => {
    setUpdatingId(cartItemId);
    try {
      const res = await fetch(`http://localhost:5000/api/cart/increase/${cartItemId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to increase quantity");
      setCartItems(data.cartItems);
      updateCartCount();
    } catch (err) {
      console.error(err);
      alert("Failed to increase quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const decreaseQuantity = async (cartItemId) => {
    setUpdatingId(cartItemId);
    try {
      const res = await fetch(`http://localhost:5000/api/cart/decrease/${cartItemId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to decrease quantity");
      setCartItems(data.cartItems);
      updateCartCount();
    } catch (err) {
      console.error(err);
      alert("Failed to decrease quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/remove/${cartItemId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to remove item");
      setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
      updateCartCount();
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart/clear", {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to clear cart");
      setCartItems([]);
      updateCartCount();
    } catch (err) {
      console.error(err);
      alert("Failed to clear cart");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * Number(item.price), 0);
  const shippingFee = 120;
  const total = subtotal + shippingFee;

  if (loading) return <Loading />;

  return (
    <>
      <nav className="cart-navbar">
        <div className="container">
          <NavLink to="/" className="home-link">Home</NavLink>
          <span className="icon"><IoIosArrowForward size={12} /></span>
          <span className="current-page">Cart</span>
        </div>
        <h2>Cart</h2>
      </nav>

      <div className="cart-container">
        <h2 className="cart-title">MY CART</h2>

        {cartItems.length === 0 ? (
          <p className="empty-text">Your cart is empty.</p>
        ) : (
          <div className="cart-content-wrapper">
            
            <div className="cart-left">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Product name</th>
                    <th>Unit price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => removeItem(item._id)}
                          title="Remove from cart"
                          disabled={updatingId === item._id}
                        >
                          &times;
                        </button>
                      </td>
                      <td className="product-info">
                        <img src={item.img} alt={item.name} className="cart-img" />
                        <span>{item.name}</span>
                      </td>
                      <td className='table-price'>{Number(item.price).toLocaleString()} ৳</td>
                      <td>
                        <div className="cart-quantity-control">
                          <button
                            onClick={() => decreaseQuantity(item._id)}
                            disabled={updatingId === item._id || item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => increaseQuantity(item._id)}
                            disabled={updatingId === item._id}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td >{(item.quantity * item.price).toLocaleString()} ৳</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="continue-shopping-wrapper">
                <NavLink to="/shop" className="continue-shopping-link">
                  <FaArrowLeftLong /> Continue Shopping
                </NavLink>
              </div>
            </div>
            <div className="cart-summary-box">
              <h3>Cart Total</h3>
              <p><strong>Subtotal:</strong> {subtotal.toLocaleString()} ৳</p>
              <p><strong>Shipping Fee:</strong> {shippingFee.toLocaleString()} ৳</p>
              <p className='total'><strong>Total:</strong> {total.toLocaleString()} ৳</p>
              <button className="clear-cart-btn" onClick={clearCart} disabled={updatingId !== null}>
                Clear Cart
              </button>
              <button className="checkout-btn" onClick={() => navigate('/checkout')} disabled={cartItems.length === 0}>
                Proceed to Checkout <FaArrowRightLong />
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default CartPage;
