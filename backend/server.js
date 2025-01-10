import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()
import {db} from './lib/db.js'
const app = express();
const port = process.env.PORT || 5000
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import postRoutes from './routes/post.route.js'
import notificationRoutes from './routes/notification.route.js'
import connectionsRoutes from './routes/connections.route.js'
app.use(express.json())
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