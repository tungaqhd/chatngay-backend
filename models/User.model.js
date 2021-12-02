const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  avatar: {
    type: String,
    default: "user.png",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  socketId: {
    type: String,
  },
});
userSchema.methods.toJSON = function () {
  let user = this;
  user = user.toObject();
  delete user.password;
  delete user.socketId;
  return user;
};
const User = mongoose.model("user", userSchema);
module.exports = User;
