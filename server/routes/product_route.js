const express = require('express');
const router = express.Router();
const multer = require("multer");
const { addProducts } = require('../controllers/product_controller.js');


router.post('/addproduct', addProducts)

module.exports = router