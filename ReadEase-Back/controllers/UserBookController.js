// ReadEase-Back/src/controllers/UserBookController.js
import UserBooksModel from "../models/UserBookModel.js";
import BookModel      from "../models/BookModel.js";

export const getAllUserBooks = async (req, res) => {
  try {
    const userBooks = await UserBooksModel.findAll();
    res.json(userBooks);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const getUserBook = async (req, res) => {
  try {
    const userBook = await UserBooksModel.findOne({
      where: { user_id: req.params.user_id, book_id: req.params.book_id },
    });
    if (userBook) {
      res.json(userBook);
    } else {
      res.status(404).json({ message: "User-Book relationship not found!" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const createUserBook = async (req, res) => {
  try {
    await UserBooksModel.create(req.body);
    res.json({ message: "User-Book relationship created successfully!" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const updateUserBook = async (req, res) => {
  try {
    await UserBooksModel.update(req.body, {
      where: {
        user_id: req.params.user_id,
        book_id: req.params.book_id,
      },
    });
    res.json({ message: "User-Book relationship updated successfully!" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const deleteUserBook = async (req, res) => {
  try {
    await UserBooksModel.destroy({
      where: { user_id: req.params.user_id, book_id: req.params.book_id },
    });
    res.json({ message: "User-Book relationship deleted successfully!" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

/**
 * GET /api/user-books/my
 * Devuelve los libros asociados al usuario autenticado,
 * sin usar include para evitar errores de asociación.
 */
export const getMyBooks = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    // 1) Obtenemos los book_id de user_books
    const entries = await UserBooksModel.findAll({
      where: { user_id: userId },
      attributes: ["book_id"]
    });

    const bookIds = entries.map(e => e.book_id);
    if (bookIds.length === 0) {
      return res.json([]);
    }

    // 2) Buscamos los libros correspondientes
    const books = await BookModel.findAll({
      where: { id: bookIds },
      attributes: ["id", "title", "author", "pdf_url"]
    });

    return res.json(books);
  } catch (err) {
    console.error("Error fetching my books:", err);
    return res.status(500).json({ message: "Server error." });
  }
};
