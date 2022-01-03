const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
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

exports.updateUser = async (req, res) => {
  try {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        throw err;
      }
      if (files?.avatar) {
        const oldPath = files.avatar.filepath;
        const newPath = path.join(
          __dirname,
          `../public/avatars/${files.avatar.originalFilename}`
        );
        fs.renameSync(oldPath, newPath);
        req.user.avatar = files.avatar.originalFilename;
      }

      if (fields?.username) {
        req.user.username = fields.username;
      }
      if (fields?.name) {
        req.user.name = fields.name;
      }
      await req.user.save();
      res.json({ msg: "Your profile has been updated" });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "An unexpected error has occurred" });
  }
};
