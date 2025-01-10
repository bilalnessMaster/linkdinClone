import mongoose from "mongoose";
const Schema = mongoose.Schema;
const connectionRequestSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status : {
    type : String , 
    enum : ['pending', 'accepted' , 'rejected'] , 
    default : "pending"
  },
  
},{timestamps:true});


const  ConnectionRequest = mongoose.model('connectionRequest' , connectionRequestSchema)


export default ConnectionRequest  ;