import {  Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import SignUpPage from "./pages/auth/SignUpPage";
import SignInPage from "./pages/auth/SignInPage";
import HomePage from "./pages/HomePage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "./lib/axios";
import { Loader } from "lucide-react";
import { authProps } from "./lib/types";

const App = () => {
  const {data : authUser , isLoading } = useQuery<authProps>({
    queryKey : ['authUser'] , 
    queryFn : async () => {
        try {
            const res= await axios.get('/auth/me')
            return res.data
        } catch (error : any) {
          if(error?.response && error?.response.status === 401){
            return null
          }
          toast.error(error?.reponse?.data?.message || 'something went wrong')
        }
    }
  })
  if(isLoading) return <Loader  className="animate-spin"/>
  return (
    <Layout>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> :  <Navigate to={'/signin'}/> } />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={'/'}/>} />
        <Route path="/signin" element={!authUser ? <SignInPage /> : <Navigate to={'/'}/>} />
      </Routes>
      <Toaster />
    </Layout>
  );
};

export default App;
