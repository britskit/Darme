const ProductModel = require('../models/product-model');
const CategoryModel = require('../models/category-model');

class ProductController {
  async getProducts(req, res) {
    try {
      const { categoryId } = req.query;
      const products = categoryId
        ? await ProductModel.find({ category: categoryId })
        : await ProductModel.find();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }

  async getProductById(req, res) {
    const productId = req.params.id;
    try {
      const product = await ProductModel.findById(productId, {
        title: 1,
        description: 1,
        category: 1,
        subcategory: 1,
        price: 1,
        file: 1,
      });
      res.status(200).json(product);
    } catch (err) {
      console.error('Error fetching product by ID:', err);
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  }

  async getCategories(req, res) {
    try {
      const categories = await CategoryModel.find({}, {
        name: 1,
        file: 1,
        color: 1
      }).populate('subcategories', 'name');
      res.status(200).json(categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  }

  async getCategoryById(req, res) {
    const categoryId = req.params.id;
    try {
      const category = await CategoryModel.findById(categoryId, {
        name: 1
      }).populate('subcategories', 'name');
      res.status(200).json(category);
    } catch (err) {
      console.error('Error fetching category by ID:', err);
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  }

  async getProductsByCategory(req, res) {
    const categoryId = req.query.category;
    try {
      console.log('Fetching products for category:', categoryId); 
      const products = await ProductModel.find({ category: categoryId }, {
        title: 1,
        description: 1,
        price: 1,
        category: 1,
        subcategory: 1,
        quantity: 1,
        file: 1,
      });
      console.log('Fetched products:', products); // Add logging
      res.status(200).json(products);
    } catch (err) {
      console.error('Error fetching products by category:', err);
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  }

  async getProductsBySubcategory(req, res) {
    const subcategoryId = req.query.subcategory;
    try {
      const products = await ProductModel.find({ subcategory: subcategoryId }, {
        title: 1,
        description: 1,
        price: 1,
        category: 1,
        subcategory: 1,
        quantity: 1,
        file: 1,
      });
      res.status(200).json(products);
    } catch (err) {
      console.error('Error fetching products by subcategory:', err);
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  }
}

module.exports = new ProductController();
