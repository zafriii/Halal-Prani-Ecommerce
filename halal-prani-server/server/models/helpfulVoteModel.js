const mongoose = require('mongoose');

const helpfulVoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      required: true,
    },
  },
  { timestamps: true }
);

helpfulVoteSchema.index({ user: 1, review: 1 }, { unique: true });

module.exports = mongoose.model('HelpfulVote', helpfulVoteSchema);
