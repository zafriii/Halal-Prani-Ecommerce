const express = require("express");
const router = express.Router();
const authcontrollers = require("../controllers/auth-controller");
const { required, optional } = require('../middlewares/auth-middleware');

router.route("/register").post(authcontrollers.register);
router.route("/login").post(authcontrollers.login);
router.route("/user").get(required, authcontrollers.user);
router.route("/edit-account").put(required, authcontrollers.editAccountController);

module.exports = router;
