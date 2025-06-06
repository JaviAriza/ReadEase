// ReadEase-Back/src/models/OrderModel.js
import db from "../database/db.js";
import { DataTypes } from "sequelize";

const OrderModel = db.define(
  "orders",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,      // Mapea la columna `date` de la BD
      allowNull: true,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2), // Mapea la columna `total_price`
      allowNull: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

export default OrderModel;
