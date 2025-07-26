const Review = require('../models/reviewModel');

exports.createReview = async ({ productId, userId, content }) => {
  const review = new Review({
    content,
    product: productId, 
    user: userId,
  });

  return await review.save();
};

exports.getReviewsByProduct = async (productId) => {
  return await Review.find({ product: productId })
    .populate('user', 'username')
    .sort({ createdAt: -1 });
};

exports.getReviewCountByProduct = async (productId) => {
  return await Review.countDocuments({ product: productId });
};

exports.updateReview = async ({ reviewId, userId, content }) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");

  if (review.user.toString() !== userId.toString()) {
    throw new Error("Unauthorized action");
  }

  review.content = content || review.content;
  return await review.save();
};


exports.deleteReview = async ({ reviewId, userId }) => {
  const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });
  if (!review) throw new Error("Review not found");
  return review;
};
