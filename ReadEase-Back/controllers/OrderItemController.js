import OrderItemModel from '../models/OrderItemModel.js'

export const getAllOrderItems = async (req, res) => {
    try {
        const items = await OrderItemModel.findAll()
        res.json(items)
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const getOrderItem = async (req, res) => {
    try {
        const item = await OrderItemModel.findOne({ where: { id: req.params.id } })
        res.json(item)
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const createOrderItem = async (req, res) => {
    try {
        await OrderItemModel.create(req.body)
        res.json({ message: "Order item created successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const updateOrderItem = async (req, res) => {
    try {
        await OrderItemModel.update(req.body, { where: { id: req.params.id } })
        res.json({ message: "Order item updated successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const deleteOrderItem = async (req, res) => {
    try {
        await OrderItemModel.destroy({ where: { id: req.params.id } })
        res.json({ message: "Order item deleted successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}

