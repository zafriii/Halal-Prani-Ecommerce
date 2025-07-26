const downloadService = require('../services/downloadService');

exports.createDownloadLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderNumber } = req.body;

    if (!orderNumber) {
      return res.status(400).json({ message: "Order number is required." });
    }

    const log = await downloadService.logDownload(userId, orderNumber);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: "Error logging download.", error: err.message });
  }
};

exports.getUserDownloadLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const logs = await downloadService.getUserDownloads(userId);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching download logs.", error: err.message });
  }
};
