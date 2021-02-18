const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String, // String is shorthand for {type: String}
  image: String,
  countInStock: {
    type: Number,
    required: true,
  },
});

exports.User = mongoose.model("User", userSchema);
