import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import AdminJSSequelize from '@adminjs/sequelize'
import bcrypt from 'bcryptjs'

import db from './database/db.js'
import * as models from './models/index.js'

// 1) Adapter de Sequelize
AdminJS.registerAdapter(AdminJSSequelize)

// 2) Configuración mínima de AdminJS
const adminJs = new AdminJS({
  databases: [db],
  rootPath: '/admin',
  branding: {
    companyName: 'ReadEase Admin',
    softwareBrothers: false,
    logo: false,
  },
  resources: [
    {
      resource: models.UserModel,
      options: {
        // tu configuración de hashing, visibilidad de campos…
      },
    },
    { resource: models.BookModel },
    { resource: models.CartModel },
    { resource: models.CartItemModel },
    { resource: models.OrderModel },
    { resource: models.OrderItemModel },
    { resource: models.UserBooksModel },
  ],
})

// 3) Autenticación básica
const ADMIN = {
  email:    process.env.ADMIN_EMAIL    || 'admin@readease.com',
  password: process.env.ADMIN_PASSWORD || 'changeme123',
}

const router = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      if (email === ADMIN.email && password === ADMIN.password) {
        return ADMIN
      }
      return null
    },
    cookieName:     'adminjs',
    cookiePassword: process.env.COOKIE_SECRET || 'sessionsecret123',
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
  }
)

export { adminJs, router }
