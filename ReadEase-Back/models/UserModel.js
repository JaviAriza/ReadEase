import db from "../database/db.js";

import { DataTypes } from "sequelize";

const UserModel = db.define('users', {
    
    id_user: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING }
    
}, {
    timestamps: false
});

export default UserModel;
