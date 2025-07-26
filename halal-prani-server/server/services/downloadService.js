const DownloadLog = require('../models/downloadModel');

exports.logDownload = async (userId, orderNumber) => {
  return await DownloadLog.create({ userId, orderNumber });
};

exports.getUserDownloads = async (userId) => {
  return await DownloadLog.find({ userId }).sort({ downloadedAt: -1 });
};
