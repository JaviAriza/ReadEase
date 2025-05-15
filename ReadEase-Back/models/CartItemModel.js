import db from "../database/db.js";
import { DataTypes } from "sequelize";

const CartItemModel = db.define('cart_items', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cart_id: { type: DataTypes.INTEGER },
    book_id: { type: DataTypes.INTEGER }
}, {
    timestamps: false,
    freezeTableName: true 
});

export default CartItemModel;
