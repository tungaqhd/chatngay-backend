const mongoose = require("mongoose");
const fileSchema = mongoose.Schema(
  {
    size: {
      type: Number,
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const File = mongoose.model("file", fileSchema);
module.exports = File;
