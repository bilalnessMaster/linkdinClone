import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
const RecommendedUser = ({user} : {user:any}) => {
  const queryClient = useQueryClient()
  const {data:authUser} = useQuery({queryKey : ['authUser']})
  const {data:status , isError} = useQuery({
    queryKey : ['status',user._id] , 
    queryFn : async () => { 
      const {data}= await axiosInstance.get(`/connections/status/${user._id}`)
      return data
      
    }, 
  
  })
  console.log(isError);
  
  const {mutate :sendConnectionRequest} = useMutation({
    mutationFn : async () => {
      await axiosInstance.post(`connections/request/${user._id}`)
    },
    onSuccess : () =>{
      console.log('suucessfully sent');
      queryClient.invalidateQueries({queryKey : ['status',user._id]})
    },
    onError: (error : Error & { response : any}) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
  })
  
	const { mutate: acceptRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request accepted");
			queryClient.invalidateQueries({ queryKey: ["status", user._id] });
		},
		onError: (error : Error & { response : any}) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
	});

	const { mutate: rejectRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request rejected");
			queryClient.invalidateQueries({ queryKey: ["status", user._id] });
		},
		onError: (error : Error & { response : any}) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
	});
  console.log(status?.requestId);
  
  const RenderButton = () => {
    const etat = status?.message
    switch(etat){
      case 'pending' : 
            return <button disabled className="btn btn-info">Pending</button>
      case 'received' : 
       return (
        <div className="flex gap-1">
          <button onClick={()=>acceptRequest(status.requestId)} className="btn btn-primary text-sm">accepte</button>
          <button onClick={()=>rejectRequest()} className="btn btn-error">reject</button>
        </div>
       )
       case 'connected' :
        return <button disabled className="btn bnt-info">connected</button>
       default : 
       return <button onClick={()=>sendConnectionRequest()} className="btn btn-primary">Connect</button>
    }
  }
  return (
    <div className="flex justify-between items-center">
      <div className="h-12 ">
          <Link to={`/profile/${user?.username}`} className="flex gap-1 capitalize items-center">
            <img src={user?.profilePicture || "/avatar.png"} className="object-cover  h-8" alt="" />
            <div>
              <p className="text-sm">@{user.username}</p>
              <p className="text-xs">linkdi user</p>
            </div>
          </Link>
        </div>
      {RenderButton()}
    </div>
  )
}

export default RecommendedUser