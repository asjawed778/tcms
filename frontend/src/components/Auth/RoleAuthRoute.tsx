import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { RootState, useAppSelector } from "@/store/store";
import { useCan } from "@/hooks/useCan";

interface Permission {
  module: string;
  subModule?: string | null;
  operation: string;
}

interface RoleAuthRouteProps {
  children: ReactNode;
  permissions?: Permission[];
}

const RoleAuthRoute: React.FC<RoleAuthRouteProps> = ({
  children,
  permissions = [],
}) => {
  const { accessToken, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const can = useCan();

  if (!accessToken || isAuthenticated) return <Navigate to="/auth" replace />;

  for (const perm of permissions) {
    const { module, subModule = null, operation } = perm;
    if (!can(module, subModule, operation)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default RoleAuthRoute;
