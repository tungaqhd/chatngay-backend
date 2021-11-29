const jwt = require("jsonwebtoken");

const getUserId = async (token) => {
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

module.exports = { getUserId };
