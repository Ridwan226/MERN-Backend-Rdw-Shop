const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: String, // String is shorthand for {type: String}
  description: {
    type: String,
    require: true,
  },
  richDescription: {
    type: String,
    require: true,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  images: {
    type: [
      {
        type: String,
      },
    ],
    default: "",
  },
  brand: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    require: true,
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

exports.Product = mongoose.model("Product", productSchema);
