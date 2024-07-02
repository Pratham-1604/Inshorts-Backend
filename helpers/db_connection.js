const mysql = require("mysql2");
const Sequelize = require("sequelize");

const sequelize = new Sequelize("inshorts", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
  logging: false,
  timezone: "+05:30",
});


async function connectToDatabase() {
  sequelize
    .authenticate()
    .then(() => {
      console.log("DB Connection successfull.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database: ", error);
    });
}

// process.env.database,
// process.env.user,
// process.env.password,

module.exports = { connectToDatabase, sequelize };
