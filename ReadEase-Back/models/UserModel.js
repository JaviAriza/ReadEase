// importamos nuestra conexión
import db from "../database/db.js";

// vamos a utilizar DataTypes de sequelize para definir los tipos de datos
import { DataTypes } from "sequelize";

// ponemos un nombre a nuestro modelo para después poder exportarlo y llamarlo
// le decimos que en la base de datos nos cree si no existe o apunte su consulta a una tabla llamada users
const UserModel = db.define('users', {
    
    // definimos cada uno de los campos de nuestra tabla
    id_user: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING }
    
}, {
    timestamps: false // para que no añada createdAt y updatedAt automáticamente
});

// lo exportamos para utilizarlo fuera de este archivo
export default UserModel;
