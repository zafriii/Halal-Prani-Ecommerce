import React, { useEffect, useState } from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { NavLink, useNavigate } from 'react-router-dom';
import { FaCartPlus } from 'react-icons/fa';
import '../styles/Wishlist.css';
import Loading from '../Loading';
import ConfirmModal from '../ConfirmModal';
import Footer from '../Footer'
import { useAuth } from '../../store/Auth';

function Wishtable() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmData, setConfirmData] = useState({ show: false, id: null });
  const navigate = useNavigate();

   const { updateWishCount} = useAuth();

  const fetchWishlist = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to see your wishlist.');
      navigate('/login');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/wishes', {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      const data = await res.json();
      setWishlistItems(data);
      updateWishCount();
    } catch (err) {
      console.error(err);
      alert('Error loading wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    document.title = 'Wishlist - Halal Prani'
  }, []);

  const confirmDelete = (id) => {
    setConfirmData({ show: true, id });
  };

  const handleConfirmedDelete = async () => {
    const id = confirmData.id;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first.');
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/wishes/${id}`, {  
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },  
      });
      if (!res.ok) throw new Error('Failed to delete item');
      setWishlistItems((prev) => prev.filter((item) => item._id !== id));
      updateWishCount();
    } catch (err) {
      console.error(err);
      alert('Error deleting item');
    } finally {
      setConfirmData({ show: false, id: null });
    }
  };

  const handleAddToCart = async (item) => {
    try {
      const token = localStorage.getItem("token");
      let guestId = localStorage.getItem("guestId");

      if (!guestId) {
        guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem("guestId", guestId);
      }

      const payload = {
        productId: item.productId || item._id || item.id,
        name: item.name,
        price: Number(
          typeof item.price === "string"
            ? item.price.replace(/,/g, "")
            : item.price
        ),
        img: item.img,
        stock_status: item.stock_status,
        quantity: 1,
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
        // alert("Product added to cart!");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Something went wrong.");
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <nav className="wish-navbar">
        <div className="container">
          <NavLink to="/" className="home-link">Home</NavLink>
          <span className="wish-icon"><IoIosArrowForward size={12} /></span>
          <span className="current-page">Wishlist</span>
        </div>
        <h2>Wishlist</h2>
      </nav>

      <div className="wishlist-container">
        <h2 className="wishlist-title">MY WISHLIST</h2>

        {wishlistItems.length === 0 ? (
          <p className="empty-text">Your wishlist is empty.</p>
        ) : (
          <table className="wishlist-table">
            <thead>
              <tr>
                <th></th>
                <th>Product name</th>
                <th>Unit price</th>
                <th>Stock Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {wishlistItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => confirmDelete(item._id)}
                      title="Remove from wishlist"
                    >
                      &times;
                    </button>
                  </td>
                  <td className="product-info">
                    <img src={item.img} alt={item.name} className="wishlist-img" />
                    <span>{item.name}</span>
                  </td>
                  <td>{Number(item.price.replace(/,/g, '')).toLocaleString()} ৳</td>
                  <td>{item.stock_status}</td>
                  <td>
                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(item)}>
                      <FaCartPlus /> ADD TO CART
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {confirmData.show && (
        <ConfirmModal
          message="Are you sure you want to remove this item from your wishlist?"
          type="confirm"
          onClose={() => setConfirmData({ show: false, id: null })}
          onConfirm={handleConfirmedDelete}
        />
      )}

      <Footer/>
    </>
  );
}

export default Wishtable;
