const mongoose = require('mongoose');

const downloadLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  orderNumber: {
    type: String,
    required: true
  },
  downloadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DownloadLog', downloadLogSchema);
