const express = require('express');
const { registerStore, loginStore } = require('../controllers/store_controller');
const router = express.Router();

router.post('/register', registerStore)
router.post('/login', loginStore)

module.exports = router;