import db from "../database/db.js";
import { DataTypes } from "sequelize";

const OrderModel = db.define('orders', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    date: { type: DataTypes.DATE },
    total_price: { type: DataTypes.DECIMAL(10, 2) }
}, {
    timestamps: false,
    freezeTableName: true 
});

export default OrderModel;
