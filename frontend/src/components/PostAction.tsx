import { postActionProps } from "../lib/types"


const PostAction = ({icon , text , onClick}:postActionProps) => {
    return (
		<button className='flex items-center' onClick={onClick}>
			<span className='mr-1'>{icon}</span>
			<span className='hidden sm:inline'>{text}</span>
		</button>
	);
}

export default PostAction