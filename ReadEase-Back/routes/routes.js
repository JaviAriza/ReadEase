import express from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import { getMyBooks } from "../controllers/UserBookController.js";

import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getSelfUser,
  updateSelfUser,
  deleteSelfUser,
} from "../controllers/UserController.js";

import {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/BookController.js";

import {
  getAllCarts,
  getCart,
  createCart,
  updateCart,
  deleteCart,
  payCart,
} from "../controllers/CartController.js";

import {
  getAllCartItems,
  getCartItem,
  createCartItem,
  updateCartItem,
  deleteCartItem,
} from "../controllers/CartItemController.js";

import {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/OrderController.js";

import {
  getAllOrderItems,
  getOrderItem,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} from "../controllers/OrderItemController.js";

import {
  getAllUserBooks,
  getUserBook,
  createUserBook,
  updateUserBook,
  deleteUserBook,
} from "../controllers/UserBookController.js";

import { getBookText } from "../controllers/PdfController.js";

const router = express.Router();

// ─── User Routes ───────────────────────────────────────────────────────────────
router.post("/users", createUser);
router.get("/users", authenticateToken, authorizeRoles("admin"), getAllUsers);
router.get(
  "/users/:id",
  authenticateToken,
  authorizeRoles("admin"),
  getUser
);
router.put(
  "/users/:id",
  authenticateToken,
  authorizeRoles("admin", "user"),
  updateUser
);
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeRoles("admin", "user"),
  deleteUser
);

// ─── Profile Routes (sin ID en el cliente) ────────────────────────────────────
router.get(
  "/users/me",
  authenticateToken,
  getSelfUser
);
router.put(
  "/users/me",
  authenticateToken,
  updateSelfUser
);
router.delete(
  "/users/me",
  authenticateToken,
  deleteSelfUser
);

// ─── Book Routes ────────────────────────────────────────────────────────────────
router.get("/books", getAllBooks);
router.get("/books/:id", getBook);
router.post("/books", authenticateToken, authorizeRoles("admin"), createBook);
router.put("/books/:id", authenticateToken, authorizeRoles("admin"), updateBook);
router.delete("/books/:id", authenticateToken, authorizeRoles("admin"), deleteBook);
router.get("/books/:id/text", getBookText);

// ─── Cart Routes ────────────────────────────────────────────────────────────────
router.get("/carts", authenticateToken, getAllCarts);
router.get("/carts/:id", authenticateToken, getCart);
router.post("/carts", authenticateToken, createCart);
router.put("/carts/:id", authenticateToken, updateCart);
router.delete("/carts/:id", authenticateToken, deleteCart);
router.post("/carts/pay", authenticateToken, payCart);

// ─── Cart Item Routes ──────────────────────────────────────────────────────────
router.get("/cart-items", authenticateToken, getAllCartItems);
router.get("/cart-items/:id", authenticateToken, getCartItem);
router.post("/cart-items", authenticateToken, createCartItem);
router.put("/cart-items/:id", authenticateToken, updateCartItem);
router.delete("/cart-items/:id", authenticateToken, deleteCartItem);

// ─── Order Routes ───────────────────────────────────────────────────────────────
router.get("/orders", authenticateToken, authorizeRoles("admin"), getAllOrders);
router.get("/orders/:id", authenticateToken, getOrder);
router.post("/orders", authenticateToken, authorizeRoles("user"), createOrder);
router.put("/orders/:id", authenticateToken, authorizeRoles("admin"), updateOrder);
router.delete("/orders/:id", authenticateToken, authorizeRoles("admin"), deleteOrder);

// ─── Order Item Routes ─────────────────────────────────────────────────────────
router.get(
  "/order-items",
  authenticateToken,
  authorizeRoles("admin"),
  getAllOrderItems
);
router.get("/order-items/:id", authenticateToken, getOrderItem);
router.post(
  "/order-items",
  authenticateToken,
  authorizeRoles("user"),
  createOrderItem
);
router.put(
  "/order-items/:id",
  authenticateToken,
  authorizeRoles("user"),
  updateOrderItem
);
router.delete(
  "/order-items/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteOrderItem
);

// ─── User-Book Relationship Routes ─────────────────────────────────────────────
router.get(
  "/user-books",
  authenticateToken,
  authorizeRoles("admin"),
  getAllUserBooks
);
router.get(
  "/user-books/:user_id/:book_id",
  authenticateToken,
  authorizeRoles("admin", "user"),
  getUserBook
);
router.post(
  "/user-books",
  authenticateToken,
  authorizeRoles("user"),
  createUserBook
);
router.put(
  "/user-books/:user_id/:book_id",
  authenticateToken,
  authorizeRoles("user"),
  updateUserBook
);
router.delete(
  "/user-books/:user_id/:book_id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteUserBook
);
router.get(
  "/user-books/my",
  authenticateToken,
  authorizeRoles("user"),
  getMyBooks
);

export default router;
