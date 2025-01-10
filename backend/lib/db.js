import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

export const db = async () => {
    try {
        const url = process.env.MONGODB_URL 
        await mongoose.connect(url)
        console.log("CONNECTED SUCCESSFULY TO DATABASE ");
    } catch (error) {
        console.log('while connecting to database '+error);
        
    }
}