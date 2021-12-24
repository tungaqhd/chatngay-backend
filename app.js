require("dotenv").config();
const db = require("./config/database");
db();

const cors = require("cors");

const User = require("./models/User.model");

const { getUserId } = require("./common/jwt");

const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const moment = require("moment");

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peerjs", peerServer);

app.use(cors());

app.use((req, res, next) => {
  req.socketCon = io;
  next();
});

const { initChat, destroyCon } = require("./sockets/main");
const { sendMessage, joinRoom } = require("./sockets/chat");
io.on("connection", async (socket) => {
  socket.on("initChat", async (token) => {
    initChat(socket, token);
  });

  socket.on("sendMessage", async (token, to, payload) => {
    sendMessage(io, token, to, payload);
  });

  socket.on("joinRoom", async (token, chatId) => {
    joinRoom(socket, token, chatId);
  });

  socket.on("disconnect", () => {
    destroyCon(socket);
  });

  socket.on("forceDisconnect", function () {
    socket.disconnect(true);
  });

  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    io.to(roomId).emit("user-connected", userId);
  });
});

app.use(express.static("public"));
app.use(express.json({ limit: "10MB" }));
app.use(express.urlencoded({ extended: true }));

const routers = require("./routes/index.route");
app.use("/api", routers);

server.listen(process.env.PORT || 3000, () => console.log(`App is listening`));
