import { Sequelize } from "sequelize";

const db = new Sequelize('readease','root','',{
		host: 'localhost',
		dialect: 'mysql',
		define: {
			timestamps: false 
		}
}) 

export default db;