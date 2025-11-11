import { useCan } from "@/hooks/useCan";
import { sidebarItems } from "../Sidebar/sidebarItems";

interface SidebarChild {
  path: string;
  label: string;
  module?: string;
  subModule?: string | null;
}

interface SidebarItem {
  path?: string;
  label: string;
  icon?: React.ReactNode;
  module?: string;
  children?: SidebarChild[];
}

/**
 * Returns the first accessible dashboard path based on user permissions.
 */
export const getFirstAccessibleDashboardPath = (): string => {
  const can = useCan();

  for (const item of sidebarItems as SidebarItem[]) {
    if (item.children) {
      for (const child of item.children) {
        const moduleName = child.module ?? item.module;
        if (moduleName && can(moduleName, child.subModule ?? null, "read")) {
          return child.path;
        }
      }
    }

    if (item.path && item.module && can(item.module, null, "read")) {
      return item.path;
    }
  }

  return "/login";
};
