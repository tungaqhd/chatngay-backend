const mongoose = require("mongoose");
const chatSchema = mongoose.Schema({
  u_1: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  u_2: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
});
const Chat = mongoose.model("chat", chatSchema);
module.exports = Chat;
