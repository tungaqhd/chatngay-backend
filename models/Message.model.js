const mongoose = require("mongoose");
const messageSchema = mongoose.Schema(
  {
    from: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    chatId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Message = mongoose.model("message", messageSchema);
module.exports = Message;
