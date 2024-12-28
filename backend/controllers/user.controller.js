import User from "../models/User.model.js";


export const getSuggestedConnection = async (req , res) => { 
    try {
        const  currentUser = await User.findById(req.user._id).select("connection")
        const suggestionUser = await User.find({
            _id: {
                $ne : req.user._id , $nin : currentUser.connections
            }
        }).select("name username profilePicture headline").limit(3)
        res.status(200).json({
            suggestion : suggestionUser
        })
    } catch (error) {
        console.log('error occured while getSuggestedConnection  '+ error);
    }
}

export const getPublicProfile = async (req ,res)=> { 
        try {
            const {username} = req.params
            const user = await User.findOne({
                username 
            }).select("-password")
            if (!user) return res.status(404),jsob({messsage : "user not found "})
            res.status(200).json({
                profile : user
            })
        } catch (error) {
            console.log('error occured while getPublicProfile  '+ error);
        }
}

export const updateProfile = async (req ,res) => { 
    try {
        const  payload = req.body
        let updateData = {}
        const allowedUpdate =[
            'name' , 
            "headline ",
            'about',
            'location' , 
            'profilePicture' , 
            'bannerImg' , 
            'skills' ,
            'exprience' , 
            'education'
        ] 
        for(const key of allowedUpdate){
            if(payload[key]) updateData[key] = payload[key]
        }
        // before  update data we most upload img to cloud storage and profile ing and banner

        const user = await User.findByIdAndUpdate(req.user._id , updateData , {new : true})
    } catch (error) {
        console.log('error occured while getPublicProfile  '+ error);
    }
}