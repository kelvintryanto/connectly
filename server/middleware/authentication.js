const { verifyToken } = require("../helpers/jwt");

const authentication = async (req, res, next) => {
  try {
    // console.log(req.headers.authorization);
    const { authorization } = req.headers;

    if (!authorization) throw { name: "Unauthorized" };
    const access_token = authorization.split(" ")[1];

    // pada saat proses verify, bisa terjadi error dari jwt kalo tokennya tidak sesuai

    const payload = verifyToken(access_token);
    // console.log(payload.socket);

    req.loginInfo = {
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
      socket: payload.socket,
    };

    // console.log(req.loginInfo.socket);

    next();
  } catch (err) {
    console.log(err);

    next(err);
  }
};

module.exports = { authentication };
