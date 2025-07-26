import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, NavLink } from 'react-router-dom';
import { IoCartOutline } from 'react-icons/io5';
import '../styles/ProductGridSection.css';
import Quickview from '../Quickview';
import Loading from '../Loading';
import { useAuth } from '../../store/Auth';

const ProductGridSection = () => {
  const { categoryName, typeName, productName } = useParams();
  const [searchParams] = useSearchParams();
  const orderBy = searchParams.get('orderby');
  const order = searchParams.get('order');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [addingToCartId, setAddingToCartId] = useState(null);
  const productsPerPage = 20;

  const { updateCartCount } = useAuth();

  const slugify = (text) =>
    text?.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();

        let filtered = data;

        if (productName) {
          filtered = filtered.filter((product) =>
            product.name.toLowerCase().includes(productName.toLowerCase())
          );
        }

        if (categoryName) {
          filtered = filtered.filter(
            (product) => slugify(product.category) === categoryName.toLowerCase()
          );
        }

        if (typeName) {
          filtered = filtered.filter(
            (product) => slugify(product.type) === typeName.toLowerCase()
          );
        }

        if (orderBy === 'date') {
          filtered = filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        }

        if (orderBy === 'price') {
          filtered = filtered.sort((a, b) => {
            const priceA = parseFloat(a.price.replace(/,/g, ''));
            const priceB = parseFloat(b.price.replace(/,/g, ''));
            return order === 'asc' ? priceA - priceB : priceB - priceA;
          });
        }

        setProducts(filtered);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, typeName, productName, orderBy, order]);

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  const handleAddToCart = async (product) => {
    setAddingToCartId(product.id || product._id);
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
        price: Number(
          typeof product.price === "string"
            ? product.price.replace(/,/g, "")
            : product.price
        ),
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
        updateCartCount()
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Something went wrong.");
    } finally {
      setAddingToCartId(null);
    }
  };

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const next = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  if (loading) return <Loading />;
  if (error) return <div className="error-message">Error: {error.message}</div>;

  return (
    <>
      <section className="shop-product-display">
        <div className="product-display-wrapper">
          {productName && (
            <h2 className="search-section-title">
              Search Results for <span className="highlighted-name">"{productName}"</span>
            </h2>
          )}

          {products.length === 0 ? (
            <>
              <div className="no-results-message">No products found.</div>
              <div className="search-go-back">
                <button>
                  <NavLink to='/shop'>Back to shop</NavLink>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="product-cards-grid">
                {currentProducts.map((product) => (
                  <div className="single-product-card" key={product.id}>
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
                            {Number(product.price.replace(/,/g, '')).toLocaleString('en-US', {
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
                            disabled={addingToCartId === product.id}
                          >
                            <IoCartOutline className='product-cart-icon' size={20} />
                            {addingToCartId === (product.id || product._id) ? 'ADDING...' : 'ADD TO CART'}
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination-container">
                  <button
                    className="pagination-button"
                    onClick={prev}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="pagination-button"
                    onClick={next}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {selectedProduct && <Quickview product={selectedProduct} onClose={closeModal} />}
    </>
  );
};

export default ProductGridSection;













