import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../store/Auth";
import Loading from '../Loading';
import Footer from '../Footer';
import { FiEdit } from "react-icons/fi";      
import { IoMdClose } from "react-icons/io";  
import { FaStar } from "react-icons/fa";
import ConfirmModal from "../ConfirmModal";

const ProductReviewPage = () => {
  const { productId } = useParams();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState("");
  const [productName, setProductName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [helpfulInfo, setHelpfulInfo] = useState({});
  const [userRatings, setUserRatings] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/reviews/${productId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error("Failed to fetch reviews");

        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
        setReviews([]);
      }
    };

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const product = await res.json();
        setProductName(product.name);
      } catch (err) {
        console.error(err);
        setProductName("Product");
      }
    };

    const fetchUserRatings = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/ratings/product/${productId}`);
        if (!res.ok) throw new Error("Failed to fetch user ratings");
        const ratings = await res.json();

        const map = {};
        ratings.forEach(r => {
          const userId = typeof r.user === "object" && r.user?._id ? r.user._id : r.user;
          if (userId) map[userId] = r.rating;
        });

        setUserRatings(map);
      } catch (err) {
        console.error("Failed to fetch user ratings", err);
        setUserRatings({});
      }
    };

    fetchReviews();
    fetchProduct();
    fetchUserRatings();

    setLoading(false);
  }, [productId]);

  useEffect(() => {
    if (reviews.length === 0) return;

    const token = localStorage.getItem("token");

    const fetchHelpfulInfoForReview = async (reviewId) => {
      try {
        const res = await fetch(`http://localhost:5000/api/helpful/${reviewId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch helpful info");
        return await res.json();
      } catch (err) {
        console.error(err);
        return { helpfulCount: 0, voted: false };
      }
    };

    const fetchAllHelpfulInfo = async () => {
      const results = await Promise.all(
        reviews.map(r => fetchHelpfulInfoForReview(r._id))
      );
      const info = {};
      reviews.forEach((r, idx) => {
        info[r._id] = results[idx];
      });
      setHelpfulInfo(info);
    };

    fetchAllHelpfulInfo();
  }, [reviews]);

  const handleToggleHelpful = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/my-account");

    try {
      const res = await fetch(`http://localhost:5000/api/helpful/${reviewId}/toggle`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to toggle helpful vote");
      const data = await res.json();
      setHelpfulInfo(prev => ({
        ...prev,
        [reviewId]: {
          helpfulCount: data.helpfulCount,
          voted: data.voted,
        }
      }));
    } catch (err) {
      console.error(err);
      alert("Error updating helpful vote");
    }
  };

  const handleSaveEdit = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/my-account");
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editText }),
      });
      if (!res.ok) throw new Error("Update failed");
      const updatedReview = await res.json();
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? updatedReview : r))
      );
      setEditingReviewId(null);
      setEditText("");
    } catch (err) {
      console.error(err);
      alert("Failed to update review");
    }
  };

  const confirmDelete = (reviewId) => setConfirmDeleteId(reviewId);
  const cancelDelete = () => setConfirmDeleteId(null);

  const handleDelete = async () => {
    const reviewId = confirmDeleteId;
    const token = localStorage.getItem("token");
    if (!token) return navigate("/my-account");
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      setHelpfulInfo(prev => {
        const copy = { ...prev };
        delete copy[reviewId];
        return copy;
      });
      setConfirmDeleteId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete review");
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="review-card-container">
        <h2><span className="review-product-name">{productName}</span> Reviews</h2>
        {reviews.length === 0 && <p className="no-reviews">No reviews yet.</p>}

        {reviews.map((review) => {
          const isOwner = String(review.user?._id || review.user) === String(user?._id);
          const helpful = helpfulInfo[review._id] || { helpfulCount: 0, voted: false };
          const userId = review.user?._id || review.user;
          const rating = userRatings[userId] || 0;

          return (
            <div key={review._id} className="review-card" style={{ position: "relative" }}>
              <p className="review-username">
                {review.user?.username || "User"}
                <span className="user-rating-stars" style={{ marginLeft: "8px" }}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={14} color={i < rating ? "#fbb91a" : "#ccc"} />
                  ))}
                </span>
              </p>

              {isOwner && editingReviewId !== review._id && (
                <div className="review-icon-actions">
                  <FiEdit
                    className="icon edit-icon"
                    onClick={() => {
                      setEditingReviewId(review._id);
                      setEditText(review.content);
                    }}
                    title="Edit Review"
                  />
                  <IoMdClose
                    className="icon delete-icon"
                    onClick={() => confirmDelete(review._id)}
                    title="Delete Review"
                  />
                </div>
              )}

              {editingReviewId === review._id ? (
                <>
                  <textarea
                    className="review-edit-textarea"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button className="editing-btn" onClick={() => handleSaveEdit(review._id)}>Save</button>
                  <button className="cancel-btn" onClick={() => { setEditingReviewId(null); setEditText(""); }}>Cancel</button>
                </>
              ) : (
                <>
                  <p className="review-content">{review.content}</p>

                  {!isOwner && (
                    <>
                      <button
                        className={`helpful-btn ${helpful.voted ? "voted" : ""}`}
                        onClick={() => handleToggleHelpful(review._id)}
                        disabled={!user}
                        title={user ? "Mark as Helpful" : "Login to mark helpful"}
                      >
                        {helpful.voted ? "Undo Helpful" : "Helpful"}
                      </button>
                      <p className="helpful-count">
                        {helpful.helpfulCount} {helpful.helpfulCount === 1 ? "person" : "people"} found this helpful
                      </p>
                    </>
                  )}

                  {isOwner && (
                    <p className="helpful-count">
                      {helpful.helpfulCount} {helpful.helpfulCount === 1 ? "person" : "people"} found this helpful
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {confirmDeleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this review?"
          type="danger"
          onConfirm={handleDelete}
          onClose={cancelDelete}
        />
      )}

      <Footer />
    </>
  );
};

export default ProductReviewPage;
