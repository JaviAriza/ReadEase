import jwt from 'jsonwebtoken'

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
    req.user = payload    
    console.log('✅ authenticateToken:', payload)
    next()
  })
}


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
