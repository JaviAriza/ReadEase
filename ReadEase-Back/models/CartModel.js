import db from "../database/db.js";
import { DataTypes } from "sequelize";

const CartModel = db.define('cart', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, unique: true }
}, {
    timestamps: false,
    freezeTableName: true 
});

export default CartModel;
