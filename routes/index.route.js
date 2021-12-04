const express = require("express");
const router = express.Router();
const authRouter = require("./auth.route");
const chatRouter = require("./chat.route");
const userRouter = require("./user.route");

const { userAuth } = require("../middlewares/user.middleware");

router.use("/auth", authRouter);
router.use("/chat", userAuth, chatRouter);
router.use("/user", userAuth, userRouter);

module.exports = router;
