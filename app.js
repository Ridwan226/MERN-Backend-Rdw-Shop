const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv/config");

const api = process.env.API_URL;

// Midelware
app.use(bodyParser.json());

// http://localhost:3000//api/v1/product

app.get(`${api}/product`, (req, res) => {
  const product = {
    id: 1,
    name: "Baju",
    image: "default.png",
  };
  res.send(product);
});

app.post(`${api}/product`, (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  res.send(newProduct);
});

app.listen(3000, () => {
  console.log(api);
  console.log("Server Rdw Run");
});
