const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart-controller');

router.post('/add', CartController.addToCart);
router.post('/remove', CartController.removeFromCart);
router.post('/update-quantity', CartController.updateQuantity);
router.get('/:userId', CartController.getCart);

module.exports = router;
