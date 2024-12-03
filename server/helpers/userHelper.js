const { User } = require(`../models`);

async function setSocketId(socketId, email) {
  try {
    // console.log(`hehe`);
    const data = await User.update(
      { socket: socketId },
      {
        where: {
          email: email,
        },
      }
    );

    // console.log(`ending`);
  } catch (error) {
    console.log(error);
  }
}

module.exports = setSocketId;
