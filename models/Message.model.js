const mongoose = require("mongoose");
const messageSchema = mongoose.Schema(
  {
    from: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    replyToId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "message",
    },
    chatId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    msgType: {
      type: String,
      default: "text",
    },
    content: {
      type: String,
    },
    fileId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "file",
    },
  },
  {
    timestamps: true,
  }
);
const Message = mongoose.model("message", messageSchema);
module.exports = Message;
