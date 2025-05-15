import OrderModel from '../models/OrderModel.js'

export const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.findAll()
        res.json(orders)
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const getOrder = async (req, res) => {
    try {
        const order = await OrderModel.findOne({ where: { id: req.params.id } })
        res.json(order)
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const createOrder = async (req, res) => {
    try {
        await OrderModel.create(req.body)
        res.json({ message: "Order created successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const updateOrder = async (req, res) => {
    try {
        await OrderModel.update(req.body, { where: { id: req.params.id } })
        res.json({ message: "Order updated successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const deleteOrder = async (req, res) => {
    try {
        await OrderModel.destroy({ where: { id: req.params.id } })
        res.json({ message: "Order deleted successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}

