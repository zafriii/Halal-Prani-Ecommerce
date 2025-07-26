const HelpfulVote = require("../models/helpfulVoteModel");

exports.toggleHelpfulVote = async (reviewId, userId) => {
  const existingVote = await HelpfulVote.findOne({ review: reviewId, user: userId });

  if (existingVote) {
    await HelpfulVote.deleteOne({ _id: existingVote._id });
    const count = await HelpfulVote.countDocuments({ review: reviewId });
    return { helpfulCount: count, voted: false };
  }

  await HelpfulVote.create({ review: reviewId, user: userId });
  const count = await HelpfulVote.countDocuments({ review: reviewId });
  return { helpfulCount: count, voted: true };
};

exports.getHelpfulCount = async (reviewId, userId) => {
  const helpfulCount = await HelpfulVote.countDocuments({ review: reviewId });
  const voted = await HelpfulVote.exists({ review: reviewId, user: userId });
  return { helpfulCount, voted: Boolean(voted) };
};
