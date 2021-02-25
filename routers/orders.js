const { Order } = require("../models/orders");
const { OrderItem } = require("../models/order-item");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrderd: -1 });

  if (!orderList) {
    res.status(500).json({
      success: false,
    });
  }

  res.send(orderList);
});

router.get(`/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });

  if (!order) {
    res.status(500).json({
      success: false,
    });
  }

  res.send(order);
});

router.post("/", async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );
  const orderItemsIdResolve = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdResolve.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;

      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIdResolve,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    totalPrice: totalPrice,
    user: req.body.user,
  });

  order = await order.save();

  if (!order) return res.status(404).send("order Tidak Berhasil DI buat");

  res.send(order);
});

router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );

  if (!order) {
    return res.status(400).send("order Tidak Berhasil Di Update");
  }

  res.send(order);
});

router.delete("/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });

        return res
          .status(200)
          .json({ success: true, message: "order Berhasil Di Hapus" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order Gagal Di Hapus" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.get("/get/totalsalse", async (req, res) => {
  const totalSalse = await Order.aggregate([
    { $group: { _id: null, totalsalse: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSalse) {
    return res.status(400).send("Order Salse Tidak Tergenerate");
  }

  res.send({ totalSalse: totalSalse.pop().totalsalse });
});

router.get("/get/count", async (req, res) => {
  const totalCount = await Order.countDocuments((count) => count);

  if (!totalCount) {
    return res.status(400).send("Order Salse Tidak Tergenerate");
  }

  res.send({ totalCount: totalCount });
});

router.get(`/get/userorders/:userid`, async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrderd: -1 });

  if (!userOrderList) {
    res.status(500).json({
      success: false,
    });
  }

  res.send(userOrderList);
});

module.exports = router;
