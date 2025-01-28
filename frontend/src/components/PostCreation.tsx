import { useState } from "react";
import { authProps } from "../lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader } from "lucide-react";
const PostCreation = ({ user }: { user: authProps }) => {
  const [Post, setPost] = useState({
    content: "",
    image: "",
  });
  const [imagePreview, setpreview] = useState<string | null>("");
  const queryClient = useQueryClient();
  const { mutate: Create, isPending } = useMutation({
    mutationKey: ["Create"],
    mutationFn: async (Post: any) => await axios.post("posts/create", Post),
    onSuccess: () => {
      setPost({
        content: "",
        image: "",
      });
      setpreview(null);
      queryClient.invalidateQueries({queryKey : ['posts']})
      toast.success("post created successfully");
    },
    onError: () => {
      toast.error("faild");
    },
  });
  const postCreation = () => {
    try {
      if (Post.content !== "") {
        Create(Post);
      } else {
        toast.error("you have to write something");
      }
    } catch (error) {
      console.error("erro hanppened in post creation " + error);
    }
  };
  const handleImageChange = (e: any) => {
    let file = e.target.files[0];
    if (file) {
      readerFileAsDataURL(file).then((res: any) => {
        setpreview(res.toString());
        setPost({
          ...Post,
          image: res.toString(),
        });
      });
    } else {
      setpreview(null);
    }
  };
  const readerFileAsDataURL = (file: File) => {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = reject;
      fileReader.readAsDataURL(file);
    });
  };


  return (
    <div className="bg-white rounded-lg shadow mb-4 p-4">
      <div className="flex space-x-3">
        <img
          src={user?.profilePicture || "/avatar.png"}
          alt={user?.name}
          className="size-12 rounded-full"
        />
        <textarea
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg bg-base-200 hover:bg-base-200  focus:outline-none resize-none transition-colors duration-200 min-h-[100px]"
          value={Post.content}
          onChange={(e) => setPost({ ...Post, content: e.target.value })}
        />
      </div>

      {imagePreview && (
        <div className="mt-4">
          <img
            src={imagePreview}
            alt="Selected"
            className="w-32  h-auto rounded-lg"
          />
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-4">
          <label className="flex items-center  hover:text-info-dark transition-colors duration-200 cursor-pointer">
            <Image size={20} className="mr-2" />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <button
          className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200"
          onClick={postCreation}
          disabled={isPending}
        >
          {isPending ? <Loader className="size-5 animate-spin" /> : "Share"}
        </button>
      </div>
    </div>
  );
};

export default PostCreation;
