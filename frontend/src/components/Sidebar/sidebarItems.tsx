import { ModuleName } from "@/utils/enum";
import * as Icons from "@mui/icons-material";

export interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: SidebarItem[];
  module: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    module: ModuleName.DASHBOARD,
    icon: <Icons.DashboardOutlined />,
    path: "/dashboard",
  },
  {
    label: "Academics",
    module: ModuleName.ACADEMICS,
    icon: <Icons.SchoolOutlined />,
    path: "/dashboard/academics",
  },
  {
    label: "Students",
    module: ModuleName.STUDENTS,
    icon: <Icons.PersonOutline />,
    path: "/dashboard/student",
  },
  {
    label: "Employee",
    module: ModuleName.Employee,
    icon: <Icons.PeopleOutline />,
    path: "/dashboard/employee",
  },
  {
    label: "Administration",
    module: ModuleName.ADMINISTRATION,
    icon: <Icons.AdminPanelSettingsOutlined />,
    path: "/dashboard/administration",
  },
];
