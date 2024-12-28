import User from '../models/User.model.js'
import jwt  from 'jsonwebtoken'
import dotenv from 'dotenv'
import { sendWelcomeEmail } from '../emails/emailHandlers.js'
dotenv.config()
// export const signUp = async (req , res) => {
//     try {
        
//     } catch (error) {
//         console.log('error occured while signing up '+ error);
        
//     }
// }

export const signUp = async (req , res) => {
    try {
        const {name , email , username , password}= req.body
        const user = await User.findOne({$or : [{email} , {username}]})
        if(user) return res.status(400).json({message : "Email or username already exists"}) 
        if(password.length <6 ) return res.status(400).json({message : "password must be 6 character long"})
        const newUser =  new User({
            name,
            username , 
            email, 
            password , 
    
        })   
        await newUser.save()
        const token = jwt.sign({userId: newUser._id},process.env.SECRET_KEY,{
            expiresIn : '3d'
        })


       
        const profileUrl= process.env.CLIENT_URL+'/profile/'+newUser.username
        try {
            await sendWelcomeEmail(newUser.email , newUser.name , profileUrl);
        } catch (error) {
            console.error('error sending welcome email '+error);
            
        }
        res.cookie('token', token, {
            httpOnly : true , 
            maxAge : 3*24*60*60*1000,
            sameSite : "strict",
            secure : process.env.NODE_ENV  === 'production'
             
        }).json({message : 'user created succesfully'})
    } catch (error) {
        console.log('error occured while signing up '+ error);
        res.status(500).json({message : 'something went wrong in server side'})
    }

}
export const signIn = async (req , res) => {
    try {
        const {username , password} = req.body  
        const user = await User.find({username} )
        if(!user) return res.status(400).json({message : 'Invalid credentials'})
        const match = await user.ComparePassword(password)
        if(!match) return res.status(400).json({message : 'Invalid credentials'})
        const token = jwt.sign({userId: newUser._id},process.env.SECRET_KEY,{
                expiresIn : '3d'
        })
        res.cookie('token', token, {
            httpOnly : true , 
            maxAge : 3*24*60*60*1000,
            sameSite : "strict",
            secure : process.env.NODE_ENV  === 'production'
             
        }).json({message : 'logged in  succesfully'})
    } catch (error) {
        console.log('error occured while signing up '+ error);
        
    }
}
export const Logout = async (req , res) => {
    try {
        res.clearCookie('token')
        res.json({message : "logged out sucessfully"})       

    } catch (error) {
        console.log('error occured while logging  out  up '+ error);
        
    }
}
export const profile = async () => { 
    try {
        res.status(200).json({user : req.user});
    } catch (error) {
        console.log('error occured while getting profile  '+ error);
    }
}