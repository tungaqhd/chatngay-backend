const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chat.controller");

router.get("/:id", chatController.getChat);
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
