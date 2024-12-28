import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()
import {db} from './lib/db.js'
const app = express();
const port = process.env.PORT || 5000
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
app.use(express.json())
app.use(cookieParser())
app.use("/api/v1/auth", authRoutes )
app.use("/api/v1/user", userRoutes )



app.listen(port , ()=>{
    console.log('SERVER RUNNING AT PORT '+port);
    db()
})