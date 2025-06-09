// ReadEase-Back/src/controllers/CartController.js
import CartModel from "../models/CartModel.js";
import CartItemModel from "../models/CartItemModel.js";
import UserBooksModel from "../models/UserBookModel.js";

/**
 * GET /api/carts
 */
export const getAllCarts = async (req, res) => {
  try {
    const carts = await CartModel.findAll();
    return res.json(carts);
  } catch (error) {
    console.error("Error getting carts:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/carts/:id
 */
export const getCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ where: { id: req.params.id } });
    if (!cart) return res.status(404).json({ message: "Cart not found." });
    return res.json(cart);
  } catch (error) {
    console.error("Error getting cart:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/carts
 */
export const createCart = async (req, res) => {
  try {
    const newCart = await CartModel.create(req.body);
    return res.status(201).json(newCart);
  } catch (error) {
    console.error("Error creating cart:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/carts/:id
 */
export const updateCart = async (req, res) => {
  try {
    const [updated] = await CartModel.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ message: "Cart not found." });
    return res.json({ message: "Cart updated successfully!" });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/carts/:id
 */
export const deleteCart = async (req, res) => {
  try {
    const deleted = await CartModel.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Cart not found." });
    return res.json({ message: "Cart deleted successfully!" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/carts/pay
 * Añade cada libro del carrito a user_books y limpia el carrito.
 */
export const payCart = async (req, res) => {
  try {
    // <-- aquí corregido:
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: no user." });
    }

    const cart = await CartModel.findOne({ where: { user_id: userId } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const items = await CartItemModel.findAll({
      where: { cart_id: cart.id },
    });
    if (items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    for (const item of items) {
      await UserBooksModel.findOrCreate({
        where: { user_id: userId, book_id: item.book_id },
      });
      await CartItemModel.destroy({ where: { id: item.id } });
    }

    return res.json({ message: "Purchase completed successfully!" });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ message: "Error processing payment." });
  }
};