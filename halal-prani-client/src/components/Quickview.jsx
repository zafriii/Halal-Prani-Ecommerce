import React, { useState } from 'react';
import {
  FaFacebookF, FaTwitter, FaPinterestP, FaWhatsapp,
  FaTelegramPlane, FaEnvelope
} from "react-icons/fa";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import './styles/Quickview.css';
import { useAuth } from '../store/Auth';

function Quickview({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const { updateCartCount } = useAuth();

  const increase = () => setQuantity(q => q + 1);
  const decrease = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const cleanPrice = (price) => {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    return parseFloat(price.replace(/,/g, '').trim());
  };

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      const token = localStorage.getItem("token");
      let guestId = localStorage.getItem("guestId");

      if (!token && !guestId) {
        guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem("guestId", guestId);
      }

      const payload = {
        productId: product._id || product.id,
        name: product.name,
        price: cleanPrice(product.price), 
        img: product.img,
        stock_status: product.stock_status,
        quantity: quantity,
      };

      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(!token && { "x-guest-id": guestId }),
      };

      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to add to cart");
      } else {
        // alert(`"${product.name}" added to cart (x${quantity})`);
        updateCartCount();
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Something went wrong while adding to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}> &times; </button>

        <div className="modal-body">
          <div className="modal-img-wrapper">
            <img src={product.img} alt={product.name} className="modal-img" />
          </div>

          <div className="modal-info">
            <h2 className="modal-name">{product.name}</h2>

            <p className="modal-price-display">
              {cleanPrice(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })} ৳
            </p>

            <div className="modal-description">
              {product.description?.split('\n').map((line, index) => (
                <p key={index}>{line.trim()}</p>
              ))}
            </div>

            {product.dishes && (
              <p className="modal-dishes"><strong>Dishes:</strong> {product.dishes}</p>
            )}

            {product.popular_dishes && product.popular_dishes.length > 0 && (
              <p className="modal-dishes">
                <strong>Popular Dishes:</strong> {product.popular_dishes}
              </p>
            )}

            {product.cooking_style && product.cooking_style.length > 0 && (
              <p className="modal-dishes">
                <strong>Best suited cooking style:</strong> {product.cooking_style}
              </p>
            )}

            <div className="quantity-cart-wrapper">
              <div className="quantity-selector">
                <button onClick={decrease}><IoMdRemove /></button>
                <span>{quantity}</span>
                <button onClick={increase}><IoMdAdd /></button>
              </div>

              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={adding}
              >
                {adding ? 'ADDING...' : 'ADD TO CART'}
              </button>
            </div>

            <div className="share-icons">
              <span>Share</span>
              <FaFacebookF />
              <FaEnvelope />
              <FaTwitter />
              <FaTelegramPlane />
              <FaWhatsapp />
              <FaPinterestP />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quickview;
