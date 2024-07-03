const CartModel = require('../models/cart-model');
const ProductModel = require('../models/product-model');

class CartController {
  async addToCart(req, res) {
    const { userId, productId } = req.body;

    try {
      let cart = await CartModel.findOne({ user: userId });

      if (cart) {
        // Cart exists, update quantity if item exists, else add new item
        const itemIndex = cart.items.findIndex(item => item.product == productId);
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += 1;
        } else {
          cart.items.push({ product: productId, quantity: 1 });
        }
      } else {
        // No cart for user, create new cart
        cart = new CartModel({ user: userId, items: [{ product: productId, quantity: 1 }] });
      }

      await cart.save();
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async removeFromCart(req, res) {
    const { userId, productId } = req.body;

    try {
      let cart = await CartModel.findOne({ user: userId });

      if (cart) {
        cart.items = cart.items.filter(item => item.product != productId);
        await cart.save();
        res.status(200).json(cart);
      } else {
        res.status(404).json({ message: "Cart not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateQuantity(req, res) {
    const { userId, productId, quantity } = req.body;

    try {
      let cart = await CartModel.findOne({ user: userId });

      if (cart) {
        const itemIndex = cart.items.findIndex(item => item.product == productId);
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity = quantity;
          await cart.save();
          res.status(200).json(cart);
        } else {
          res.status(404).json({ message: "Product not found in cart" });
        }
      } else {
        res.status(404).json({ message: "Cart not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getCart(req, res) {
    const { userId } = req.params;

    try {
      const cart = await CartModel.findOne({ user: userId }).populate('items.product');
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new CartController();
