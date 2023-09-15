const Product = require("../models/product_model");
const fs = require("fs");
const slugify = require("slugify");

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
};

exports.searchProductController = async (req, res) => {
  try {
    const { query } = req.query;
    if (query) {
      const searchTerms = query.split(" ");

      const searchResults = [];

      for (const term of searchTerms) {
        const termResults = await Product.find({
          $or: [
            { name: { $regex: term, $options: "i" } },
            { description: { $regex: term, $options: "i" } },
            { category: { $regex: term, $options: "i" } },
          ],
        }).select("-photo");

        searchResults.push(...termResults);
      }

      const searchedProducts = searchResults.filter(
        (product, index, self) =>
          index ===
          self.findIndex((p) => p._id.toString() === product._id.toString())
      );

      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: searchedProducts,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Error in fetching searched products",
    });
  }
};
