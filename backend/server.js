import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import postRoutes from './routes/post.route.js'
import notificationRoutes from './routes/notification.route.js'
import connectionsRoutes from './routes/connections.route.js'
import {db} from './lib/db.js'
dotenv.config()


const app = express();
const port = process.env.PORT || 5000
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials : true,
}))
app.use(express.json({
    limit : "5mb"
}))
app.use(cookieParser())
app.use("/api/v1/auth", authRoutes )
app.use("/api/v1/user", userRoutes )
app.use('/api/v1/posts', postRoutes )
app.use('/api/v1/notifications', notificationRoutes )
app.use('/api/v1/connections', connectionsRoutes )


app.listen(port , ()=>{
    console.log('SERVER RUNNING AT PORT '+port);
    db()
})