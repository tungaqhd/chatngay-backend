const User = require("../models/User.model");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  const { username, name, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0]["msg"] });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ msg: "This email is registered with another account" });
    }
    user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ msg: "This username is registered with another account" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    user = User({
      username,
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 36000,
    });

    res.json({ token: jwtToken });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "An unexpected error has occurred" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0]["msg"] });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Invalid username or password" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ msg: "Invalid username or password" });
    }
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 36000,
    });
    res.json({ token: jwtToken });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "An unexpected error has occurred" });
  }
};
