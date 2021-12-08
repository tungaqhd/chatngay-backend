const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
const File = require("../models/File.model");
const xss = require("xss");
exports.getChatList = async (req, res) => {
  try {
    const chats = await Chat.aggregate([
      {
        $match: {
          $or: [
            {
              u1: req.user._id,
            },
            {
              u2: req.user._id,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          let: { u1: "$u1" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$u1"] } } },
            { $project: { password: 0, socketId: 0 } },
          ],
          as: "user1",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { u2: "$u2" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$u2"] } } },
            { $project: { password: 0, socketId: 0 } },
          ],
          as: "user2",
        },
      },
      {
        $lookup: {
          from: "messages",

          let: { chatId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$chatId", "$$chatId"] } } },
            { $sort: { _id: -1 } },
            { $limit: 1 },
          ],
          as: "messages",
        },
      },
    ]);
    res.json(chats);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "An unexpected error has occurred" });
  }
};

exports.getChat = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const skip = 30 * (page - 1);
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).send();
    }
    const messages = await Message.find({ chatId })
      .sort({ _id: 1 })
      .limit(30)
      .skip(skip)
      .populate("fileId")
      .populate("replyToId");

    res.json(messages);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "An unexpected error has occurred" });
  }
};

exports.sendFile = async (req, res) => {
  try {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        throw err;
      }

      const to = req.params.id;
      let chat = await Chat.findOne({
        $or: [
          {
            $and: [
              {
                u1: req.user._id,
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
                u2: req.user._id,
              },
            ],
          },
        ],
      });
      if (!chat) {
        chat = new Chat({ u1: from, u2: to });
        await chat.save();
      }
      if (chat) {
        const file = new File({
          size: files.uploadedFile.size,
          originalFilename: files.uploadedFile.originalFilename,
        });

        const message = new Message({
          from: req.user._id,
          chatId: req.params.id,
          msgType: "file",
          fileId: file._id,
        });

        await Promise.all([file.save(), message.save()]);
        const oldPath = files.uploadedFile.filepath;
        const newPath = path.join(
          __dirname,
          `../public/files/${file._id}-${files.uploadedFile.originalFilename}`
        );
        fs.renameSync(oldPath, newPath);

        req.socketCon.to(chat.u1.toString()).emit("newMessages", message);
        req.socketCon.to(chat.u2.toString()).emit("newMessages", message);
      }
      res.json({ fields, files });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "An unexpected error has occurred" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { data } = req.body;
    const to = req.params.id;
    const from = req.user._id;
    if (!from) {
      return;
    }
    if (data.content) {
      if (data.content.length > 1000) {
        req.socketCon
          .to(from)
          .emit(
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
    req.socketCon.to(chat.u1.toString()).emit("newMessages", message);
    req.socketCon.to(chat.u2.toString()).emit("newMessages", message);

    res.send();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "An unexpected error has occurred" });
  }
};
