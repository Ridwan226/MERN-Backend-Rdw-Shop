const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv/config");

const api = process.env.API_URL;

// Midelware
app.use(bodyParser.json());
app.use(morgan("tiny"));

// http://localhost:3000//api/v1/product

const productSchema = mongoose.Schema({
  name: String, // String is shorthand for {type: String}
  image: String,
  countInStock: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

app.get(`${api}/product`, async (req, res) => {
  const productList = await Product.find();

  if (!productList) {
    res.status(500).json({
      success: false,
    });
  }

  res.send(productList);
});

app.post(`${api}/product`, (req, res) => {
  // const newProduct = req.body;
  // console.log(newProduct);
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });

  // res.send(newProduct);
});

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
    console.log(err);
  });

app.listen(3000, () => {
  console.log(api);
  console.log("Server Rdw Run");
});
