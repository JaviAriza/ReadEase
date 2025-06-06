// ReadEase-Back/src/models/CartItemModel.js
import db from "../database/db.js";
import { DataTypes } from "sequelize";
import BookModel from "./BookModel.js"; // Importamos para la asociación

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
// Cada CartItem pertenece a un único Book (clave foránea 'book_id', alias 'book')
CartItemModel.belongsTo(BookModel, {
  foreignKey: "book_id",
  as: "book",
});

// Un Book puede tener muchos CartItems asociados
BookModel.hasMany(CartItemModel, {
  foreignKey: "book_id",
  as: "cart_items",
});

export default CartItemModel;
