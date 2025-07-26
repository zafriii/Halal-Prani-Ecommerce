const comparisonService = require('../services/comparisonService');
const Rating = require('../models/ratingModel');
const Review = require('../models/reviewModel');

exports.addToComparison = async (req, res) => {
  try {
    const userId = req.user._id;
    const productData = req.body;

    const updatedComparison = await comparisonService.addProductToComparison(userId, productData);
    res.status(200).json(updatedComparison);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getComparisonList = async (req, res) => {
  try {
    const userId = req.user._id;
    const comparison = await comparisonService.getComparison(userId);

    if (!comparison || comparison.products.length === 0) {
      return res.json({ products: [] });
    }

    const enhancedProducts = await Promise.all(
      comparison.products.map(async (item) => {

        const ratings = await Rating.find({ product: item.productId });
        const totalRatings = ratings.length;
        const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / (totalRatings || 1);

        const reviews = await Review.find({ productId: item.productId });
        const totalReviews = reviews.length;

        return {
          ...item._doc,
          averageRating: parseFloat(averageRating.toFixed(1)),
          totalRatings,
          totalReviews,
        };
      })
    );

    res.status(200).json({ products: enhancedProducts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromComparison = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const updatedComparison = await comparisonService.removeProductFromComparison(userId, productId);
    res.status(200).json(updatedComparison);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};