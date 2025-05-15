import UserBooksModel from '../models/UserBookModel.js'

export const getAllUserBooks = async (req, res) => {
    try {
        const userBooks = await UserBooksModel.findAll()
        res.json(userBooks)
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const getUserBook = async (req, res) => {
    try {
        const userBook = await UserBooksModel.findOne({ where: { user_id: req.params.user_id, book_id: req.params.book_id } })
        if (userBook) {
            res.json(userBook)
        } else {
            res.status(404).json({ message: "User-Book relationship not found" })
        }
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const createUserBook = async (req, res) => {
    try {
        await UserBooksModel.create(req.body)
        res.json({ message: "User-Book relationship created successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const updateUserBook = async (req, res) => {
    try {
        await UserBooksModel.update(req.body, { where: { user_id: req.params.user_id, book_id: req.params.book_id } })
        res.json({ message: "User-Book relationship updated successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const deleteUserBook = async (req, res) => {
    try {
        await UserBooksModel.destroy({ where: { user_id: req.params.user_id, book_id: req.params.book_id } })
        res.json({ message: "User-Book relationship deleted successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}
