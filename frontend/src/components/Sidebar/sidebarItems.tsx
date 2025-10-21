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
    icon: <Icons.Dashboard />,
    path: "/dashboard",
  },
  {
    label: "Faculty",
    module: ModuleName.Employee,
    icon: <Icons.People />,
    path: "/dashboard/faculty",
  },
  {
    label: "Students",
    module: ModuleName.STUDENTS,
    icon: <Icons.Person />,
    path: "/dashboard/student",
  },
  {
  label: "Academics",
  module: ModuleName.CLASSES,
  icon: <Icons.School />,
  path: "/dashboard/academics",
},
  {
    label: "Administrator",
    module: ModuleName.TOOLS,
    icon: <Icons.AdminPanelSettings />,
    path: "/dashboard/administrator",
},
];
