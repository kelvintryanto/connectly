const jwt = require(`jsonwebtoken`);
const secretKey = "RAHASIATAUK";

const signToken = (payload) => {
  return jwt.sign(payload, secretKey);
};

//decode
const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};
module.exports = { signToken, verifyToken };
