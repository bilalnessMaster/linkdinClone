import { useMutation, useQueryClient } from "@tanstack/react-query";
import {useState } from "react";
import axios from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { SignInProps } from "../../lib/types";
const SignInForm = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SignInProps>({
    username: "",
    password: "",
  });
  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    setForm({ ...form, [name]: value });
  };
  const { mutate: signIn, isPending } = useMutation({
    mutationKey: ["signIn"],
    mutationFn: async (form: SignInProps) =>
      await axios.post("auth/signin", form),
    onSuccess: () => {
      toast.success("login successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(form);
  };
  return (
    <form onChange={handleFormChange} onSubmit={handleSubmit}>
      <label
        htmlFor="username"
        className="flex flex-col items-start justify-start gap-1"
      >
        <span className="font-medium">Username</span>
        <input
          className="input bg-gray-300/15 input-bordered w-full"
          type="text"
          name="username"
          id="username"
          placeholder="Entre you username "
          autoComplete="username"
        />
      </label>
      <label
        htmlFor="password"
        className=" label flex flex-col items-start justify-start gap-1"
      >
        <span className="font-medium">password</span>
        <input
          className="input  bg-gray-300/15 input-bordered w-full "
          type="password"
          name="password"
          id="password"
          placeholder="********"
          autoComplete="current-password"
        />
      </label>
      <button type="submit" className="btn btn-primary w-full">
        {isPending ? <Loader className="animate-spin" /> : "Log in "}
      </button>
    </form>
  );
};

export default SignInForm;
