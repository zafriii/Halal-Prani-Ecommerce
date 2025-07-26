import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/ProductDetails.css';
import { IoIosArrowForward } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { TbTruck } from "react-icons/tb";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { GoGitCompare } from "react-icons/go";
import {
  FaFacebookF, FaTwitter, FaPinterestP,
  FaWhatsapp, FaTelegramPlane, FaEnvelope
} from "react-icons/fa";
import { FaArrowLeftLong, FaArrowRightLong , FaChevronDown, FaChevronUp} from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import Loading from '../Loading';
import CreateReviewPage from '../Reviews/CreateReviewPage';
import StarRating from '../Ratings/StarRating';
import { useAuth } from '../../store/Auth';


const slugify = (text) =>
  text?.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

const cleanPrice = (price) => {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  return parseFloat(price.replace(/,/g, '').trim());
};

const ProductDetailsPage = () => {
  const { productName } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [addingCart, setAddingCart] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState({ averageRating: 0, totalRatings: 0 });

  const [showReviewForm, setShowReviewForm] = useState(false);

  const { updateCartCount , updateWishCount} = useAuth();

  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };


  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Halal Prani`;
    }
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products`);
        const data = await res.json();
        const found = data.find((p) => slugify(p.name) === productName);
        setProduct(found);
        setSelectedImageIndex(0);

        if (found?._id) {
          const countRes = await fetch(`http://localhost:5000/api/reviews/${found._id}`);
          const reviews = await countRes.json();
          setReviewCount(reviews.length || 0);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      }
    };

    fetchProduct();
  }, [productName]);

  const thumbnails = product ? [product.img, product.img, product.img] : [];

  useEffect(() => {
    if (thumbnails.length === 0) return;
    const interval = setInterval(() => {
      setSelectedImageIndex(prev =>
        prev === thumbnails.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [thumbnails.length]);

  const formattedPrice = product
    ? cleanPrice(product.price).toLocaleString('en-US', {
        minimumFractionDigits: 2,
      })
    : '';

  const increase = () => setQuantity(q => q + 1);
  const decrease = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handlePrev = () => {
    setSelectedImageIndex(prev =>
      prev === 0 ? thumbnails.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex(prev =>
      prev === thumbnails.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToWishlist = async () => {
    setLoadingWishlist(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingWishlist(false);
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
        alert(`${data.message || 'Failed to add to wishlist'}`);
      } else {
        updateWishCount();
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    setAddingCart(true);
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
        updateCartCount();
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Something went wrong while adding to cart.");
    } finally {
      setAddingCart(false);
    }
  };

   const handleRating = async (stars) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login to rate the product");

    try {
      const res = await fetch(`http://localhost:5000/api/ratings/${product._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: stars }),
      });
      const data = await res.json();
      setUserRating(data.rating || stars);
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating.");
    }
  };

  useEffect(() => {
  if (!product?._id) return;

  const fetchAverageRating = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/ratings/${product._id}`);
      const data = await res.json();
      setAverageRating(data);
    } catch (err) {
      console.error("Failed to fetch average rating", err);
    }
  };

  fetchAverageRating();
}, [product]);


const handleAddToCompare = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login to compare products");
      return;
    }

    const payload = {
      productId: product._id,
      name: product.name,
      img: product.img,
      price: product.price
    };

    const res = await fetch("http://localhost:5000/api/compare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to add to comparison");
    } else {
      // alert(data.message || " add to comparison");;
    }
  } catch (err) {
    console.error("Compare error:", err);
    alert("Something went wrong while adding to comparison");
  }
};

  if (!product) return <Loading />;

  return (
    <div className="product-detail-container">
       <div className="breadcrumb-wrapper">
      <nav className="breadcrumb">
        <Link className='breadcrumb-home-link' to="/">Home</Link> <IoIosArrowForward />{' '}
        <Link to="/shop">Shop</Link> <IoIosArrowForward />{' '}
        <Link to={`/product-category/${slugify(product.category)}`}>{product.category}</Link>{' '}
        <div className="product-detail-breadcumb">
          {product.type && (
          <>
            <IoIosArrowForward /> <Link to={`/product-category/${slugify(product.category)}/${slugify(product.type)}`}>{product.type}</Link>
          </>
        )}
        <IoIosArrowForward /> <span>{product.name}</span>
        </div>
       
      </nav>

      </div>

      <div className="product-detail-content">
        <div className="product-images">
          <div className="thumbnails">
            {thumbnails.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`thumb-${index}`}
                className={selectedImageIndex === index ? "active-thumb" : ""}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>

          <div className="main-image zoom-wrapper">
            <img
              src={thumbnails[selectedImageIndex]}
              alt={product.name}
              className="zoom-image"
            />
            <button className="slider-btn prev" onClick={handlePrev}><FaArrowLeftLong /></button>
            <button className="slider-btn next" onClick={handleNext}><FaArrowRightLong /></button>
          </div>
        </div>

        <div className="product-info">
          <h2 className='product-name'>{product.name}</h2>
          <h3 className="product-price">{formattedPrice}৳</h3>

          <div className="average-rating">
          <strong>{(averageRating.averageRating ?? 0).toFixed(1)} / 5 </strong> ( {averageRating.totalRatings} {averageRating.totalRatings === 1 ? "rating" : "ratings"} )

          <div className="star-rating-details">
             {[...Array(5)].map((_, i) => {
              const ratingValue = i + 1;
              return (
                <FaStar
                  key={i}
                  size={18}
                  color={
                    averageRating.averageRating >= ratingValue
                      ? "#fbb91a" 
                      : averageRating.averageRating >= ratingValue - 0.5
                      ? "#fddf8a" 
                      : "#ccc"    
                  }
                />
              );
            })}
        </div>
        </div>

        <div className="review-overview">
           {reviewCount === 0 ? (
            <p>No reviews yet. Be the first one to review!</p>
          ) : (
            <>
             <p><strong>{reviewCount}</strong> {reviewCount === 1 ? "Review" : "Reviews"}</p>
              <Link to={`/review/${product._id}`} className="see-reviews-link">
                See all reviews <FaArrowRightLong className='review-link'/>
              </Link>              
              </>
              )}
          </div>


          <div className="product-description">
            {product.description?.split('\n').map((line, index) => (
              <p key={index}>{line.trim()}</p>
            ))}
          </div>

          {product.dishes && (
            <p className="product-extra-info">
              <strong>Dishes:</strong> {product.dishes}
            </p>
          )}

          {product.popular_dishes && (
            <p className="product-extra-info">
              <strong>Popular Dishes:</strong> {product.popular_dishes}
            </p>
          )}

          {product.cooking_style && (
            <p className="product-extra-info">
              <strong>Best suited cooking style:</strong> {product.cooking_style}
            </p>
          )}

          <div className="quantity-cart-wrapper">
            <div className="quantity-selector">
              <button onClick={decrease}><IoMdRemove /></button>
              <span>{quantity}</span>
              <button onClick={increase}><IoMdAdd /></button>
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={addingCart}>
              {addingCart ? 'ADDING...' : 'ADD TO CART'}
            </button>
          </div>

          <button
            className="wishlist-btn"
            onClick={handleAddToWishlist}
            disabled={loadingWishlist}
          >
            <CiHeart size={24} /> {loadingWishlist ? 'ADDING...' : 'ADD TO WISHLIST'}
          </button>

          <p className="product-categories">
            <strong>Categories:</strong> {product.category}{product.type && `, ${product.type}`}
          </p>

        <div className="rating-section">
          <p>Your Rating:</p>
          <StarRating  rating={userRating} onRate={handleRating} editable />
        </div>
                   
          <CreateReviewPage productId={product._id} />

          <p className="shipping-info">
            <TbTruck className='shipping-icon' size={20} /> Spend <span className="highlight">100.00৳</span> to get free shipping
          </p>

          <p className="compare-btn" onClick={handleAddToCompare}>
          <GoGitCompare className='compare-icon' /> Compare
          </p>
       
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
  );
};

export default ProductDetailsPage;
