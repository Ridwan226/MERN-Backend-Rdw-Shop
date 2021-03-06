const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const authJwt = require("./helpers/jwt");

app.use(cors());
app.options("*", cors());

const api = process.env.API_URL;

const categoryRouter = require("./routers/category");
const productRouter = require("./routers/product");
const orderRouter = require("./routers/orders");
const userRouter = require("./routers/users");
const errorHandler = require("./helpers/error-handler");

// Midelware
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

//Routers
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/product`, productRouter);
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/users`, userRouter);

mongoose
  .connect(process.env.CONNECT_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "rdweshop-database",
  })
  .then(() => {
    console.log("message Connection Success");
  })
  .catch((err) => {
    console.log("Error Data Base:", err);
  });

app.listen(3000, () => {
  console.log(api);
  console.log("Server Rdw Run");
});
