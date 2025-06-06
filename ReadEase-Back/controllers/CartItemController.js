// ReadEase-Back/src/controllers/CartItemController.js
import CartItemModel from "../models/CartItemModel.js";
import BookModel from "../models/BookModel.js"; // Para hacer include de Book

/**
 * GET /api/cart-items?cart_id=<cartId>
 * Devuelve todos los cart_items de ese carrito,
 * incluyendo la información del libro en la propiedad `book`.
 */
export const getAllCartItems = async (req, res) => {
  try {
    const cartId = req.query.cart_id;
    if (!cartId) {
      return res
        .status(400)
        .json({ message: "cart_id query parameter is required" });
    }

    const items = await CartItemModel.findAll({
      where: { cart_id: cartId },
      include: [
        {
          model: BookModel,
          as: "book",
          attributes: ["id", "title", "author", "price"],
        },
      ],
    });

    res.json(items);
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/cart-items/:id
 */
export const getCartItem = async (req, res) => {
  try {
    const item = await CartItemModel.findOne({ where: { id: req.params.id } });
    res.json(item);
  } catch (error) {
    res.json({ message: error.message });
  }
};

/**
 * POST /api/cart-items
 */
export const createCartItem = async (req, res) => {
  try {
    await CartItemModel.create(req.body);
    res.json({ message: "Item added to cart successfully!" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

/**
 * PUT /api/cart-items/:id
 */
export const updateCartItem = async (req, res) => {
  try {
    await CartItemModel.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Cart item updated successfully!" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

/**
 * DELETE /api/cart-items/:id
 */
export const deleteCartItem = async (req, res) => {
  try {
    await CartItemModel.destroy({ where: { id: req.params.id } });
    res.json({ message: "Cart item deleted successfully!" });
  } catch (error) {
    res.json({ message: error.message });
  }
};
