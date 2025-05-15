import CartModel from '../models/CartModel.js'

export const getAllCarts = async (req, res) => {
    try {
        const carts = await CartModel.findAll()
        res.json(carts)
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const getCart = async (req, res) => {
    try {
        const cart = await CartModel.findOne({ where: { id: req.params.id } })
        res.json(cart)
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const createCart = async (req, res) => {
    try {
        await CartModel.create(req.body)
        res.json({ message: "Cart created successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const updateCart = async (req, res) => {
    try {
        await CartModel.update(req.body, { where: { id: req.params.id } })
        res.json({ message: "Cart updated successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const deleteCart = async (req, res) => {
    try {
        await CartModel.destroy({ where: { id: req.params.id } })
        res.json({ message: "Cart deleted successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}
