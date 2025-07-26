const express = require("express");
const router = express.Router();
const helpfulController = require("../controllers/helpfulController");
const { required } = require("../middlewares/auth-middleware");

router.route("/:reviewId/toggle").post(required, helpfulController.toggleVote);

router.route("/:reviewId").get(required, helpfulController.getVoteInfo);

module.exports = router;
