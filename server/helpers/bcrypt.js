const bcrypt = require("bcryptjs");

const hash = (pass) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pass, salt);
};

const compareBcrypt = (pass, hashedPass) => {
  return bcrypt.compareSync(pass, hashedPass);
};

module.exports = { hash, compareBcrypt };
