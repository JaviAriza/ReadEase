// ReadEase-Back/src/models/UserBookModel.js
import db from "../database/db.js";
import { DataTypes } from "sequelize";

const UserBooksModel = db.define(
  "user_books",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    book_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "books",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
    tableName: "user_books",
    freezeTableName: true,
  }
);

export default UserBooksModel;
