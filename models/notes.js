const { DataTypes } = require("sequelize");
const { sequelize } = require("../helpers/db_connection");

const Note = sequelize.define("notes", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publish_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  upvote: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  downvote: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = { Note };
