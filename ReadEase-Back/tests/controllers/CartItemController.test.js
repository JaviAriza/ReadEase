// tests/controllers/CartItemController.test.js
import { describe, it, beforeEach, expect, jest } from 'jest'
import * as CartItemController from '../../controllers/CartItemController.js'
import CartItemModel from '../../models/CartItemModel.js'

jest.mock('../../models/CartItemModel.js')

describe('CartItemController', () => {
  let req, res
  beforeEach(() => {
    req = { params: {}, body: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    jest.clearAllMocks()
  })

  describe('getAllCartItems', () => {
    it('debe devolver todos los items', async () => {
      const items = [{ id:1 }, { id:2 }]
      CartItemModel.findAll.mockResolvedValue(items)
      await CartItemController.getAllCartItems(req, res)
      expect(res.json).toHaveBeenCalledWith(items)
    })
    it('maneja errores', async () => {
      const error = new Error('fail')
      CartItemModel.findAll.mockRejectedValue(error)
      await CartItemController.getAllCartItems(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: error.message })
    })
  })

  describe('getCartItemById', () => {
    it('404 si no existe', async () => {
      req.params.id = '4'
      CartItemModel.findByPk.mockResolvedValue(null)
      await CartItemController.getCartItemById(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart item not found' })
    })
    it('devuelve item si existe', async () => {
      req.params.id = '4'
      const item = { id:4 }
      CartItemModel.findByPk.mockResolvedValue(item)
      await CartItemController.getCartItemById(req, res)
      expect(res.json).toHaveBeenCalledWith(item)
    })
  })

  describe('createCartItem', () => {
    it('crea item y responde 201', async () => {
      req.body = { cartId:3, bookId:8, quantity:1 }
      const created = { id: 10, ...req.body }
      CartItemModel.create.mockResolvedValue(created)
      await CartItemController.createCartItem(req, res)
      expect(CartItemModel.create).toHaveBeenCalledWith(req.body)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(created)
    })
    it('maneja errores', async () => {
      const error = new Error('oops')
      CartItemModel.create.mockRejectedValue(error)
      await CartItemController.createCartItem(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: error.message })
    })
  })

  describe('updateCartItem', () => {
    it('404 si no actualiza', async () => {
      req.params.id = '5'
      req.body = { quantity: 2 }
      CartItemModel.update.mockResolvedValue([0])
      await CartItemController.updateCartItem(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart item not found' })
    })
    it('actualiza y responde 200', async () => {
      req.params.id = '5'
      req.body = { quantity: 2 }
      CartItemModel.update.mockResolvedValue([1])
      await CartItemController.updateCartItem(req, res)
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart item updated successfully!' })
    })
  })

  describe('deleteCartItem', () => {
    it('404 si no borra', async () => {
      req.params.id = '7'
      CartItemModel.destroy.mockResolvedValue(0)
      await CartItemController.deleteCartItem(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart item not found' })
    })
    it('borra y responde 200', async () => {
      req.params.id = '7'
      CartItemModel.destroy.mockResolvedValue(1)
      await CartItemController.deleteCartItem(req, res)
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart item deleted successfully!' })
    })
  })
})
