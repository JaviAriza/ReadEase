import bcrypt from 'bcryptjs'
import UserModel from '../../models/UserModel.js'
import * as UserController from '../../controllers/UserController.js'

describe('UserController', () => {
  let req, res

  beforeEach(() => {
    req = { body: {}, params: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    jest.clearAllMocks()
  })

  describe('createUser', () => {
    it('debe devolver 400 si faltan name, email o password', async () => {
      req.body = {}
      await UserController.createUser(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Name, email and password are required.'
      })
    })

    it('debe devolver 400 si el email ya existe', async () => {
      req.body = { name: 'A', email: 'a@a.com', password: 'pwd' }
      jest.spyOn(UserModel, 'findOne').mockResolvedValue({/* usuario existente */})
      await UserController.createUser(req, res)
      expect(UserModel.findOne).toHaveBeenCalledWith({
        where: { email: 'a@a.com' }
      })
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email already registered.'
      })
    })

    it('debe crear un usuario y devolverlo sin password', async () => {
      req.body = { name: 'A', email: 'a@a.com', password: 'pwd' }
      jest.spyOn(UserModel, 'findOne').mockResolvedValue(null)
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpwd')
      const raw = {
        id_user: 42,
        name: 'A',
        email: 'a@a.com',
        password: 'hashedpwd',
        role: 'user'
      }
      jest.spyOn(UserModel, 'create').mockResolvedValue({
        get: () => raw
      })
      await UserController.createUser(req, res)
      expect(bcrypt.hash).toHaveBeenCalledWith('pwd', 10)
      expect(UserModel.create).toHaveBeenCalledWith({
        name: 'A',
        email: 'a@a.com',
        password: 'hashedpwd',
        role: 'user'
      })
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        id_user: 42,
        name: 'A',
        email: 'a@a.com',
        role: 'user'
      })
    })
  })

  describe('getUser', () => {
    it('debe devolver 404 si no existe', async () => {
      req.params = { id: '3' }
      jest.spyOn(UserModel, 'findOne').mockResolvedValue(null)
      await UserController.getUser(req, res)
      expect(UserModel.findOne).toHaveBeenCalledWith({
        where: { id_user: '3' },
        attributes: { exclude: ['password'] }
      })
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found.'
      })
    })

    it('debe devolver el usuario si existe', async () => {
      req.params = { id: '3' }
      const user = { id_user: 3, name: 'X', email: 'x@x.com', role: 'user' }
      jest.spyOn(UserModel, 'findOne').mockResolvedValue(user)
      await UserController.getUser(req, res)
      expect(res.json).toHaveBeenCalledWith(user)
    })

    it('debe manejar errores internos', async () => {
      const error = new Error('fail')
      jest.spyOn(UserModel, 'findOne').mockRejectedValue(error)
      await UserController.getUser(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: error.message })
    })
  })

  describe('updateUser', () => {
    it('debe devolver 404 si no encuentra usuario', async () => {
      req.params = { id: '5' }
      req.body = { email: 'u@u.com' }
      jest.spyOn(UserModel, 'findOne').mockResolvedValue(null)
      await UserController.updateUser(req, res)
      expect(UserModel.findOne).toHaveBeenCalledWith({
        where: { id_user: '5' }
      })
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found.'
      })
    })

    it('debe actualizar y devolver mensaje de éxito', async () => {
      req.params = { id: '5' }
      req.body = { email: 'u@u.com' }
      const user = {
        id_user: 5,
        save: jest.fn().mockResolvedValue()
      }
      jest.spyOn(UserModel, 'findOne').mockResolvedValue(user)
      await UserController.updateUser(req, res)
      expect(user.email).toBe('u@u.com')
      expect(user.save).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        message: 'User updated successfully.'
      })
    })

    it('debe manejar errores al guardar', async () => {
      req.params = { id: '5' }
      req.body = { email: 'u@u.com' }
      const user = {
        id_user: 5,
        save: jest.fn().mockRejectedValue(new Error('oops'))
      }
      jest.spyOn(UserModel, 'findOne').mockResolvedValue(user)
      await UserController.updateUser(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'oops' })
    })
  })

  describe('deleteUser', () => {
    it('debe devolver 404 si no existe', async () => {
      req.params = { id: '7' }
      jest.spyOn(UserModel, 'findOne').mockResolvedValue(null)
      await UserController.deleteUser(req, res)
      expect(UserModel.findOne).toHaveBeenCalledWith({
        where: { id_user: '7' }
      })
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found.'
      })
    })

    it('debe borrar y devolver mensaje de éxito', async () => {
      req.params = { id: '7' }
      jest.spyOn(UserModel, 'findOne').mockResolvedValue({ id_user: 7 })
      jest.spyOn(UserModel, 'destroy').mockResolvedValue(1)
      await UserController.deleteUser(req, res)
      expect(UserModel.destroy).toHaveBeenCalledWith({
        where: { id_user: '7' }
      })
      expect(res.json).toHaveBeenCalledWith({
        message: 'User deleted successfully.'
      })
    })

    it('debe manejar errores al borrar', async () => {
      req.params = { id: '7' }
      jest.spyOn(UserModel, 'findOne').mockRejectedValue(new Error('fail-delete'))
      await UserController.deleteUser(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'fail-delete' })
    })
  })
})
