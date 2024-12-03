const { User, RoomChat, Chat, user_roomchat } = require(`../models`);
const imagekit = require("../utils/imagekit");
const { GoogleGenerativeAI } = require("@google/generative-ai");
class roomChatController {
  static async create(req, res, next) {
    try {
      const { name } = req.body; //inputan
      const { userId } = req.loginInfo; // TOKEN LOGIN AUTHTETICATION
      console.log(req.file);

      const imageInBase64 = req.file.buffer.toString("base64");
      // console.log(imageInBase64);

      const result = await imagekit.upload({
        file: imageInBase64,
        // Get the filename from the originalname (req.file)
        fileName: req.file.originalname,
        // [Optional] set the image tags
      });
      const roomchat = await RoomChat.create({ name, image: result.url });

      await user_roomchat.create({ userId: userId, roomChatId: roomchat.id });

      res.status(201).json({
        name: `Success create room chat`,
        roomchat,
      });
    } catch (err) {
      console.log(err);

      next(err);
    }
  }

  static async edit(req, res, next) {
    try {
      const { id } = req.params;

      const roomchat = await RoomChat.findByPk(id);
      //   console.log(id);

      if (!roomchat) throw { name: `NotFound` };

      const { name } = req.body;

      await roomchat.update({ name });

      res.status(200).json({
        message: `Success Update with id ${id}`,
        roomchat,
      });
    } catch (err) {
      next(err);
    }
  }

  // static async delete(req, res, next) {
  //   try {
  //     const { id } = req.params;
  //     const roomchat = await RoomChat.findByPk(id);

  //     if (!roomchat) throw { name: `NotFound` };
  //     await roomchat.destroy();

  //     res.status(200).json({
  //       message: `Success delete room chat with room id :${id}`,
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  static async read(req, res, next) {
    try {
      // const data = await RoomChat.findAll({
      //   include: {
      //     model: User,
      //   },
      // });

      const data = await User.findAll({
        where: { id: req.loginInfo.userId },
        include: {
          model: RoomChat,
          through: { attributes: [] }, // this will remove the rows from the join table (i.e. 'UserPubCrawl table') in the result set
        },
      });
      // const data = await user_roomchat.findAll({
      //   where: {
      //     userId: req.loginInfo.userId,
      //   },
      //   include: {
      //     model: RoomChat,
      //   },
      // });
      // console.log(data[0].Users);

      res.status(200).json({
        message: `Success read RoomChat`,
        data,
      });
    } catch (err) {
      console.log(err);

      next(err);
    }
  }

  static async detail(req, res, next) {
    try {
      const { id } = req.params;
      const data = await RoomChat.findOne({ where: { id: id }, include: { model: Chat } });

      // console.log(data);

      const genAI = new GoogleGenerativeAI("AIzaSyDJ2vazokgm7i4otwbczjfofkAUpoMaLiM");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = "Greeting and welcome back ";

      const result = await model.generateContent(prompt);
      // console.log(result.response.text());
      const ai = result.response.text();
      res.status(200).json({
        message: `Success read detail`,
        data,
        ai,
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async readAll(req, res, next) {
    try {
      const data = await RoomChat.findAll();

      res.status(200).json({
        message: `Success read RoomChat`,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async join(req, res, next) {
    try {
      const { id } = req.params;

      const joinned = await user_roomchat.findOne({
        where: {
          userId: req.loginInfo.userId,
          roomChatId: id,
        },
      });

      if (joinned) throw { name: `AlreadyJoin` };

      const data = await user_roomchat.create({ userId: req.loginInfo.userId, roomChatId: id });

      res.status(200).json({
        message: `Success Join Group`,
        data,
      });
    } catch (err) {
      console.log(err);

      next(err);
    }
  }

  static async leave(req, res, next) {
    try {
      const { id } = req.params;

      await user_roomchat.destroy({ where: { userId: req.loginInfo.userId, roomChatId: id } });

      res.status(200).json({
        message: `Success leave chat`,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = roomChatController;
