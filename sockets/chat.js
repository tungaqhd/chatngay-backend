const xss = require("xss");
const { getUserId } = require("../common/jwt");
const Chat = require("../models/Chat.model");
const User = require("../models/User.model");
const Message = require("../models/Message.model");

exports.joinRoom = async (socket, token, chatId) => {
  try {
    const from = await getUserId(token);
    if (!from) {
      return;
    }

    const chat = await Chat.findById(chatId);
    if (chat.u1.toString() !== from && chat.u2.toString() !== from) {
      return;
    }
    socket.join(chatId);
  } catch (error) {
    console.log("joinRoom", error.message);
  }
};

exports.sendMessage = async (io, token, to, payload) => {
  try {
    const data = JSON.parse(payload);
    const from = await getUserId(token);
    if (!from) {
      return;
    }
    if (data.content) {
      if (data.content.length > 1000) {
        io.to(from).emit(
          "receiveMessage",
          "The maximum message length is 1000 characters"
        );
        return;
      }
      data.content = xss(data.content);
    }

    let chat = await Chat.findOne({
      $or: [
        {
          $and: [
            {
              u1: from,
            },
            {
              u2: to,
            },
          ],
        },
        {
          $and: [
            {
              u1: to,
            },
            {
              u2: from,
            },
          ],
        },
      ],
    });
    if (!chat) {
      chat = new Chat({ u1: from, u2: to });
      await chat.save();
    }
    const message = new Message({ chatId: chat._id, from, ...data });
    await message.save();
    io.to(chat.u1.toString()).emit("newMessages", message);
    io.to(chat.u2.toString()).emit("newMessages", message);
  } catch (error) {
    console.log("sendMessage", error.message);
  }
};
