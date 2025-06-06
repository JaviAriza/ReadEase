// src/controllers/CartController.js
import CartModel from "../models/CartModel.js";
import CartItemModel from "../models/CartItemModel.js";
import BookModel from "../models/BookModel.js";
import OrderModel from "../models/OrderModel.js";
import OrderItemModel from "../models/OrderItemModel.js";
import UserBooksModel from "../models/UserBookModel.js";

/**
 * GET /api/carts
 */
export const getAllCarts = async (req, res) => {
  try {
    const carts = await CartModel.findAll();
    res.json(carts);
  } catch (error) {
    res.json({ message: error.message });
  }
};

/**
 * GET /api/carts/:id
 */
export const getCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ where: { id: req.params.id } });
    res.json(cart);
  } catch (error) {
    res.json({ message: error.message });
  }
};

/**
 * POST /api/carts
 */
export const createCart = async (req, res) => {
  try {
    const newCart = await CartModel.create(req.body);
    res.json(newCart);
  } catch (error) {
    res.json({ message: error.message });
  }
};

/**
 * PUT /api/carts/:id
 */
export const updateCart = async (req, res) => {
  try {
    await CartModel.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Cart updated successfully!" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

/**
 * DELETE /api/carts/:id
 */
export const deleteCart = async (req, res) => {
  try {
    await CartModel.destroy({ where: { id: req.params.id } });
    res.json({ message: "Cart deleted successfully!" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

/**
 * POST /api/carts/pay
 *
 * 1) Obtener userId desde req.user.id (authenticateToken debe haberlo puesto allí).
 * 2) Buscar el Cart de ese userId; si no existe, 404.
 * 3) Recuperar todos los CartItems de ese carrito (incluyendo Book).
 * 4) Calcular total_price sumando cada “item.book.price”.
 * 5) Insertar en `orders` { user_id, date, total_price }.
 * 6) Por cada CartItem:
 *    a) Insertar en `order_items` { order_id, book_id }.
 *    b) Insertar (findOrCreate) en `user_books` { user_id, book_id }.
 * 7) Borrar todos los CartItems de ese carrito.
 * 8) Responder JSON con { message, order_id }.
 */
export const payCart = async (req, res) => {
  try {
    // 1) Obtener userId desde el middleware (authenticateToken debe haberlo puesto en req.user.id)
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user not found." });
    }

    // 2) Buscar el Cart de este usuario
    const cart = await CartModel.findOne({ where: { user_id: userId } });
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found for this user.",
      });
    }
    const cartId = cart.id;

    // 3) Recuperar todos los CartItems de este carrito, incluyendo cada Book
    const cartItems = await CartItemModel.findAll({
      where: { cart_id: cartId },
      include: [
        {
          model: BookModel,
          as: "book",
          attributes: ["id", "title", "author", "price"],
        },
      ],
    });

    // 4) Calcular total_price sumando cada “item.book.price”
    const totalPrice = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.book.price || 0);
      return sum + price;
    }, 0);

    // 5) Insertar en `orders` un registro con { user_id, date, total_price }
    const newOrder = await OrderModel.create({
      user_id: userId,
      date: new Date(),
      total_price: totalPrice,
    });
    const orderId = newOrder.id;
    if (!orderId) {
      // Si Sequelize no devolvió el ID, lanzamos error
      throw new Error("Order ID not returned by create.");
    }

    // 6) Por cada CartItem:
    for (const item of cartItems) {
      // a) Insertar en `order_items`
      await OrderItemModel.create({
        order_id: orderId,
        book_id: item.book_id,
      });

      // b) Insertar en `user_books` (usa findOrCreate para no duplicar)
      await UserBooksModel.findOrCreate({
        where: {
          user_id: userId,
          book_id: item.book_id,
        },
      });
    }

    // 7) Eliminar todos los registros de cart_items para este carrito
    await CartItemModel.destroy({ where: { cart_id: cartId } });

    // 8) Devolver respuesta exitosa
    return res.json({ message: "Payment successful!", order_id: orderId });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res
      .status(500)
      .json({ message: "Error processing payment." });
  }
};
