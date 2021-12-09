const mongoose = require("mongoose");
const chatSchema = mongoose.Schema({
  u1: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: true,
  },
  u2: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: true,
  },
  lastMessage: {
    type: Date,
    default: Date.now,
  },
});
const Chat = mongoose.model("chat", chatSchema);
module.exports = Chat;
