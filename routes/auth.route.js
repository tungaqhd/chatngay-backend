const express = require("express");
const router = express.Router();

const authValidation = require("../validation/authValidation");

const authController = require("../controllers/auth.controller");

router.post("/register", authValidation.register(), authController.register);
router.post("/login", authValidation.login(), authController.login);
// router.post(
//   "/forgot-password",
//   authValidation.forgotPassword(),
//   authController.forgotPassword
// );
// router.post(
//   "/reset-password",
//   authValidation.resetPassword(),
//   authController.resetPassword
// );
// router.post("/active", authController.active);
module.exports = router;
