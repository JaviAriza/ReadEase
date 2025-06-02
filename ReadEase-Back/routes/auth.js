// src/routes/auth.js
import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Op } from 'sequelize'
import * as models from '../models/index.js'

const router = express.Router()

/**
 * POST /api/auth/login
 * Request body: { email, password }
 * Response: { token } if authentication succeeds
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Only users with a non-null role can login
    const user = await models.UserModel.findOne({
      where: {
        email,
        role: { [Op.not]: null }
      }
    })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const payload = {
      userId: user.id_user,
      role:   user.role
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
    return res.json({ token })

  } catch (error) {
    console.error('Error in /api/auth/login:', error)
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router
