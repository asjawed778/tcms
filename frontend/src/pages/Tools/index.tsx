import GenericTabs from "@/components/GenericTabs";
import { useCan } from "@/hooks/useCan";
import { ModuleName, Operation, SubModuleName, ToolsTabs } from "@/utils/enum";
import RolesAndPermission from "./RolesAndPermissions";

function Tools() {
  const can = useCan();

  const allTabs = [
    {
      label: "Roles & Permissions",
      value: ToolsTabs.ROLES_AND_PERMISSIONS,
      component: <RolesAndPermission />,
      permission: {
        module: ModuleName.ADMINISTRATION,        
        subModule: SubModuleName.ROLES,  
        action: Operation.READ,           
      },
    },
  ];

  const tabs = allTabs.filter((tab) =>
    can(tab.permission.module, tab.permission.subModule, tab.permission.action)
  );

  return <GenericTabs tabs={tabs} defaultTab={tabs[0]?.value} />;
}

export default Tools;
