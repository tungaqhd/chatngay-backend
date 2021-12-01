require("dotenv").config();
const db = require("./config/database");
db();

const { getUserId } = require("./common/jwt");

const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const moment = require("moment");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const { sendMessage, joinRoom } = require("./sockets/chat");
io.on("connection", async (socket) => {
  socket.on("initChat", async (token) => {
    const userId = await getUserId(token);
    if (token) {
      socket.join(userId);
    }
  });

  socket.on("sendMessage", async (token, to, content) => {
    sendMessage(io, token, to, content);
  });

  socket.on("joinRoom", async (token, chatId) => {
    joinRoom(socket, token, chatId);
  });
});

app.use(express.static("public"));
app.use(express.json({ limit: "10MB" }));
app.use(express.urlencoded({ extended: true }));

const routers = require("./routes/index.route");
app.use("/api", routers);

server.listen(process.env.PORT || 3000, () => console.log(`App is listening`));
