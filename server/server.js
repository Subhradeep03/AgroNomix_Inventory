const express = require('express');
const app = express();
const cors = require('cors');
const fs = require("fs");
const bodyParser = require('body-parser');
const connectDB = require('./database/database');
// const auth = require('./utils/auth')

require('dotenv').config({
    path: './config.env'
});

// Database Connection
connectDB();
app.use(bodyParser.json());
app.use(cors())


app.use('/api/v1/store', require('./routes/store_route'));
app.use('/api/v1/category', require('./routes/category_route'))
app.use('/api/v1/product', require('./routes/product_route'))

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});