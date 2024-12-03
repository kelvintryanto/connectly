const authorization = async (req, res, next) => {
  try {
    if (req.loginInfo.email !== `raga@mail.com`) throw { name: `Forbidden` };
    // console.log(req.headers.authorization);

    next();
  } catch (err) {
    // console.log(err);

    next(err);
  }
};

module.exports = authorization;
