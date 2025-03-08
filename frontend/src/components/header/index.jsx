import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-orange-500">My App</h1>
      <div>
        <button 
          className="px-4 py-2 mr-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
        <button 
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Header;