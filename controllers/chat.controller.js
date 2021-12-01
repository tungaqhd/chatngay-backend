const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
exports.getChat = async (req, res) => {
  try {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).send();
    }
    const messages = await Message.find({ chatId });

    res.json(messages);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "An unexpected error has occurred" });
  }
};
