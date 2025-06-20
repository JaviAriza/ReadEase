import { describe, it, beforeEach, expect, jest } from 'jest'
import * as CartController from '../../controllers/CartController.js'
import CartModel from '../../models/CartModel.js'
import CartItemModel from '../../models/CartItemModel.js'

jest.mock('../../models/CartModel.js')
jest.mock('../../models/CartItemModel.js')

describe('CartController', () => {
  let req, res
  beforeEach(() => {
    req = { params: {}, body: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    jest.clearAllMocks()
  })

  describe('getAllCarts', () => {
    it('debe devolver todos los carritos', async () => {
      const carts = [{ id: 1 }, { id: 2 }]
      CartModel.findAll.mockResolvedValue(carts)
      await CartController.getAllCarts(req, res)
      expect(CartModel.findAll).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith(carts)
    })
    it('maneja errores internamente', async () => {
      const error = new Error('fail')
      CartModel.findAll.mockRejectedValue(error)
      await CartController.getAllCarts(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: error.message })
    })
  })

  describe('getCartById', () => {
    it('debe devolver 404 si no existe', async () => {
      req.params.id = '10'
      CartModel.findByPk.mockResolvedValue(null)
      await CartController.getCartById(req, res)
      expect(CartModel.findByPk).toHaveBeenCalledWith('10')
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart not found' })
    })
    it('debe devolver el carrito si existe', async () => {
      req.params.id = '2'
      const cart = { id: 2 }
      CartModel.findByPk.mockResolvedValue(cart)
      await CartController.getCartById(req, res)
      expect(res.json).toHaveBeenCalledWith(cart)
    })
  })

  describe('createCart', () => {
    it('debe crear un carrito y responder 201', async () => {
      req.body = { userId: 5 }
      const created = { id: 99, userId: 5 }
      CartModel.create.mockResolvedValue(created)
      await CartController.createCart(req, res)
      expect(CartModel.create).toHaveBeenCalledWith(req.body)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart created successfully!', id: created.id })
    })
    it('maneja errores', async () => {
      const error = new Error('oops')
      CartModel.create.mockRejectedValue(error)
      await CartController.createCart(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: error.message })
    })
  })

  describe('updateCart', () => {
    it('debe responder 404 si no actualiza nada', async () => {
      req.params.id = '5'
      req.body = { status: 'closed' }
      CartModel.update.mockResolvedValue([0])
      await CartController.updateCart(req, res)
      expect(CartModel.update).toHaveBeenCalledWith(req.body, { where: { id: '5' } })
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart not found' })
    })
    it('debe actualizar y responder mensaje de éxito', async () => {
      req.params.id = '5'
      req.body = { status: 'closed' }
      CartModel.update.mockResolvedValue([1])
      await CartController.updateCart(req, res)
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart updated successfully!' })
    })
  })

  describe('deleteCart', () => {
    it('debe responder 404 si no existe', async () => {
      req.params.id = '8'
      CartModel.destroy.mockResolvedValue(0)
      await CartController.deleteCart(req, res)
      expect(CartModel.destroy).toHaveBeenCalledWith({ where: { id: '8' } })
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart not found' })
    })
    it('debe borrar y responder mensaje de éxito', async () => {
      req.params.id = '8'
      CartModel.destroy.mockResolvedValue(1)
      await CartController.deleteCart(req, res)
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart deleted successfully!' })
    })
  })

  describe('addItemToCart', () => {
    it('debe añadir un item y responder 201', async () => {
      req.params.cartId = '3'
      req.body = { bookId: 7, quantity: 2 }
      const item = { id: 11, cartId: 3, ...req.body }
      CartItemModel.create.mockResolvedValue(item)
      await CartController.addItemToCart(req, res)
      expect(CartItemModel.create).toHaveBeenCalledWith({ cartId: '3', ...req.body })
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(item)
    })
    it('maneja errores', async () => {
      const error = new Error('err1')
      CartItemModel.create.mockRejectedValue(error)
      await CartController.addItemToCart(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: error.message })
    })
  })

  describe('removeItemFromCart', () => {
    it('debe eliminar un item y responder 200', async () => {
      req.params = { cartId: '3', itemId: '9' }
      CartItemModel.destroy.mockResolvedValue(1)
      await CartController.removeItemFromCart(req, res)
      expect(CartItemModel.destroy).toHaveBeenCalledWith({
        where: { id: '9', cartId: '3' }
      })
      expect(res.json).toHaveBeenCalledWith({ message: 'Item removed successfully!' })
    })
    it('debe devolver 404 si no elimina', async () => {
      CartItemModel.destroy.mockResolvedValue(0)
      await CartController.removeItemFromCart(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' })
    })
  })
})
