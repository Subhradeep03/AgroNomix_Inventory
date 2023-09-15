const express = require('express');
const router = express.Router();
const multer = require("multer");
const { addProducts, searchProductController } = require('../controllers/product_controller.js');


router.post('/addproduct', addProducts)
router.get('/search-product', searchProductController)

module.exports = router