import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { IoEyeOutline, IoCartOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import '../styles/RelatedProducts.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Quickview from '../Quickview';
import { useAuth } from '../../store/Auth';

const RelatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingWishlistId, setLoadingWishlistId] = useState(null);
  const [loadingCartId, setLoadingCartId] = useState(null);

  const sliderRef = useRef(null);
  const viewportRef = useRef(null);
  const autoSlideInterval = useRef(null);
  const [productsPerRow, setProductsPerRow] = useState(4);
  const navigate = useNavigate();

  const { updateCartCount , updateWishCount } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const updateProductsPerRow = () => {
      if (window.innerWidth < 480) {
        setProductsPerRow(1);
      } else if (window.innerWidth < 768) {
        setProductsPerRow(2);
      } else if (window.innerWidth < 1024) {
        setProductsPerRow(3);
      } else {
        setProductsPerRow(4);
      }
    };

    updateProductsPerRow();
    window.addEventListener('resize', updateProductsPerRow);
    return () => window.removeEventListener('resize', updateProductsPerRow);
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const startAutoSlide = () => {
      clearInterval(autoSlideInterval.current);
      autoSlideInterval.current = setInterval(() => {
        if (!isDragging) {
          setTransitionEnabled(true);
          if (currentIndex >= products.length - productsPerRow) {
            setTransitionEnabled(false);
            setCurrentIndex(0);
            setTimeout(() => setTransitionEnabled(true), 50);
          } else {
            setCurrentIndex(prev => prev + 1);
          }
        }
      }, 5000);
    };

    startAutoSlide();
    return () => clearInterval(autoSlideInterval.current);
  }, [currentIndex, isDragging, productsPerRow, products.length]);

  const nextSlide = () => {
    setTransitionEnabled(true);
    if (currentIndex < products.length - productsPerRow) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setTransitionEnabled(false);
      setCurrentIndex(0);
      setTimeout(() => setTransitionEnabled(true), 50);
    }
  };

  const prevSlide = () => {
    setTransitionEnabled(true);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setTransitionEnabled(false);
      setCurrentIndex(products.length - productsPerRow);
      setTimeout(() => setTransitionEnabled(true), 50);
    }
  };

  const cleanPrice = (price) => {
    if (typeof price === "number") return price;
    if (!price) return 0;
    return parseFloat(price.replace(/,/g, '').trim());
  };

  const handleAddToWishlist = async (product) => {
    setLoadingWishlistId(product.id);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const productForWishlist = {
        productId: product._id || product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        stock_status: product.stock_status,
      };

      const res = await fetch('http://localhost:5000/api/wishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productForWishlist),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to add to wishlist');
      } else {
        updateWishCount();
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoadingWishlistId(null);
    }
  };

  const handleAddToCart = async (product) => {
    setLoadingCartId(product.id);
    try {
      const token = localStorage.getItem("token");
      let guestId = localStorage.getItem("guestId");

      if (!guestId) {
        guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem("guestId", guestId);
      }

      const payload = {
        productId: product._id || product.id,
        name: product.name,
        price: cleanPrice(product.price), 
        img: product.img,
        stock_status: product.stock_status,
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
        updateCartCount();
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Something went wrong.");
    } finally {
      setLoadingCartId(null);
    }
  };

  const slugify = (text) =>
    text?.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");

  return (
    <>
      <div className="related-products-container" data-aos='fade-up'>
        <h2 className="related-section-title">Our Products</h2>
        <div className="slider-wrapper" data-aos='fade-right'>
          <button className={`nav-button prev ${currentIndex === 0 ? 'disabled' : ''}`} onClick={prevSlide}>
            <FaArrowLeftLong />
          </button>

          <div className="slider-viewport" ref={viewportRef}>
            <div
              className="related-products-grid"
              ref={sliderRef}
              style={{
                transform: `translateX(-${currentIndex * (100 / productsPerRow)}%)`,
                transition: transitionEnabled ? 'transform 0.5s ease' : 'none'
              }}
            >
              {products.map((product) => (
                <Link
                  to={`/product/${slugify(product.name)}`}
                  key={product.id}
                  className="related-product-card"
                  style={{ flex: `0 0 ${100 / productsPerRow}%` }}
                >
                  <div className="related-product-image-container">
                    <img src={product.img} alt={product.name} className="related-product-image" />
                    <div className="related-product-hover-icons">
                      <button
                        className="icon-wrapper cart-icon"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        disabled={loadingCartId === product.id}
                      >
                        <IoCartOutline size={24} className="eid-cart-icon" />
                        <span className="tooltip">{loadingCartId === product.id ? "Adding..." : "ADD TO CART"}</span>
                      </button>
                      <button className="icon-wrapper" onClick={(e) => { e.preventDefault(); setSelectedProduct(product); }}>
                        <IoEyeOutline size={20} />
                        <span className="tooltip">Show in quick view</span>
                      </button>
                      <button
                        className="icon-wrapper"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToWishlist(product);
                        }}
                        disabled={loadingWishlistId === product.id}
                      >
                        <FaRegHeart className="eid-heart-icon" />
                        <span className="tooltip">
                          {loadingWishlistId === product.id ? 'Adding...' : 'Add to wishlist'}
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="related-product-info">
                    <div className="category-type">
                      <Link
                        to={`/product-category/${slugify(product.category)}`}
                        className="category-text"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {product.category?.toUpperCase()}
                      </Link>
                      {product.type && (
                        <>
                          <span> . </span>
                          <Link
                            to={`/product-category/${slugify(product.category)}/${slugify(product.type)}`}
                            className="type-text"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {product.type?.toUpperCase()}
                          </Link>
                        </>
                      )}
                    </div>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-price">
                      {cleanPrice(product.price).toLocaleString('en-US', {
                        minimumFractionDigits: 2
                      })} ৳
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <button className={`nav-button next ${currentIndex >= products.length - productsPerRow ? 'disabled' : ''}`} onClick={nextSlide}>
            <FaArrowRightLong />
          </button>
        </div>
      </div>

      {selectedProduct && (
        <Quickview product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
};

export default RelatedProducts;
