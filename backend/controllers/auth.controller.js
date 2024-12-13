import User from '../models/User.model.js'
import jwt  from 'jsonwebtoken'
import dotenv from 'dotenv'
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
        res.cookie('token', token, {
            httpOnly : true , 
            maxAge : 3*24*60*60*1000,
            sameSite : "strict",
            secure : process.env.NODE_ENV  === 'production'
             
        }).json({message : 'created succesfully' , user : {
            ...newUser
        }})
    } catch (error) {
        console.log('error occured while signing up '+ error);
    }
}
export const signIn = async (req , res) => {
    try {
        res.send('sign in')        

    } catch (error) {
        console.log('error occured while signing up '+ error);
        
    }
}
export const Logout = async (req , res) => {
    try {
        res.send('logout ')        

    } catch (error) {
        console.log('error occured while signing up '+ error);
        
    }
}