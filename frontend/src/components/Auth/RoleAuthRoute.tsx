import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface RoleAuthProps {
  isAuthenticated: boolean;
  userRoles: string[];
  allowedRoles: string[]; 
  redirectPath?: string;
}

const RoleAuthRoute: React.FC<RoleAuthProps> = ({
  isAuthenticated,
  userRoles,
  allowedRoles,
  redirectPath = "/unauthorized",
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = userRoles.some((role) => allowedRoles.includes(role));

  return hasAccess ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default RoleAuthRoute;