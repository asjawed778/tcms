import { Navigate, Outlet } from "react-router-dom";
import { RootState, useAppSelector } from "@/store/store"; 
import React from "react";

const PrivateRoute: React.FC = () => {
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
