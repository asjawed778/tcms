import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface OperationPermissions {
  [operation: string]: boolean;
}

interface SubModule {
  name: string;
  operations: OperationPermissions;
}

interface ModulePermission {
  name: string;
  operations: OperationPermissions;
  subModules?: SubModule[];
}

interface Role {
  permissions: ModulePermission[];
}

interface User {
  role?: Role;
}

export const useCan = () => {
  const currentUser = useSelector((state: RootState) => state.auth?.user) as User | null;

  return (module: string, subModule?: string | null, operation?: string): boolean => {
    if (!currentUser?.role?.permissions) return false;

    const modulePerm = currentUser.role.permissions.find(
      (p) => p.name === module
    );
    if (!modulePerm) return false;

    const operations = subModule
      ? modulePerm.subModules?.find((s) => s.name === subModule)?.operations
      : modulePerm.operations;

    return Boolean(operation && operations?.[operation]);
  };
};
