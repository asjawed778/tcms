import { useCan } from "@/hooks/useCan";
import { ModuleName, Operation, SubModuleName, ToolsTabs } from "@/utils/enum";
import { Badge } from "@mui/material";
import RolesAndPermissions from "./RolesAndPermissionTab";
import SegmentTabs from "@/components/ui/SegmentTabs";

function Administration() {
  const can = useCan();

  const allTabs = [
    {
      label: "Roles & Permissions",
      value: ToolsTabs.ROLES_AND_PERMISSIONS,
      icon: <Badge />,
      component: <RolesAndPermissions />,
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

  return <SegmentTabs tabs={tabs} defaultTab={tabs[0]?.value} tabContainerSx={{bgcolor: "#fff", px: 2}} />;
}

export default Administration;
