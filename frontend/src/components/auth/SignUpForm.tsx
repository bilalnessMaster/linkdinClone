import { useMutation } from "@tanstack/react-query";
import axios from "../../lib/axios.tsx";
import { useState } from "react";
import toast from "react-hot-toast";
import {Loader} from 'lucide-react'
interface UserType {
  name: string;
  email: string;
  password: string;
  username: string;
}
const SignUpForm = () => {
  const [userData, setUserData] = useState<UserType>({
    name: "",
    email: "",
    password: "",
    username: "",
  });
  const { mutate: signUpMutation, isPending } = useMutation<any, Error & { response?: any }, UserType>({
    mutationFn: async (data: UserType) => {
      const response = await axios.post("/auth/signup", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
    },
    onError: (error) => {
        const message = error?.response?.data?.message || "something went wrong"
      toast.error(message);
    },
  });
  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUpMutation(userData);
  };
  return (
    <form onSubmit={handleSignUp} className="space-y-2">
      {/* name  */}
      <label
        htmlFor="name"
        className="flex flex-col items-start justify-start gap-1"
      >
        <span className="font-medium">Name</span>
        <input
          className="input bg-gray-300/15 input-bordered w-full"
          type="text"
          name="name"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          id="name"
          placeholder="Entre you name "
        />
      </label>
      {/* username   */}
      <label
        htmlFor="username"
        className="flex flex-col items-start justify-start gap-1"
      >
        <span className="font-medium">Username</span>
        <input
          className="input bg-gray-300/15 input-bordered w-full"
          type="text"
          name="username"
          value={userData.username}
          onChange={(e) =>
            setUserData({ ...userData, username: e.target.value })
          }
          id="username"
          placeholder="Entre you username "
        />
      </label>
      {/* email */}
      <label
        htmlFor="email"
        className="flex flex-col items-start justify-start gap-1"
      >
        <span className="font-medium">Email</span>
        <input
          className="input bg-gray-300/15  input-bordered w-full"
          type="email"
          name="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          id="email"
          placeholder="Example@gmail.com "
        />
      </label>
      {/* password  */}
      <label
        htmlFor="password"
        className=" label flex flex-col items-start justify-start gap-1"
      >
        <span className="font-medium">password</span>
        <input
          className="input  bg-gray-300/15 input-bordered w-full "
          type="password"
          name="password"
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
          id="password"
          placeholder="********"
        />
      </label>
      <button disabled={isPending} type="submit" className="btn btn-primary w-full text-white">
        {isPending ? (
          <Loader className="size-5 animate-spin" />
        ) : (
          "Agree & Join"
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
