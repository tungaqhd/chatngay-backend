const { getUserId } = require("../common/jwt");
const Chat = require("../models/Chat.model");
const User = require("../models/User.model");
const Message = require("../models/Message.model");

exports.initChat = async (socket, token) => {
  try {
    const userId = await getUserId(token);
    if (token) {
      socket.join(userId);
    }
    await User.findByIdAndUpdate(userId, {
      isOnline: true,
      socketId: socket.id,
    });
  } catch (error) {
    console.log("initChat", error.message);
  }
};

exports.destroyCon = async (socket) => {
  try {
    await User.findOneAndUpdate(
      { socketId: socket.id },
      {
        isOnline: false,
        socketId: "",
      }
    );
  } catch (error) {
    console.log("destroyCon", error.message);
  }
};
