const User = require("../models/User.model");
exports.findUser = async (req, res) => {
  try {
    const content = req.query.content || "";
    const users = await User.find({
      $or: [
        { username: { $regex: content, $options: "i" } },
        { email: { $regex: content, $options: "i" } },
      ],
    });

    res.json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "An unexpected error has occurred" });
  }
};
