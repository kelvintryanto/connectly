"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chat.belongsTo(models.RoomChat, { foreignKey: `RoomChatId`, onDelete: "CASCADE" });
      // define association here
    }
  }
  Chat.init(
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Content is required`,
          },
          notEmpty: {
            msg: `Content is required`,
          },
        },
      },
      sender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Sender is required`,
          },
          notEmpty: {
            msg: `Sender is required`,
          },
        },
      },
      RoomChatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: `RoomChat is required`,
          },
          notEmpty: {
            msg: `RoomChat is required`,
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Chat",
    }
  );
  return Chat;
};
