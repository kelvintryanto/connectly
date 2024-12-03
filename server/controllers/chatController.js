const { User, RoomChat, Chat, user_roomchat } = require(`../models`);
const { io } = require(`../index`);
class chatController {
  static async add(req, res, next) {
    try {
      const { content } = req.body;
      const { username, socket } = req.loginInfo;
      const { id } = req.params;

      const chat = await Chat.create({ content, sender: username, RoomChatId: id });

      // // io.emit(`ChatUpdate`, chat); // tidak boleh dipakai karena ini ke global

      io.emit(`ChatUpdate`, chat);
      res.status(201).json({
        message: `Success create new Chat`,
        chat,
      });
    } catch (err) {
      console.log(err);

      next(err);
    }
  }
}

module.exports = chatController;
