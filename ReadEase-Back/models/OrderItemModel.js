import db from "../database/db.js";
import { DataTypes } from "sequelize";

const OrderItemModel = db.define('order_items', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER },
    book_id: { type: DataTypes.INTEGER }
}, {
    timestamps: false
});

export default OrderItemModel;
