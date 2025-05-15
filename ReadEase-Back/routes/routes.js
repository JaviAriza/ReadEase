import express from 'express';

// Importación de controladores
import { getAllUsers, getUser, createUser, updateUser, deleteUser, loginUser } from '../controllers/UserController.js';
import { getAllBooks, getBook, createBook, updateBook, deleteBook } from '../controllers/BookController.js';
import { getAllCarts, getCart, createCart, updateCart, deleteCart } from '../controllers/CartController.js';
import { getAllCartItems, getCartItem, createCartItem, updateCartItem, deleteCartItem } from '../controllers/CartItemController.js';
import { getAllOrders, getOrder, createOrder, updateOrder, deleteOrder } from '../controllers/OrderController.js';
import { getAllOrderItems, getOrderItem, createOrderItem, updateOrderItem, deleteOrderItem } from '../controllers/OrderItemController.js';
import { getAllUserBooks, getUserBook, createUserBook, updateUserBook, deleteUserBook } from '../controllers/UserBookController.js';  // Nueva importación

const router = express.Router();

// Rutas de usuarios
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);


// Rutas de libros
router.get('/books', getAllBooks);
router.get('/books/:id', getBook);
router.post('/books', createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

// Rutas de carrito
router.get('/carts', getAllCarts);
router.get('/carts/:id', getCart);
router.post('/carts', createCart);
router.put('/carts/:id', updateCart);
router.delete('/carts/:id', deleteCart);

// Rutas de ítems en carrito
router.get('/cart-items', getAllCartItems);
router.get('/cart-items/:id', getCartItem);
router.post('/cart-items', createCartItem);
router.put('/cart-items/:id', updateCartItem);
router.delete('/cart-items/:id', deleteCartItem);

// Rutas de órdenes
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrder);
router.post('/orders', createOrder);
router.put('/orders/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);

// Rutas de ítems de órdenes
router.get('/order-items', getAllOrderItems);
router.get('/order-items/:id', getOrderItem);
router.post('/order-items', createOrderItem);
router.put('/order-items/:id', updateOrderItem);
router.delete('/order-items/:id', deleteOrderItem);

// Rutas de relaciones entre usuarios y libros
router.get('/user-books', getAllUserBooks); // Obtener todas las relaciones usuario-libro
router.get('/user-books/:user_id/:book_id', getUserBook); // Obtener una relación específica usuario-libro
router.post('/user-books', createUserBook); // Crear una nueva relación usuario-libro
router.put('/user-books/:user_id/:book_id', updateUserBook); // Actualizar una relación usuario-libro
router.delete('/user-books/:user_id/:book_id', deleteUserBook); // Eliminar una relación usuario-libro

export default router;
