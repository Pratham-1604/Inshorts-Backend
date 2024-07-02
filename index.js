const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const app = express();
const authRouter = require("./router/auth");
const adminRouter = require("./router/admin");
const userRouter = require("./router/user");
const { connectToDatabase } = require("./helpers/db_connection");
const { syncDatabase } = require("./models/user");
app.use(cors());

connectToDatabase();
app.use(bodyParser.json());

syncDatabase().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
