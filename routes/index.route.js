const express = require("express");
const router = express.Router();
const authRouter = require("./auth.route");
const chatRouter = require("./chat.route");

const { userAuth } = require("../middlewares/user.middleware");

router.use("/auth", authRouter);
router.use("/chat", userAuth, chatRouter);

module.exports = router;
