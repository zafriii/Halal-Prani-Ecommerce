const Rating = require("../models/ratingModel");
const mongoose = require("mongoose"); 

exports.submitRating = async (userId, productId, ratingValue) => {
  let rating = await Rating.findOne({ user: userId, product: productId });

  if (rating) {
    rating.rating = ratingValue;
    await rating.save();
  } else {
    rating = new Rating({
      user: userId,
      product: productId,
      rating: ratingValue,
    });
    await rating.save();
  }

  return rating;
};


exports.getProductAverageRating = async (productId) => {
  const result = await Rating.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId), 
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  return result[0] || { averageRating: 0, totalRatings: 0 };
};


exports.getAllUserRatingsForProduct = async (productId) => {
  const ratings = await Rating.find({ product: productId }).select("user rating");
  return ratings;
};
