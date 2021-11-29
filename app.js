require("dotenv").config();
const db = require("./config/database");
db();

// const Message = require("./models/message.model");
const User = require("./models/User.model");
const Chat = require("./models/Chat.model");

const jwtService = require("./common/jwt");

const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const jwt = require("jsonwebtoken");
const xss = require("xss");
const moment = require("moment");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// const linkifyHtml = require("linkifyjs/html");

let totalOnline = 0;
io.on("connection", async (socket) => {
  socket.on("getChatList", async (token, messageId) => {
    try {
      const userId = await jwtService.getUserId(token);
      if (userId) {
        const chats = await Chat.find({
          $or: [{ u_1: userId }, { u_2: userId }],
        });
        console.log(chats);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("sendMessage", async (token, receiver, message) => {
    try {
      const userId = await jwtService.getUserId(token);
      if (userId) {
        const chat = await Chat.findOne({
          $or: [
            { u_1: userId, u_2: receiver },
            { u_1: receiver, u_2: userId },
          ],
        });
        if (!chat) {
          await Chat.create({ u_1: userId, u_2: receiver });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.join("home");
  ++totalOnline;
  io.to("home").emit("updateOnline", totalOnline);

  socket.on("disconnect", () => {
    --totalOnline;
    io.to("home").emit("updateOnline", totalOnline);
  });

  socket.on("deleteMsg", async (payload, id) => {
    let user;
    try {
      let token = jwt.verify(payload, process.env.JWT_TOKEN);
      user = await User.findById(token.id);
    } catch (e) {
      console.log(e);
    }

    let message = await Message.findById(id);
    if (message && user && message.userId + "" === user._id + "") {
      await Message.findByIdAndDelete(id);
      io.to("home").emit("updateDeletedMessage", id);
    }
  });

  socket.on("sendMessage", async (payload, message) => {
    if (message.length > 200) {
      io.to("home").emit(
        "alert",
        "error",
        "Maximum length of message is 200 characters!"
      );
    } else {
      let user;
      try {
        let token = jwt.verify(payload, process.env.JWT_TOKEN);
        user = await User.findById(token.id);
      } catch (e) {
        console.log(e);
      }
      message = xss(message);
      message = linkifyHtml(message, {
        defaultProtocol: "https",
      });
      let timer = moment().format("MMMM Do YYYY, h:mm:ss a");
      const messageSave = Message({
        userId: user._id,
        message,
        username: user.username,
        avatar: user.avatar,
        time: timer,
      });
      await messageSave.save();

      io.to("home").emit(
        "receiveMessage",
        user.username,
        message,
        timer,
        user.avatar,
        messageSave._id
      );
    }
  });

  socket;
});

app.use(express.static("public"));
app.use(express.json({ limit: "10MB" }));
app.use(express.urlencoded({ extended: true }));

const routers = require("./routes/index.route");
app.use("/api", routers);

server.listen(process.env.PORT || 3000, () => console.log(`App is listening`));
