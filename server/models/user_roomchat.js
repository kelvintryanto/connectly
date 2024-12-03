"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_roomchat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user_roomchat.belongsTo(models.RoomChat, { foreignKey: `roomChatId` });
      user_roomchat.belongsTo(models.User, { foreignKey: `userId` });
      // define association here
    }
  }
  user_roomchat.init(
    {
      userId: DataTypes.INTEGER,
      roomChatId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "user_roomchat",
    }
  );
  return user_roomchat;
};
