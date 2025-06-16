// ReadEase-Back/src/middleware/auth.js
import jwt from 'jsonwebtoken'

/**
 * Middleware to verify JWT from the Authorization header.
 * If valid, attaches payload to req.user and calls next().
 * Otherwise returns 401 (no token) or 403 (invalid token).
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    console.log('⚠️ authenticateToken: no token provided')
    return res.status(401).json({ message: 'No token provided' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret', (err, payload) => {
    if (err) {
      console.log('⚠️ authenticateToken: invalid token:', err.message)
      return res.status(403).json({ message: 'Invalid or expired token' })
    }
    req.user = payload    // payload.id_user and payload.role
    console.log('✅ authenticateToken:', payload)
    next()
  })
}

/**
 * Factory middleware to allow only certain roles.
 * Usage: authorizeRoles('admin', 'manager')
 */
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    console.log('🔐 authorizeRoles: user.role=', req.user?.role, 'allowed=', allowedRoles)
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      console.log('🚫 authorizeRoles: forbidden')
      return res.status(403).json({ message: 'Access forbidden: insufficient rights' })
    }
    next()
  }
}

/**
 * Middleware to allow the user themself (matching :id) or an admin.
 * Útil para rutas GET/PUT/DELETE /users/:id
 */
export function authorizeSelfOrAdmin(req, res, next) {
  const { role, id_user } = req.user
  const paramId = parseInt(req.params.id, 10)
  console.log('🔐 authorizeSelfOrAdmin: user.id_user=', id_user, 'param.id=', paramId, 'role=', role)
  if (role === 'admin' || id_user === paramId) {
    console.log('✅ authorizeSelfOrAdmin: allowed')
    return next()
  }
  console.log('🚫 authorizeSelfOrAdmin: forbidden')
  return res.status(403).json({ message: 'Access forbidden: insufficient rights' })
}
