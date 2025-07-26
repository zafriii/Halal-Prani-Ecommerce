const ratingService = require("../services/ratingService");

exports.submitRatingController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const savedRating = await ratingService.submitRating(userId, productId, rating);
    res.status(200).json(savedRating);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit rating", error: err.message });
  }
};

exports.getAverageRatingController = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await ratingService.getProductAverageRating(productId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch average rating", error: err.message });
  }
};


exports.getAllUserRatingsForProductController = async (req, res) => {
  try {
    const { productId } = req.params;
    const ratings = await ratingService.getAllUserRatingsForProduct(productId);
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch ratings for product",
      error: err.message,
    });
  }
};