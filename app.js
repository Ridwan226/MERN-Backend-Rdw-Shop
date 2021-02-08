const express = require("express");
const app = express();

require("dotenv/config");

const api = process.env.API_URL;

// http://localhost:3000//api/v1/product

app.get(api + "/product", (req, res) => {
  res.send("Hello API");
});

app.listen(3000, () => {
  console.log(api);
  console.log("Server Rdw Run");
});
