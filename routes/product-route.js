const express = require('express');
const router = express.Router();
const Controller = require('../controllers/product-controller');

router.get('/products', Controller.getProducts);
router.get('/products/:id', Controller.getProductById);
router.get('/categories', Controller.getCategories);
router.get('/categories/:id', Controller.getCategoryById);
router.get('/products/by-category', Controller.getProductsByCategory);
router.get('/products/by-subcategory', Controller.getProductsBySubcategory);

module.exports = router;
