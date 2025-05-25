// app.js
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import path from 'path'
import multer from 'multer'
import db from './database/db.js'
import router from './routes/routes.js'
import { adminJs, router as adminRouter } from './admin.js'

const app = express()
app.use(cors())
app.use(express.json())

// 1) Configura multer para subir PDFs a /tmp
const upload = multer({ dest: path.join(process.cwd(), 'tmp') })

// 2) Monta AdminJS ANTES de las rutas de API
app.use(adminJs.options.rootPath, adminRouter)

// 3) Aplica multer SOLO en la ruta de upload-pdf
//    De este modo, cuando llegue un POST a /api/books/:id/upload-pdf,
//    primero pasa por upload.single('file') y luego por tu controlador en routes/routes.js
app.use('/api/books/:id/upload-pdf', upload.single('file'))

// 4) Monta todas las rutas de tu API (incluye GET /books/:id/text y POST /books/:id/upload-pdf)
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

export default app;
