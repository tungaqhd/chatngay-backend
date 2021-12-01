const { getUserId } = require("../common/jwt");
const Chat = require("../models/Chat.model");
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

exports.sendMessage = async (io, token, to, content) => {
  try {
    // if (message.length > 200) {
    //     io.to("home").emit(
    //       "alert",
    //       "error",
    //       "Maximum length of message is 200 characters!"
    //     );
    //     return;
    //   }

    //   let user;
    //   try {
    //     let token = jwt.verify(payload, process.env.JWT_TOKEN);
    //     user = await User.findById(token.id);
    //   } catch (e) {
    //     console.log(e);
    //   }
    //   message = xss(message);
    //   message = linkifyHtml(message, {
    //     defaultProtocol: "https",
    //   });
    //   let timer = moment().format("MMMM Do YYYY, h:mm:ss a");
    //   const messageSave = Message({
    //     userId: user._id,
    //     message,
    //     username: user.username,
    //     avatar: user.avatar,
    //     time: timer,
    //   });
    //   await messageSave.save();

    //   io.to("home").emit(
    //     "receiveMessage",
    //     user.username,
    //     message,
    //     timer,
    //     user.avatar,
    //     messageSave._id
    //   );

    const from = await getUserId(token);
    if (!from) {
      return;
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
    const message = new Message({ chatId: chat._id, from, content });
    await message.save();
    io.to(chat._id.toString()).emit("newMessages", message);
  } catch (error) {
    console.log("sendMessage", error.message);
  }
};
