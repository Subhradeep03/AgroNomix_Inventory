const express = require('express');
const app = express();
const cors = require('cors');
const fs = require("fs");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('./database/database');
const morgan = require('morgan');
const Razorpay = require('razorpay');
// const auth = require('./utils/auth')

require('dotenv').config({
    path: './config.env'
});

// Database Connection
connectDB();
app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser())
app.use(morgan('dev'))


// routes
app.use('/api/v1/store', require('./routes/store_route'));
app.use('/api/v1/category', require('./routes/category_route'))
app.use('/api/v1/product', require('./routes/product_route'))
app.use('/api/v1/auth',require('./routes/auth_route'))
app.use('/api/v1/cart',require('./routes/cart_route'))
app.use('/api/v1/order',require('./routes/order_route'))
app.use()

// razorpay
export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY ,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});