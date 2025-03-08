import React from "react";
import { BiError } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen text-gray-700">
      <BiError className="text-orange-500 text-6xl mb-4" />
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <p className="text-gray-500">Sorry, the page you are looking for does not exist.</p>
      <button 
        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        onClick={() => navigate("/")}
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default PageNotFound;
