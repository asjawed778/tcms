import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="ml-60 flex flex-col justify-center items-center h-screen text-gray-700">
      <h1 className="text-4xl font-bold text-orange-500">Welcome to Our Website</h1>
      <p className="text-gray-600 mt-2">Explore our content and enjoy the experience.</p>
      <button 
        className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        onClick={() => navigate("/about")}
      >
        Learn More
      </button>
    </div>
  );
};

export default HomePage;
