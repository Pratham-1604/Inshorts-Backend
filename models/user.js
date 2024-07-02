const { DataTypes } = require("sequelize");
const { sequelize } = require("../helpers/db_connection");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  apiKey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const syncDatabase = async () => {
  await sequelize.sync();
  console.log("Database synchronized.");
};

module.exports = { User, syncDatabase };
