"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoomChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoomChat.belongsToMany(models.User, { through: models.user_roomchat, foreignKey: `roomChatId`, onDelete: "CASCADE" });
      // define association here
      RoomChat.hasMany(models.Chat, { foreignKey: `RoomChatId`, onDelete: "CASCADE" });
    }
  }
  RoomChat.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Name room is required`,
          },
          notEmpty: {
            msg: `Name room is required`,
          },
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `image is required`,
          },
          notEmpty: {
            msg: `image is required`,
          },
        },
      },
    },
    {
      sequelize,
      modelName: "RoomChat",
    }
  );
  return RoomChat;
};
