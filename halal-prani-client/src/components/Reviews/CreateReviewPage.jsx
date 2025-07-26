import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Review.css";


const CreateReviewPage = ({ productId }) => {
  const [reviewText, setReviewText] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!productId) {
      alert("Product ID is missing.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: reviewText })
      });

      if (response.ok) {
        setReviewText("");
        navigate(`/review/${productId}`);         
      } else {
        const errorData = await response.json();
        alert("Failed to submit review: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      alert("Error submitting review: " + error.message);
    }
  };

  return (
    <div className="review-form-container">
      <h3>Add a Review</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
          required
        />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default CreateReviewPage;
