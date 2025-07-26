const reviewService = require('../services/reviewService');

exports.createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { content } = req.body;

    const review = await reviewService.createReview({
      productId,
      userId: req.user._id,
      content,
    });

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewService.getReviewsByProduct(productId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getReviewCountByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const count = await reviewService.getReviewCountByProduct(productId);
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { content } = req.body;
    const updatedReview = await reviewService.updateReview({
      reviewId: req.params.id,
      userId: req.user._id,
      content,
    });

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(error.message === 'Unauthorized action' ? 403 : 404).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview({
      reviewId: req.params.id,
      userId: req.user._id,
    });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
