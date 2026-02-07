const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      products: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not fetch products", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Invalid Product ID", error: error.message });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, rating } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload an image file" });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image: `/${req.file.path.replace(/\\/g, "/")}`, 
      stock,
      rating
    });

    const createdProduct = await product.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: createdProduct
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error creating product", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.status(200).json({ message: "Product removed successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const keyword = req.params.keyword ? {
      $or: [
        { name: { $regex: req.params.keyword, $options: 'i' } },
        { category: { $regex: req.params.keyword, $options: 'i' } }
      ]
    } : {};

    const products = await Product.find({ ...keyword });
    res.status(200).json({ count: products.length, products });
  } catch (error) {
    res.status(500).json({ message: "Error in search", error: error.message });
  }
};