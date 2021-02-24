const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      require: true,
    },
  ],
  shippingAddress1: {
    type: String,
    default: true,
  },
  shippingAddress2: {
    type: String,
    default: true,
  },
  city: {
    type: String,
    default: true,
  },
  zip: {
    type: String,
    default: true,
  },
  country: {
    type: String,
    default: true,
  },
  phone: {
    type: String,
    default: true,
  },
  status: {
    type: String,
    default: true,
    default: "Pending",
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateOrderd: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

exports.Order = mongoose.model("Order", orderSchema);
