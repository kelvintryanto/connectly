l"use strict";

const { Model } = require("sequelize");
const { hash } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.RoomChat, { through: models.user_roomchat, foreignKey: `userId` });
      // define association here
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: `Email already taken`,
        },
        validate: {
          notNull: { msg: `Email is required` },
          notEmpty: { msg: `Email is required` },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: `Username is required` },
          notEmpty: { msg: `Username is required` },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: `Password is required` },
          notEmpty: { msg: `Password is required` },
        },
      },
      socket: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      image: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate((user) => {
    user.password = hash(user.password);
  });
  return User;
};
