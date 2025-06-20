import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import path from 'path'
import multer from 'multer'

import db from './database/db.js'
import router from './routes/routes.js'
import authRouter from './routes/auth.js'            // <-- Import auth routes
import { adminJs, router as adminRouter } from './admin.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)

const upload = multer({ dest: path.join(process.cwd(), 'tmp') })

app.use(adminJs.options.rootPath, adminRouter)

app.use('/api/books/:id/upload-pdf', upload.single('file'))

app.use('/api', router)

try {
  await db.authenticate()
  console.log('✔️ Database connected')
} catch (err) {
  console.error(err)
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server at http://localhost:${PORT}/`)
  console.log(`🛠 AdminJS at http://localhost:${PORT}${adminJs.options.rootPath}`)
})

export default app
