import express from "express";
import db from "./database/db.js";
import router from './routes/routes.js'
import cors from 'cors';

const app = express()
app.get('/', (req, res) =>{
 res.send('Hola Api')
    //res.redirect('/api/books');????
})

app.use(cors());
app.use(express.json())
app.use('/api', router)


try{
	await db.authenticate()
		console.log('conected to database🪐')
}catch(error){
    console.log(`error:' ${error}`)
}

app.listen(3000,() =>{
console.log('🚀server up in http://localhost:3000/')
} )