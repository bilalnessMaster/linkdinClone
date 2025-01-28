import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import toast from "react-hot-toast"
import axiosInstance from "../lib/axios"
import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { authProps } from "../lib/types"
import PostAction from "./PostAction"
import { formatDistanceToNow } from "date-fns";

const Post = ({post}:{post: any}) => {
    const {data: authUser} = useQuery<authProps>({queryKey : ['authUser']})
	const [isLiked , setIsliked] = useState(post.likes.includes(authUser?._id) ? true : false)
    const [showComments , setShowComments]= useState(false)
    const [newComment , setNewComment] = useState('')
    const [comments , setComments] = useState(post.comments || [])
    const isOwner = authUser?._id === post.author._id;
    const queryClient = useQueryClient();

	const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
		mutationFn: async () => {
			await axiosInstance.delete(`/posts/delete/${post._id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			toast.success("Post deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
    const {mutate :createComment , isPending :isAddingComment  } = useMutation({
        mutationFn : async (newComment:string) =>{
            await axiosInstance.post(`/posts/${post._id}/comment`, { content: newComment })
        },
        onSuccess : () =>{
			// I am gonna use optimistic  updates
            // queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("comment add successfully");
        },
        onError : (error) =>{
            toast.success(error?.message);
        }
    })
    const { mutate: likePost } = useMutation({
		mutationFn: async () => {
			await axiosInstance.post(`/posts/${post._id}/like`);
		},
		onSuccess: () => {
			// I am gonna use optimistic  updates
			// queryClient.invalidateQueries({ queryKey: ["posts"] });
			// queryClient.invalidateQueries({ queryKey: ["post"] });
		},
	});
    const handleDeletePost = () => {
		if (!window.confirm("Are you sure you want to delete this post?")) return;
		deletePost();
	};

	const handleLikePost = async () => {
		if(!isLiked){
			likePost();
			setIsliked(true)
		}else{
			likePost();
			setIsliked(false)
		}
	};
	const handleAddComment = async (e : React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newComment.trim()) {
			createComment(newComment);
			setNewComment("");
			setComments([
				...comments,
				{
					content: newComment,
					user: {
						_id: authUser?._id,
						name: authUser?.name,
						profilePicture: authUser?.profilePicture,
					},
					createdAt: new Date(),
				},
			]);
		}
	};
    return (
<div className='bg-white rounded-lg shadow mb-4'>
			<div className='p-4'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center'>
						<Link to={`/profile/${post?.author?.username}`}>
							<img
								src={post.author.profilePicture || "/avatar.png"}
								alt={post.author.name}
								className='size-10 rounded-full mr-3'
							/>
						</Link>

						<div>
							<Link to={`/profile/${post?.author?.username}`}>
								<h3 className='font-semibold'>{post.author.name}</h3>
							</Link>
							<p className='text-xs text-info'>{post.author.headline}</p>
							<p className='text-xs text-info'>
								{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
							</p>
						</div>
					</div>
					{isOwner && (
						<button onClick={handleDeletePost} className='text-red-500 hover:text-red-700'>
							{isDeletingPost ? <Loader size={18} className='animate-spin' /> : <Trash2 size={18} />}
						</button>
					)}
				</div>
				<p className='mb-4'>{post.content}</p>
				{post.image && <img src={post.image} alt='Post content' className='rounded-lg w-full mb-4' />}

				<div className='flex justify-between text-info'>
					<PostAction
						icon={<ThumbsUp size={18} className={isLiked ? "text-blue-500  fill-blue-300" : ""} />}
						text={`Like (${post.likes.length})`}
						onClick={handleLikePost}
					/>

					<PostAction
						icon={<MessageCircle size={18} />}
						text={`Comment (${comments.length})`}
						onClick={() => setShowComments(!showComments)}
					/>
					<PostAction icon={<Share2 size={18} />} text='Share' />
				</div>
			</div>

			{showComments && (
				<div className='px-4 pb-4'>
					<div className='mb-4 max-h-60 overflow-y-auto'>
						{comments.map((comment : any) => (
							<div key={comment._id} className='mb-2 bg-gray-100 p-2 rounded flex items-start'>
								<img
									src={comment.user.profilePicture || "/avatar.png"}
									alt={comment.user.name}
									className='w-8 h-8 rounded-full mr-2 flex-shrink-0'
								/>
								<div className='flex-grow'>
									<div className='flex items-center mb-1'>
										<span className='font-semibold mr-2'>{comment.user.name}</span>
										<span className='text-xs text-info'>
											{formatDistanceToNow(new Date(comment.createdAt))}
										</span>
									</div>
									<p>{comment.content}</p>
								</div>
							</div>
						))}
					</div>

					<form onSubmit={handleAddComment} className='flex items-center'>
						<input
							type='text'
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder='Add a comment...'
							className='flex-grow p-2 rounded-l-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary'
						/>

						<button
							type='submit'
							className='bg-primary text-white p-2 rounded-r-full hover:bg-primary-dark transition duration-300'
							disabled={isAddingComment}
						>
							{isAddingComment ? <Loader size={18} className='animate-spin' /> : <Send size={18} />}
						</button>
					</form>
				</div>
			)}
		</div>
    )
}

export default Post