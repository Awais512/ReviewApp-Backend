const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const { errorHandler } = require("./middlewares/error");
const connectDb = require("./db");
const { handleNotFound } = require("./utils/helper");
dotenv.config();
const app = express();

//Route files Import
const userRoutes = require("./routes/userRoutes");
const actorRoutes = require("./routes/actorRoutes");

//Connecting to Mongodb
connectDb();

//App Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

//Route Middlewares
app.use("/api/users", userRoutes);
app.use("/api/actors", actorRoutes);

app.use("/*", handleNotFound);
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server is Running on Port ${process.env.PORT}`)
);
