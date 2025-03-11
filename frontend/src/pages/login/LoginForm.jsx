import { useState } from "react";
import {  Eye, EyeOff } from "lucide-react";
import { loginValidation } from "./loginValidation";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/reducers/authReducer";

const LoginForm = () => {
  
  const {register, handleSubmit, formState: {errors, isSubmitting} }= useForm({
    resolver: yupResolver(loginValidation)
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
    
  const handleLogin = async (data) => {
    console.log("Logging Data", data);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
        
      const authData = {
        accessToken: data.accessToken || "dummyAccessToken123",
        refreshToken: data.refreshToken || "dummyRefreshToken456",
        user: {
            username: data.username || "irshad",
            // img: data.img || ""
          }
      }
      dispatch(login(authData))
      console.log("Login Successful!");
      navigate("/dashboard", {replace: true});
      } catch (error) {
        console.error("Login Failed:", error);
      } 
    };

  return(
    <div className="w-full max-w-sm md:max-w-md mx-auto mt-6 px-4 md:px-6">
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="mb-4">
          <input 
          {...register("username")} 
          type="text"
          placeholder="username" 
          className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.username && <p className="text-red-500 text-sm text-left mt-1">{errors.username.message}</p>}
        </div>

        <div className="mb-4">
        <div className="relative">
          <input 
          {...register("password")} 
          type={showPassword ? "text" : "password"}
          placeholder="password"
          className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-black" 
          />
          
          <button
            type="button"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
             <Eye className="w-5 h-5" />
             ) : (
             <EyeOff className="w-5 h-5" />
            )}
          </button>
        </div>
          {errors.password && <p className="text-red-500 text-sm text-left mt-1">{errors.password.message}</p>}
        </div>
        <div className="text-sm text-right">
          <a href="/forgot" className="text-secondary hover:underline">Forgot Password?</a>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-2xl mt-4 transition flex items-center justify-center gap-2 hover:bg-primary-hover
          ${isSubmitting ? "bg-primary cursor-not-allowed" : "bg-primary hover:bg-gray-800 text-white cursor-pointer"}`}
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full ml-2 " />
                Logging...
              </>
            ) : (
              "Login"
            )}
        </button>
      </form>
    </div>
  );
}
export default LoginForm;