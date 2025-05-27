
import jwt from 'jsonwebtoken'

/**
 * Middleware to verify JWT from the Authorization header.
 * If valid, attaches payload to req.user and calls next().
 * Otherwise returns 401 (no token) or 403 (invalid token).
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  // Expect header format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' })
    }
    req.user = payload    // payload.userId and payload.role
    next()
  })
}

/**
 * Factory middleware to allow only certain roles.
 * Usage: authorizeRoles('admin', 'manager')
 */
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden: insufficient rights' })
    }
    next()
  }
}
