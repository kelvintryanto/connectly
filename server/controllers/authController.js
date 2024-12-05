const { compareBcrypt } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User, RoomChat, Chat, user_roomchat } = require(`../models`);
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
class authController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      // console.log(req.body);

      const user = await User.create({ username, email, password });

      res.status(201).json({
        name: `Success Create`,
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw {
          name: `BadRequest`,
        };
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });
      //   console.log(user);

      if (!user) {
        throw {
          name: `LoginError`,
        };
      }

      if (!compareBcrypt(password, user.password)) {
        throw {
          name: `LoginError`,
        };
      }
      // console.log(user.socket);

      const payload = {
        userId: user.id,
        email: user.email,
        username: user.username,
        socket: user.socket,
      };
      // console.log(payload);

      const access_token = signToken(payload);

      res.status(200).json({
        access_token,
      });
    } catch (err) {
      next(err);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { token } = req.headers;
      const client = new OAuth2Client();

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "383800483107-grpgn26t7p2ts17qefd1fkhe32ac4ppl.apps.googleusercontent.com",
      });

      const payload = ticket.getPayload();
      // console.log(payload);

      const [user, created] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          username: payload.name,
          email: payload.email,
          password: "password_google",
        },
        hooks: false,
      });

      const access_token = signToken({
        userId: user.id,
        username: user.username,
        email: user.username,
        socket: user.socket,
      });

      res.status(200).json({ access_token });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async githubLogin(req, res, next) {
    try {
      const { code } = req.body;
      // ambil access_token dari github
      const getAccessToken = await axios({
        method: "post",
        url: "https://github.com/login/oauth/access_token",
        params: {
          client_id: "Ov23li5Y5CTVE0X7rGmr",
          client_secret: "c35afe64b74f2fb4ed07383634c0d113c517bb63",
          code,
          redirect_uri: "http://localhost:5173/login",
        },
        headers: {
          Accept: "application/json",
        },
      });

      const githubAccessToken = getAccessToken.data.access_token;
      console.log("githubAccessToken: ", githubAccessToken, 129);

      // ambil emailnya untuk keperluan cari
      const emailResponse = await axios.get("https://api.github.com/user/emails", {
        headers: {
          Authorization: `token ${githubAccessToken}`,
        },
      });
      // ambil emailnya untuk keperluan cari
      const userResponse = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `token ${githubAccessToken}`,
        },
      });

      // ambil email dan userdata
      const githubEmail = emailResponse.data[0].email;
      const userData = userResponse.data;
      console.log(githubEmail, userData, "<<<<<<<<<<<<<<<<<<<<<<=====================ini datanya cuy");

      // buat usernya kalau tidak ada yang terdaftar berdasarkan email
      // kalau ada ambil datanya
      const [user, created] = await User.findOrCreate({
        where: {
          email: githubEmail,
        },
        defaults: {
          username: userData.login,
          email: githubEmail,
          password: "password_github",
        },
        hooks: false,
      });

      // bikin access_token dari application connectly
      // const access_token = signToken({
      //   userId: user.id,
      //   username: user.username,
      //   email: user.username,
      //   socket: user.socket,
      // });
      // console.log(access_token);

      // kirim access token dari web application connectly
      // res.status(200).json({ access_token });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async userData(req, res, next) {
    try {
      const username = req.loginInfo.username;
      const image = await User.findOne({ where: { username: req.loginInfo.username } }, { attributes: `image` });
      res.status(200).json({
        username,
        image,
      });
    } catch (err) {
      next(err);
    }
  }

  static async clear(req, res, next) {
    try {
      const { id } = req.params;
      await Chat.destroy({ where: { RoomChatId: id } });

      res.status(200).json({
        message: `Success clear Chat`,
      });
    } catch (err) {
      // console.log(err);

      next(err);
    }
  }
}

module.exports = authController;
