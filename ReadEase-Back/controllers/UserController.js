import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserModel from '../models/UserModel.js'


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findOne({ where: { email } })
    if (!user) {
      return res.status(400).json({ message: 'Incorrect email or password.' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect email or password.' })
    }
    const payload = {
      id_user: user.id_user,
      name:    user.name,
      email:   user.email,
      role:    user.role
    }
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1h' }
    )
    return res.json({ token })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

/**
 * GET /users
 * Devuelve lista de todos los usuarios (sin password).
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: { exclude: ['password'] }
    })
    return res.json(users)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

/**
 * GET /users/:id
 * Devuelve un usuario individual (sin password).
 */
export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      where: { id_user: req.params.id },
      attributes: { exclude: ['password'] }
    })
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }
    return res.json(user)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

/**
 * POST /users
 * Body: { name, email, password }
 * Crea un usuario con role='user' y contraseña hasheada.
 */
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' })
    }
    const existing = await UserModel.findOne({ where: { email } })
    if (existing) {
      return res.status(400).json({ message: 'Email already registered.' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    })
    const { password: _, ...userData } = newUser.get({ plain: true })
    return res.status(201).json(userData)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

/**
 * PUT /users/:id
 * Body: { name?, email?, oldPassword?, newPassword?, password? }
 * - Usuarios pueden cambiar su nombre/email y contraseña (con old/new).
 * - Admin puede cambiar cualquier campo e incluso enviar directamente `password`.
 */
export const updateUser = async (req, res) => {
  const { id } = req.params
  const { name, email, password, oldPassword, newPassword } = req.body

  console.log('✏️ updateUser called for id=', id, 'body=', req.body, 'user=', req.user)
  try {
    // Permisos (ya filtrados en middleware)
    const user = await UserModel.findOne({ where: { id_user: id } })
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    // Cambio de contraseña
    if (oldPassword || newPassword) {
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Must provide oldPassword and newPassword.' })
      }
      const match = await bcrypt.compare(oldPassword, user.password)
      if (!match) {
        return res.status(400).json({ message: 'Current password is incorrect.' })
      }
      user.password = await bcrypt.hash(newPassword, 10)
    }
    // Cambio directo de password por admin
    else if (password) {
      user.password = await bcrypt.hash(password, 10)
    }

    // Cambio de nombre/email
    if (name)  user.name  = name
    if (email) user.email = email

    await user.save()
    console.log('✅ updateUser: success')
    return res.json({ message: 'User updated successfully.' })
  } catch (error) {
    console.error('🔥 updateUser error:', error)
    return res.status(500).json({ message: error.message })
  }
}

/**
 * DELETE /users/:id
 * - Solo admin o el propio usuario pueden borrar la cuenta.
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params
  console.log('🗑 deleteUser called for id=', id, 'user=', req.user)
  try {
    const user = await UserModel.findOne({ where: { id_user: id } })
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }
    await UserModel.destroy({ where: { id_user: id } })
    return res.json({ message: 'User deleted successfully.' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

/**
 * GET /users/me
 * Wrapper para getUser usando id del token.
 */
export const getSelfUser = (req, res, next) => {
  req.params.id = req.user.id_user
  return getUser(req, res, next)
}

/**
 * PUT /users/me
 * Wrapper para updateUser usando id del token.
 */
export const updateSelfUser = (req, res, next) => {
  req.params.id = req.user.id_user
  return updateUser(req, res, next)
}

/**
 * DELETE /users/me
 * Wrapper para deleteUser usando id del token.
 */
export const deleteSelfUser = (req, res, next) => {
  req.params.id = req.user.id_user
  return deleteUser(req, res, next)
}
