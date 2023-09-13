const express = require('express');
const { addCategory } = require('../controllers/category_controller');
const router = express.Router();

router.post('/addCategory', addCategory);

module.exports = router