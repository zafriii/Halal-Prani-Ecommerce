const helpfulService = require("../services/helpfulService");

exports.toggleVote = async (req, res) => {
  const userId = req.user._id;
  const reviewId = req.params.reviewId;

  try {
    const result = await helpfulService.toggleHelpfulVote(reviewId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getVoteInfo = async (req, res) => {
  const userId = req.user._id;
  const reviewId = req.params.reviewId;

  try {
    const result = await helpfulService.getHelpfulCount(reviewId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
