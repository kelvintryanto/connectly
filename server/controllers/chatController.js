const { User, RoomChat, Chat, user_roomchat } = require(`../models`);
const { io } = require(`../socket`);
class chatController {
  static async add(req, res, next) {
    try {
      const { content } = req.body;
      const { username, socket } = req.loginInfo;
      const { id } = req.params;

      console.log(`sebelum`);
      const chat = await Chat.create({ content, sender: username, RoomChatId: id });
      console.log(`room${id}`);

      // io.emit(`ChatUpdate`, chat); // tidak boleh dipakai karena ini ke global
      io.to(`room${id}`).emit(`ChatUpdate`, chat);
      // console.log(`masuk sini`);
      // console.log(chat);

      // io.emit(`ChatUpdate`, chat);
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
