import React from "react";
import { Navigate } from "react-router-dom";
import { getFirstAccessibleDashboardPath } from "@/components/GetFirstAccessibleDashboardPath";
import { useCan } from "@/hooks/useCan";
import { ModuleName } from "@/utils/enum";
import Dashboard from "@/pages/Dashboard";

const DashboardRedirect: React.FC = () => {
  const can = useCan();
  const hasDashboardAccess = can(ModuleName.DASHBOARD, null, "read");

  if (hasDashboardAccess) {
    return <Dashboard />;
  }

  const path: string = getFirstAccessibleDashboardPath();

  if (!path) {
    // return <Navigate to="/not-authorized" replace />;
    return <Navigate to="/auth" replace />;
  }

  return <Navigate to={path} replace />;
};

export default DashboardRedirect;
