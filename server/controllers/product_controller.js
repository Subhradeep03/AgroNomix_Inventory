const Product = require('../models/product_model')
const fs = require("fs");
const slugify = require('slugify')

exports.addProducts = async (req, res) => {
    try {
        const { name, description, price, category, subcategory, quantity, photo } =
            req.body;
        const products = await Product.create({
            ...req.body,
            slug: slugify(name),
        });
        await products.save();
        res.status(201).json({
            success: true,
            message: "Product Created Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error,
            message: "Error in creating product",
        });
    }
}