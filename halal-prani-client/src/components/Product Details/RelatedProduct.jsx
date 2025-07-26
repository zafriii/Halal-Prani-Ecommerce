import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import '../styles/RelatedProduct.css';
import Quickview from "../Quickview";
import { useAuth } from '../../store/Auth';  

const slugify = (text) =>
  text?.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

const RelatedProducts = ({ currentProduct }) => {
  const [related, setRelated] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingCartIds, setLoadingCartIds] = useState([]); 
  const { updateCartCount } = useAuth(); 

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/type/${currentProduct.type}`
        );
        const data = await res.json();
        const filtered = data
          .filter((item) => item.name !== currentProduct.name)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setRelated(filtered);
      } catch (err) {
        console.error("Error loading related products", err);
      }
    };

    if (currentProduct?.type) fetchRelated();
  }, [currentProduct]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  const cleanPrice = (price) => {
    if (typeof price === "number") return price;
    if (!price) return 0;
    return parseFloat(price.replace(/,/g, '').trim());
  };

  const handleAddToCart = async (product) => {
    setLoadingCartIds((ids) => [...ids, product.id || product._id]);
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
      setLoadingCartIds((ids) => ids.filter((id) => id !== (product.id || product._id)));
    }
  };

  if (!related.length) return null;

  return (
    <>
      <div className="related-products-wrapper">
        <h2>Related Products</h2>
        <div className="product-cards-grid">
          {related.map((product) => {
            const isLoading = loadingCartIds.includes(product.id || product._id);
            return (
              <div className="single-product-card" key={product.id || product._id}>
                <Link to={`/product/${slugify(product.name)}`} className="card-link">
                  <div className="product-image-area">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="product-main-image"
                    />
                    <div className="product-quick-actions">
                      <button
                        type="button"
                        className="action-button-wrapper quick-view-button"
                        onClick={(e) => {
                          e.preventDefault();
                          openModal(product);
                        }}
                      >
                        QUICK VIEW
                      </button>
                    </div>
                  </div>

                  <div className="product-details-box">
                    <div className="product-category-type">
                      <p className="category-label">
                        <Link
                          to={`/product-category/${slugify(product.category)}`}
                          className="category-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {product.category.toUpperCase()}
                        </Link>
                        {product.type && (
                          <>
                            <span> . </span>
                            <Link
                              to={`/product-category/${slugify(product.category)}/${slugify(product.type)}`}
                              className="type-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {product.type.toUpperCase()}
                            </Link>
                          </>
                        )}
                      </p>
                    </div>

                    <h3 className="product-title">{product.name}</h3>

                    <div className="price-cart-toggle-area">
                      <div className="product-cost-display">
                        {cleanPrice(product.price).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })} ৳
                      </div>

                      <button
                        type="button"
                        className="add-to-cart-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        disabled={isLoading}
                      >
                       <IoCartOutline className='product-cart-icon' size={20} />  {isLoading ? "Adding..." : "ADD TO CART"}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && selectedProduct && (
        <Quickview product={selectedProduct} onClose={closeModal} />
      )}
    </>
  );
};

export default RelatedProducts;
