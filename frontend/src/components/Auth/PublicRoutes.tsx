import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { RootState, useAppSelector } from "@/store/store"; 
interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const accessToken = useAppSelector((state: RootState) => state.auth.accessToken);

  if (!accessToken) {
    return <>{children}</>;
  }

  return <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
