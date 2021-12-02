const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
exports.userAuth = async (req, res, next) => {
  let token = null;

  try {
    const headerToken = req.headers["authorization"];
    if (!headerToken) {
      throw new Error();
    }
    token = headerToken.slice(7);
    if (!token) {
      throw new Error();
    }
  } catch (error) {
    return res.status(401).json({ msg: "Authentication failed" });
  }

  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ msg: "Your session is experied" });
  }

  try {
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      throw new Error("Authentication failed");
    }
    if (req.user.status === "banned") {
      throw new Error("You are banned");
    }
    next();
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
};
