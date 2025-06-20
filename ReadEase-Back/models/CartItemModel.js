import db from "../database/db.js";
import { DataTypes } from "sequelize";
import BookModel from "./BookModel.js"; 

const CartItemModel = db.define(
  "cart_items",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cart_id: {
      type: DataTypes.INTEGER,
    },
    book_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// === ASOCIACIONES ===
CartItemModel.belongsTo(BookModel, {
  foreignKey: "book_id",
  as: "book",
});

BookModel.hasMany(CartItemModel, {
  foreignKey: "book_id",
  as: "cart_items",
});

export default CartItemModel;
