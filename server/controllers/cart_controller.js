const mongoose = require("mongoose");
const userModel = require("../models/user_model.js");



exports.addToCartController = async (req, res) => {
  try {
    const { productId, quantity, price, storeId } = req.body;
    const existUser = req.existUser;
    const userToFind = await userModel.findById(existUser._id);
    const existingCartItem = userToFind.cart.find(
      (item) => item.productId.toString() === productId
    );
    if (existingCartItem) {
      return res
        .status(200)
        .json({ success: true, message: "Item already exists in cart" });
    }
    const cartData = await userModel.findByIdAndUpdate(
      userToFind._id,
      {
        cart: [...userToFind.cart, { productId, quantity, price,storeId }],
      },
      { new: true }
    );
    
    
    return res
      .status(200)
      .json({
        success: true,
        message: "Added to Cart successfully",
        cartData,
      });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: "Error adding to cart",
      error: error.message,
    });
  }
};

// Update Quantity of the Cart
exports.updateCartController = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const existUser = req.existUser;
    if (!existUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const userToFind = await userModel.findById(existUser._id);
    const cartData = userToFind.cart.find(
      (ele) => ele.productId.toString() === productId
    );
    cartData.quantity = quantity;
    await userToFind.save();
    res
      .status(200)
      .json({ success: true, message: "Cart Updated Successfully" });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: "Error updating Quantity",
      error: error.message,
    });
  }
};

// Delete the product from the cart
exports.deleteFromCartController = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product Cannot Be Deleted",
      });
    }
    const existUser = req.existUser;
    const userToFind = await userModel.findById(existUser._id);
    userToFind.cart = userToFind.cart.filter(
      (ele) => ele.productId.toString() !== productId
    );
    await userToFind.save();
    return res
      .status(200)
      .json({ success: true, message: "Item From Cart Deleted Successfully" });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: "Error deleting the Product",
      error: error.message,
    });
  }
};

// Clear the cart
exports.clearCartController = async (req, res) => {
  try {
    const existUser = req.existUser;
    const userToFind = await userModel.findById(existUser._id);
    userToFind.cart = [];
    userToFind.totalPrice = 0;
    await userToFind.save();
    return res
      .status(200)
      .json({ success: true, message: "Cart Cleared Successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Error Clearing The Cart" });
  }
};
