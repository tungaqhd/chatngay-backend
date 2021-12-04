const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

router.get("/me", userController.getProfile);
router.get("/", userController.findUser);
module.exports = router;
