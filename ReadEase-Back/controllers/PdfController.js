import axios from 'axios'
import pdfParse from 'pdf-parse'
import { BookModel } from '../models/index.js'

export const getBookText = async (req, res) => {
  try {
    const { id } = req.params
    const book = await BookModel.findByPk(id)
    if (!book)         return res.status(404).json({ message: 'Book not found' })
    if (!book.pdf_url) return res.status(404).json({ message: 'PDF URL not set' })

    // 1) Descarga el PDF como arraybuffer
    const response = await axios.get(book.pdf_url, { responseType: 'arraybuffer' })
    // 2) Extrae el texto
    const data = await pdfParse(response.data)
    // 3) Devuelve el texto
    res.json({ text: data.text })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}
