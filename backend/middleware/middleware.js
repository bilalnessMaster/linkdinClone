import jwt from "jsonwebtoken"
import User from "../models/User.model.js"




export const protectRoute = async (req, res , next) => {
    try {
        const {token} = req.cookies
        if(!token) return res.status(401).json({message : 'please login'})
        jwt.verify(token, process.env.SECRET_KEY, {} , async (err , payload)=>{
            try {
                if(err) throw err
                const user = await User.findById(payload.userId)
                if(!user) return res.status(404).json({message : 'user not found'})
                req.user = user
                next()
            } catch (error) {
                console.log('error happend while protectinf the routes internal error'+error);
                
            }
        })


    } catch (error) {
        console.log('error happend while protectinf the routes external error '+error);
        res.status(500).json({message : 'internal error'})
    }
}