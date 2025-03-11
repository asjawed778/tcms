import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"
import { useSelector } from "react-redux";
const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="fixed top-0 left-0 w-full  flex  px-6 h-16 justify-between items-center bg-white shadow-md z-50">
      <div className="flex items-center space-x-3 text-primary">
        <img src={logo} alt="Logo"  className="h-10 w-auto"/>
        <h1 className=" text-4xl font-bold cursor-pointer" onClick={() => navigate("/")}>TCMS</h1>
      </div>
      <div className="flex space-x-2">
        {user ? (
          <div className="text-secondary">{user.username || "Guest"}</div>
        ) : (<button 
          className="btn-primary cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login
        </button>)}
      </div>
    </div>
  );
};
export default Header;