
import { CommentNotificationHanlder } from "../emails/emailHandlers.js";
import Notification from "../models/Notification.model.js";
import Post from "../models/Post.model.js";

export const createPost = async (req, res) => {
  try {
    let result = null;
    const { content, image, author } = req.body;
    if (image) {
      result = await uploadMedia(image, "posts");
    }
    const post = new Post({
      content,
      author: req.user._id,
      image: result?.secure_url,
      imagePublicId: result?.public_id,
      likes: [],
      comments: [],
    });
    await post.save();
    res.json({
      success: true,
      message: "post created successfuly",
    });
  } catch (error) {
    console.log("error happend while creating post " + error);
    return res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: { $in: req.user.connections } })
      .populate("author", ["usename", "profilePictur", "name"])
      .populate("comments.user", ["profilePictur", "name"])
      .populate("likes", ["name"])
      .sort({ createdAt: -1 });
    res.status(200).json({
      succes: true,
      message: "fecth posts",
      posts,
    });
  } catch (error) {
    console.log("error happend while creating post " + error);
    return res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    let userId = req.user._id;
    const post = await Post.findById(id);
    if (!post)
      return res.status(404).json({
        success: false,
        message: "post not found",
      });
    if (userId.toString() !== post.author.toString()) {
      return res.status(403).json({
        success: false,
        message: "you are not authorize to delete this post",
      });
    }
    if(post.image){
        const result = await deleteMedia(post.imagePublicId);

    }
    await Post.findByIdAndDelete(post._id)
    res.status(200).json({
      success: true,
      message: "deleted successfully",
    });
  } catch (error) {
    console.log("error happend while delete post post " + error);
    return res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};


export const getPostById = async (req , res) =>{
  try {
    const {id}= req.params 
    const post = await Post.findById(id)
    .populate('author' , 'name  username profilePicture headline')
    .populate('comments.user' , 'name profilePicture username headline')
    if(!post) return   res.status(404).json({
      success : false ,
      message : "post does not found",
    })
    res.stats(200).json({
      success : true ,
      message : "fetch post by id",
      post
    })
  } catch (error) {
    console.log("error happend while getting post " + error);
    return res.status(500).json({
      message: "server error",
      success: false,
    });
  }
 }
export const addComments  =  async (req , res) => {
    try {
      const {id} = req.params
      const {content } = req.body
      const userId = req.user._id
      const post = await Post.findByIdAndUpdate(id,{
        $push : {
          comments : 
            {
              user : userId ,
              content
            }
          
        
        }
      },{new : true}) 
      .populate('author' , 'name  username profilePicture headline')
      .populate('comments.user' , 'name profilePicture username headline')
      if(!post){
        return res.status(404).json({
          success : false ,
          message : "post does not found",
        })
      }

      if(userId.toString() !== post.author._id.toString()){
            const notify =  new Notification({
              recipient : post.author._id , 
              type : 'comment' , 
              relatedUser : userId , 
              relatedPost  : id , 
            })
            await notify.save()
            // send email to recipient using trapmail
            try {
              const postUrl = process.env.CLIENT_URL + '/post/'+id
              await CommentNotificationHanlder(post.author.email,post.author.name,user.req.name, postUrl , content)
            } catch (error) {
              console.log("error happend while sending email to user " + error);
             
            }
      }
      return res.status(200).json({
        message: "add comment to post",
        success: true,
       
      });
    } catch (error) {
      console.log("error happend while adding comments " + error);
      res.status(500).json({
        message: "server error",
        success: false,
      });
    }

  
}

export const likePost = async( req, res) =>{
      try {
          const  {id}= req.params 
          const userId= req.user._id
          const post = await Post.findById(id)
          if(post.likes.includes(userId)){
            post.likes = post.likes.filter(user=> user.toString()  !== userId.toString()  )
          }else{
            post.likes.push(
              userId
            )
            if(userId.toString() !== post.author){
              const notify = new Notification({
                 recipient : post.author , 
                 type: 'like' , 
                 relatedUser : userId,
                 relatedPost : post._id
              })
              await notify.save()
            }
  
          }
          await post.save()
          res.status(200).json({
            success : true , 
            message : 'liked the post',

          })
      } catch (error) {
        console.log("error happend while liking a post " + error);
        res.status(500).json({
          message: "server error",
          success: false,
        });
      }
}