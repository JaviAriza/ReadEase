import {
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from '../../controllers/BookController.js';
import BookModel from '../../models/BookModel.js';

describe('BookController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getBook', () => {
    it('devuelve el libro si existe', async () => {
      const book = { id: 2, title: 'Bar' };
      BookModel.findOne = jest.fn().mockResolvedValue(book);
      req.params.id = '2';

      await getBook(req, res);

      expect(BookModel.findOne).toHaveBeenCalledWith({ where: { id: '2' } });
      expect(res.json).toHaveBeenCalledWith(book);
    });

    it('maneja errores y responde con mensaje', async () => {
      const error = new Error('fail');
      BookModel.findOne = jest.fn().mockRejectedValue(error);

      await getBook(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('createBook', () => {
    it('crea un libro y responde con mensaje de éxito', async () => {
      const payload = { title: 'Foo' };
      req.body = payload;
      const created = { id: 99, ...payload };
      BookModel.create = jest.fn().mockResolvedValue(created);

      await createBook(req, res);

      expect(BookModel.create).toHaveBeenCalledWith(payload);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Book created successfully!',
      });
    });

    it('maneja errores y responde con mensaje', async () => {
      const error = new Error('err');
      BookModel.create = jest.fn().mockRejectedValue(error);

      await createBook(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('updateBook', () => {
    it('actualiza un libro y responde con mensaje de éxito', async () => {
      req.params.id = '5';
      req.body = { title: 'Updated' };
      BookModel.update = jest.fn().mockResolvedValue([1]);

      await updateBook(req, res);

      expect(BookModel.update).toHaveBeenCalledWith(
        req.body,
        { where: { id: '5' } }
      );
      expect(res.json).toHaveBeenCalledWith({
        message: 'Book updated successfully!',
      });
    });

    it('maneja errores y responde con mensaje', async () => {
      const error = new Error('err2');
      BookModel.update = jest.fn().mockRejectedValue(error);

      await updateBook(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('deleteBook', () => {
    it('borra un libro y responde con mensaje de éxito', async () => {
      req.params.id = '8';
      BookModel.destroy = jest.fn().mockResolvedValue(1);

      await deleteBook(req, res);

      expect(BookModel.destroy).toHaveBeenCalledWith({
        where: { id: '8' },
      });
      expect(res.json).toHaveBeenCalledWith({
        message: 'Book deleted successfully!',
      });
    });

    it('maneja errores y responde con mensaje', async () => {
      const error = new Error('err3');
      BookModel.destroy = jest.fn().mockRejectedValue(error);

      await deleteBook(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });
});
