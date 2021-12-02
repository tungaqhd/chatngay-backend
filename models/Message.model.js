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
    msgType: {
      type: String,
      default: "text",
    },
    fileName: {
      type: String,
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
