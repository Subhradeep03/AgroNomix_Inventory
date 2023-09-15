const {
    addToCartController,
    clearCartController,
    deleteFromCartController,
    updateCartController
} = require("../controllers/cart_controller.js");

const express = require('express');
const { requireSignIn } = require("../utils/auth.js");
const router = express.Router();

router.put('/add-to-cart', requireSignIn,  addToCartController);
router.put('/update-cart', requireSignIn, updateCartController);
router.delete('/delete-item-cart', requireSignIn, deleteFromCartController);
router.put('/clear-cart', requireSignIn, clearCartController);

module.exports = router;
