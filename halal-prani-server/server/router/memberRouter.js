const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const { required } = require("../middlewares/auth-middleware");

router.route("/").post(required, memberController.createMember);

router.route("/").get(required, memberController.getMember);

module.exports = router;
