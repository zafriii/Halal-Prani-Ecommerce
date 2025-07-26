const express = require("express");
const router = express.Router();
const downloadController = require("../controllers/downloadController");
const { required } = require("../middlewares/auth-middleware");

router
  .route("/")
  .post(required, downloadController.createDownloadLog)
  .get(required, downloadController.getUserDownloadLogs);

module.exports = router;
