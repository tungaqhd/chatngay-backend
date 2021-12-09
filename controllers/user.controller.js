const User = require("../models/User.model");

exports.getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "An unexpected error has occurred" });
  }
};

exports.findUser = async (req, res) => {
  try {
    const content = req.query.content || "";
    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: content, $options: "i" } },
            { email: { $regex: content, $options: "i" } },
          ],
        },
        {
          _id: {
            $ne: req.user._id,
          },
        },
      ],
    });

    res.json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "An unexpected error has occurred" });
  }
};
