const express = require('express');
const { registerUser, loginUser, getUserDetailsController, logoutUser }= require ("../controllers/user_controller.js")
const { requireSignIn } = require( "../utils/auth.js")

const router = express.Router()


// register user
router.post('/register', registerUser)

// login user
router.post('/login', loginUser)

// get user details
router.get('/get-user-details',  getUserDetailsController)

// logout
router.get('/logout', logoutUser)

module.exports = router