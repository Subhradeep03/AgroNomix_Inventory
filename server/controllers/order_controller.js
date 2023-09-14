const orderModel = require("../models/order_model.js");
const { instance } = require("../index.js");
const crypto = require("crypto");

exports.orderCheckoutController = async (req, res) => {
  try {
    const { userId, orderId, products, totalPrice, shippingAddress, paymentMethod } = req.body;

    const orderData = await orderModel.create({ userId, products, totalPrice, shippingAddress, paymentMethod, orderId });
    return res
      .status(200)
      .json({ success: true, message: "Order Successful", orderData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrderIdController = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.totalPrice) * 100,
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    return res
      .status(200)
      .json({ success: true, message: "Order Id Created Successfully", order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCartController = async (req, res) => {
  try {
    const cartData = await orderModel.find({ userId: req.params.userId });
    return res
      .status(200)
      .send({ success: true, message: "Cart Data", cartData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRazorPayKey = (req, res) => {
  return res.status(200).json({ success: true, key: process.env.RAZORPAY_API_KEY });
};

exports.paymentVerification = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, userId, orderId, products, totalPrice, shippingAddress } = req.body;
  const body = razorpayOrderId + "|" + razorpayPaymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpaySignature;

  if (isAuthentic) {
    const orderData = await orderModel.create({ razorpayOrderId, razorpayPaymentId, razorpaySignature, userId, products, totalPrice, shippingAddress, orderId, isPaid: true });
    res.status(200).json({ success: true, message: "Payment Verified and ordered successfully", data: orderData });
  } else {
    res.status(400).json({ success: false });
  }
};

exports.getAllUserOrdersController = async (req, res) => {
  try {
    const { userId } = req.query;
    const userOrder = await orderModel.find({ userId: userId });
    res.status(200).json({ success: true, message: "Products Fetched Successfully", userOrder });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Error Fetching your Products" });
  }
};

exports.orderByIdController = async (req, res) => {
  try {
    const { orderid } = req.query;
    const orderData = await orderModel.findOne({ orderId: orderid }).select("products");
    return res.status(200).json({ success: true, message: "Order Fetched Successfully", data: orderData });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Error Fetching The Order" });
  }
};

exports.getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    return res.status(200).json({ success: true, message: "Fetched Successfully", data: orders });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Error fetching all the orders" });
  }
};

exports.updateDeliveryController = async (req, res) => {
  try {
    const { orderId } = req.query;
    const { deliveryStatus } = req.body;
    const getOrderData = await orderModel.findOneAndUpdate({ orderId: orderId }, { isDelivered: deliveryStatus }, { new: true });
    res.status(200).json({ success: true, message: "Updated Successfully", data: getOrderData });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Error updating the delivery status of the order" });
  }
};
