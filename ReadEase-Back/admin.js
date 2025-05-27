// admin.js
import dotenv from 'dotenv'
dotenv.config()

import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import AdminJSSequelize from '@adminjs/sequelize'
import bcrypt from 'bcryptjs'

import db from './database/db.js'
import * as models from './models/index.js'

// 1) Registrar el adaptador de Sequelize
AdminJS.registerAdapter(AdminJSSequelize)

// 2) Configuración de AdminJS
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
        properties: {
          password: {
            isVisible: { list: false, edit: true, filter: false, show: false },
          },
          role: {
            availableValues: [
              { value: 'admin',   label: 'Admin' },
              { value: 'manager', label: 'Manager' },
              { value: 'user',    label: 'User' },
            ],
          },
        },
        actions: {
          new: {
            before: async (request) => {
              if (request.payload?.password) {
                request.payload.password = await bcrypt.hash(request.payload.password, 10)
              }
              return request
            },
          },
          edit: {
            before: async (request) => {
              if (request.payload?.password) {
                request.payload.password = await bcrypt.hash(request.payload.password, 10)
              }
              return request
            },
          },
        },
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

// 3) Seed dinámico del usuario admin
async function ensureAdminUser() {
  const email    = process.env.ADMIN_EMAIL    || 'admin@readease.com'
  const password = process.env.ADMIN_PASSWORD || 'changeme123'
  const role     = 'admin'

  const [admin, created] = await models.UserModel.findOrCreate({
    where: { email, role },
    defaults: {
      name:     'Admin',
      password: await bcrypt.hash(password, 10),
      role,
    },
  })
  if (created) {
    console.log(`🚀 Usuario admin inicial creado: ${email}`)
  }
}

await ensureAdminUser()

// 4) Router autenticado de AdminJS
const router = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      const user = await models.UserModel.findOne({
        where: { email, role: 'admin' },
      })
      if (user && await bcrypt.compare(password, user.password)) {
        return user
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
