import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/store"; 
import React from "react";

const PrivateRoute: React.FC = () => {
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
