import db from "../database/db.js";
import { DataTypes } from "sequelize";

const BookModel = db.define('books', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(150) },
    author: { type: DataTypes.STRING(100) },
    pdf_url: { type: DataTypes.STRING(255) },
    price: { type: DataTypes.DECIMAL(10, 2) }
}, {
    timestamps: false
});

export default BookModel;
