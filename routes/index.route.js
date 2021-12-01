const express = require("express");
const router = express.Router();
const authRouter = require("./auth.route");
const chatRouter = require("./chat.route");

router.use("/auth", authRouter);
router.use("/chat", chatRouter);

module.exports = router;
