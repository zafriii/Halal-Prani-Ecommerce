import React, { useEffect, useState } from 'react';
import '../styles/Comparison.css';
import { FaStar, FaTrashAlt } from 'react-icons/fa';
import Loading from '../Loading';
import { NavLink } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import Footer from '../Footer';

const ComparisonPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComparisonData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/compare', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching comparison list:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromComparison = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/compare/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts((prev) => prev.filter((p) => p.productId !== productId));
    } catch (err) {
      console.error('Error removing from comparison:', err);
    }
  };

  useEffect(() => {
    fetchComparisonData();
    document.title = 'Comparison - Halal Prani'
  }, []);

  if (loading) return <Loading/>;

  if (products.length === 0) return <p className='no-products'>No products in comparison list.</p>;

  return (
    <>
    <nav className="cart-navbar">
        <div className="container">
          <NavLink to="/" className="home-link">Home</NavLink>
          <span className="icon"><IoIosArrowForward size={12} /></span>
          <span className="current-page">Comparison</span>
        </div>
        <h2>Comparison</h2>
      </nav>
      <div className="comparison-container">
      <h2>Product Comparison</h2>
      <p>Keep at least 2 products to compare</p>
      <div className="comparison-table">
        {products.map((product) => (
          <div className="comparison-card" key={product.productId}>
            <div className="image-wrapper">
              <img src={product.img} alt={product.name} />
              <button
                className="remove-icon"
                onClick={() => removeFromComparison(product.productId)}
              >
                &times;
              </button>
            </div>

            <div className="name-price-row">
              <h3>{product.name}</h3>
              <span className="price">{product.price} ৳</span>
            </div>

            <div className="rating-review-row">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={16}
                    color={product.averageRating >= i + 1 ? '#fabb05' : '#ccc'}
                  />
                ))}
                <span className='compare-rating'>{product.averageRating}</span>
              </div>
              <span className="review-summary">
              {product.totalReviews} reviews
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
     
     <Footer/>
    </>

  );
};

export default ComparisonPage;
