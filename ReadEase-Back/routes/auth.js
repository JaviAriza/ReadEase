import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
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

    // 1) Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // 2) Find user by email
    const user = await models.UserModel.findOne({ where: { email } })
    if (!user) {
      // Do not reveal which field failed
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // 3) Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // 4) Build JWT payload
    const payload = {
      userId: user.id_user,  // your primary key column
      role:   user.role,
    }

    // 5) Sign the token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    // 6) Return token to client
    return res.json({ token })

  } catch (error) {
    console.error('Error in /api/auth/login:', error)
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router
