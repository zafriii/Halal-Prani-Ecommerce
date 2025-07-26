import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { IoEyeOutline, IoCartOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ProductSection.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Quickview from "../Quickview";
import { useAuth } from '../../store/Auth';

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const navigate = useNavigate();

  const { updateCartCount, updateWishCount } = useAuth();


  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const slugify = (text) =>
    text?.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");

  const cleanPrice = (price) => {
    if (typeof price === "number") return price;
    if (!price) return 0;
    return parseFloat(price.replace(/,/g, '').trim());
  };

  const handleAddToWishlist = async () => {
    setLoadingWishlist(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/my-account");
        return;
      }

      const productForWishlist = {
        productId: product._id || product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        stock_status: product.stock_status,
      };

      const res = await fetch("http://localhost:5000/api/wishes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productForWishlist),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to add to wishlist");
      } else {
        updateWishCount();
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    setLoadingCart(true);
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
      setLoadingCart(false);
    }
  };

  return (
    <>
      <Link to={`/product/${slugify(product.name)}`} className="product-card-link">
        <div className="product-card" data-aos="fade-up">
          <div className="product-img-container">
            <img src={product.img} alt={product.name} className="product-img" />
            <div className="price-badge">
              {cleanPrice(product.price).toLocaleString("en-US", { minimumFractionDigits: 2 })} ৳
            </div>
          </div>

          <div className="hover-info">
            <p className="category-type">
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
            </p>

            <p className="product-name">{product.name}</p>

            <div className="icons">
              <button
                className="icon-wrapper cart-icon"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                disabled={loadingCart}
              >
                <IoCartOutline size={24} className="eid-cart-icon" />
                <span className="tooltip">
                  {loadingCart ? "Adding..." : "ADD TO CART"}
                </span>
              </button>

              <button
                className="icon-wrapper"
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
              >
                <IoEyeOutline size={20} />
                <span className="tooltip tooltip-eye">Show in quick view</span>
              </button>

              <button
                className="icon-wrapper"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToWishlist();
                }}
                disabled={loadingWishlist}
              >
                <FaHeart className="eid-heart-icon" />
                <span className="tooltip tooltip-heart">
                  {loadingWishlist ? "Adding..." : "Add to wishlist"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </Link>

      {showModal && (
        <Quickview product={product} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default ProductCard;
