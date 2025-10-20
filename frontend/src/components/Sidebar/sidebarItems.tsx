import * as Icons from "@mui/icons-material";

export interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: SidebarItem[];
}

export const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: <Icons.Dashboard />,
    path: "/dashboard",
  },
  {
    label: "Faculty",
    icon: <Icons.People />,
    path: "/dashboard/faculty",
  },
  {
    label: "Student",
    icon: <Icons.School />,
    path: "/dashboard/student",
  },
  {
    label: "Classes",
    icon: <Icons.AddBox />,
    path: "/dashboard/classes",
  },
  {
    path: "/dashboard/tools",
    label: "Tools",
    icon: <Icons.Build />,
  },
];
