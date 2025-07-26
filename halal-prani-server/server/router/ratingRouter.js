const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const { required } = require("../middlewares/auth-middleware");


router.post("/:productId", required, ratingController.submitRatingController);

router.get("/:productId", ratingController.getAverageRatingController);

router.get("/product/:productId", ratingController.getAllUserRatingsForProductController);


module.exports = router;
