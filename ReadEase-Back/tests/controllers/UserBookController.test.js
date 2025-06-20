// tests/controllers/UserBookController.test.js
import { describe, it, beforeEach, expect, jest } from 'jest'
import * as UBController from '../../controllers/UserBookController.js'
import UserBookModel from '../../models/UserBookModel.js'

jest.mock('../../models/UserBookModel.js')

describe('UserBookController', () => {
  let req, res
  beforeEach(() => {
    req = { params: {}, body: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    jest.clearAllMocks()
  })

  describe('getAllUserBooks', () => {
    it('debe listar todas las asociaciones', async () => {
      const list = [{ id:1 },{ id:2 }]
      UserBookModel.findAll.mockResolvedValue(list)
      await UBController.getAllUserBooks(req, res)
      expect(res.json).toHaveBeenCalledWith(list)
    })
    it('maneja errores', async () => {
      const err = new Error('err')
      UserBookModel.findAll.mockRejectedValue(err)
      await UBController.getAllUserBooks(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: err.message })
    })
  })

  describe('getUserBook', () => {
    it('404 si no existe', async () => {
      req.params.id = '3'
      UserBookModel.findByPk.mockResolvedValue(null)
      await UBController.getUserBook(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'UserBook not found' })
    })
    it('devuelve la asociación si existe', async () => {
      req.params.id = '3'
      const ub = { id:3 }
      UserBookModel.findByPk.mockResolvedValue(ub)
      await UBController.getUserBook(req, res)
      expect(res.json).toHaveBeenCalledWith(ub)
    })
  })

  describe('createUserBook', () => {
    it('crea y responde 201', async () => {
      req.body = { userId:5, bookId:9 }
      const created = { id:11, ...req.body }
      UserBookModel.create.mockResolvedValue(created)
      await UBController.createUserBook(req, res)
      expect(UserBookModel.create).toHaveBeenCalledWith(req.body)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({ message: 'UserBook created successfully!', id: created.id })
    })
    it('maneja errores', async () => {
      const e = new Error('fail')
      UserBookModel.create.mockRejectedValue(e)
      await UBController.createUserBook(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: e.message })
    })
  })

  describe('updateUserBook', () => {
    it('404 si no actualiza', async () => {
      req.params.id = '6'
      req.body = { reading: true }
      UserBookModel.update.mockResolvedValue([0])
      await UBController.updateUserBook(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'UserBook not found' })
    })
    it('actualiza y responde éxito', async () => {
      req.params.id = '6'
      req.body = { reading: true }
      UserBookModel.update.mockResolvedValue([1])
      await UBController.updateUserBook(req, res)
      expect(res.json).toHaveBeenCalledWith({ message: 'UserBook updated successfully!' })
    })
  })

  describe('deleteUserBook', () => {
    it('404 si no existe', async () => {
      req.params.id = '7'
      UserBookModel.destroy.mockResolvedValue(0)
      await UBController.deleteUserBook(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'UserBook not found' })
    })
    it('borra y responde éxito', async () => {
      req.params.id = '7'
      UserBookModel.destroy.mockResolvedValue(1)
      await UBController.deleteUserBook(req, res)
      expect(res.json).toHaveBeenCalledWith({ message: 'UserBook deleted successfully!' })
    })
  })

  describe('getMyBooks', () => {
    it('debe devolver libros del usuario conectado', async () => {
      // asume que req.user puede venir de middleware
      req.user = { id_user: '42' }
      const list = [{ id:1, userId:42 }]
      UserBookModel.findAll.mockResolvedValue(list)
      await UBController.getMyBooks(req, res)
      expect(UserBookModel.findAll).toHaveBeenCalledWith({
        where: { userId: '42' },
      })
      expect(res.json).toHaveBeenCalledWith(list)
    })
    it('maneja errores', async () => {
      const e = new Error('boom')
      UserBookModel.findAll.mockRejectedValue(e)
      await UBController.getMyBooks(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: e.message })
    })
  })
})
