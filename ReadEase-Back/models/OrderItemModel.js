// ReadEase-Back/src/models/OrderItemModel.js
import db from "../database/db.js";
import { DataTypes } from "sequelize";

const OrderItemModel = db.define(
  "order_items",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

export default OrderItemModel;
