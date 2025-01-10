import mongoose from "mongoose";

const Schema = mongoose.Schema;
const CommentsSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required : true 
    },
    content: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);
const likesSchema = new Schema({
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});
const postSchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content : {
        type : String 
    },
    image: {
      type: String,
    },
    imagePublicId : String , 
    likes: [likesSchema],
    comments: [CommentsSchema],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);


export default Post;