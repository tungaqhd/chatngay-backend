const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "../public/avatars" });

const userController = require("../controllers/user.controller");

router.get("/me", userController.getProfile);
router.get("/", userController.findUser);
router.post("/", userController.updateUser);
module.exports = router;
