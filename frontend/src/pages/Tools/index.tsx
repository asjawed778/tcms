import GenericTabs from "@/components/GenericTabs";
import { ToolsTabs } from "@/utils/enum";
import RolesAndPermission from "./RolesAndPermissions";

function Tools() {
  const tabs = [
    {
      label: "Roles & Permissions",
      value: ToolsTabs.ROLES_AND_PERMISSIONS,
      component: <RolesAndPermission />,
    },
  ];

  return <GenericTabs tabs={tabs} defaultTab={tabs[0]?.value} />;
}

export default Tools;
