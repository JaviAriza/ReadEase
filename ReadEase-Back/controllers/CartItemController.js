import CartItemModel from '../models/CartItemModel.js'

export const getAllCartItems = async (req, res) => {
    try {
        const items = await CartItemModel.findAll()
        res.json(items)
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const getCartItem = async (req, res) => {
    try {
        const item = await CartItemModel.findOne({ where: { id: req.params.id } })
        res.json(item)
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const createCartItem = async (req, res) => {
    try {
        await CartItemModel.create(req.body)
        res.json({ message: "Item added to cart successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const updateCartItem = async (req, res) => {
    try {
        await CartItemModel.update(req.body, { where: { id: req.params.id } })
        res.json({ message: "Cart item updated successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const deleteCartItem = async (req, res) => {
    try {
        await CartItemModel.destroy({ where: { id: req.params.id } })
        res.json({ message: "Cart item deleted successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}
