import React, { useEffect, useState } from 'react';
import '../styles/CartModal.css'; 
import { NavLink } from 'react-router-dom';
import Loading from '../Loading';
import { useAuth } from '../../store/Auth';

const CartModal = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);  
  const { updateCartCount } = useAuth()
  
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    const guestId = localStorage.getItem("guestId");

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) headers.Authorization = `Bearer ${token}`;
    else if (guestId) headers["x-guest-id"] = guestId;

    return headers;
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/cart", {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch cart items');
        const data = await res.json();
        setCartItems(data.cartItems || []);
      } catch (err) {
        console.error(err);
        setCartItems([]);
        updateCartCount();
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/,/g, '')) : item.price;
      return sum + price * item.quantity;
    }, 0);
    setSubtotal(total);
  }, [cartItems]);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const increaseQuantity = async (itemId) => {
    setUpdatingId(itemId);
    try {
      const res = await fetch(`http://localhost:5000/api/cart/increase/${itemId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to increase quantity");
      } else {
        setCartItems(data.cartItems);
        updateCartCount();
      }
    } catch (err) {
      console.error(err);
      alert("Error increasing quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const decreaseQuantity = async (itemId) => {
    setUpdatingId(itemId);
    try {
      const res = await fetch(`http://localhost:5000/api/cart/decrease/${itemId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to decrease quantity");
      } else {
        setCartItems(data.cartItems);
        updateCartCount();
      }
    } catch (err) {
      console.error(err);
      alert("Error decreasing quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (cartItemId) => {
    setUpdatingId(cartItemId);
    try {
      const res = await fetch(`http://localhost:5000/api/cart/remove/${cartItemId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to remove item");
      setCartItems(data.cartItems || cartItems.filter(item => item._id !== cartItemId));
      updateCartCount();
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h4>SHOPPING BAG <span className='shopping-span'>{totalQuantity}</span></h4> 
          <span className="close-btn" onClick={onClose}>×</span>
        </div>

        <div className="cart-body">
          {loading ? (
            <Loading/>
          ) : cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item) => {
              const price = Number(typeof item.price === 'string' ? item.price.replace(/,/g, '') : item.price);
              return (
                <div key={item._id} className="cart-item">
                  <img src={item.img} alt={item.name} />
                 
                  <div className="item-details">
                    <div className="name-delete-row">
                      <p className="item-name">{item.name}</p>
                      <button
                        className="cart-modal-delete-btn"
                        onClick={() => removeItem(item._id)}
                        title="Remove from cart"
                        disabled={updatingId === item._id}
                      >
                        &times;
                      </button>
                    </div>
                    
                    <span>
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        disabled={updatingId === item._id || item.quantity <= 1}
                        className="qty-btn"
                      >
                        -
                      </button>
                      <strong>{item.quantity}</strong>
                      <button
                        onClick={() => increaseQuantity(item._id)}
                        disabled={updatingId === item._id || item.quantity >= item.product_stock}
                        className="qty-btn"
                      >
                        +
                      </button>
                      &nbsp;× {price.toLocaleString('en-US', {minimumFractionDigits: 2})}৳
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <p className="free-shipping">🚚 Spend 100.00৳ to get free shipping</p>
            <div className="subtotal">
              SUBTOTAL : <strong>{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}৳</strong>
            </div>
            <div className="cart-buttons">
              <NavLink to="/cart" className="view-cart">
                <div className="btn-text">
                  <span className="top-text">View Cart</span>
                  <span className="bottom-text">View Cart</span>
                </div>
              </NavLink>
              <NavLink to="/checkout" className="checkout">
                <div className="btn-text">
                  <span className="top-text">Checkout</span>
                  <span className="bottom-text">Checkout</span>
                </div>
              </NavLink>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartModal;
