import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Popover,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { menuItems } from "./menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useState } from "react";

interface MenuItemsProps {
  collapsed: boolean;
  onItemClick?: () => void;
}

const MenuItems = ({ collapsed, onItemClick }: MenuItemsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [hoverAnchor, setHoverAnchor] = useState<HTMLElement | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<any>(null);

  const handleToggle = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleNavigate = (path?: string) => {
    if (path) {
      navigate(path);
      onItemClick?.();
    }
  };

  return (
    <>
      <List disablePadding sx={{ transition: "all 0.3s ease", mt: 2}}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = location.pathname === item.path;

          const handleClick = () => {
            if (collapsed) {
              if (!item.children) {
                handleNavigate(item.path);
                setHoveredMenu(null);
                setHoverAnchor(null);
              }
              return;
            }

            item.children
              ? handleToggle(item.title)
              : handleNavigate(item.path);
          };

          const listItem = (
            <ListItemButton
              key={item.id}
              onClick={handleClick}
              onMouseEnter={(e) => {
                if (collapsed) {
                  setHoveredMenu(item);
                  setHoverAnchor(e.currentTarget);
                }
              }}
              onMouseLeave={() => {
                if (collapsed) {
                  setTimeout(() => {
                    setHoveredMenu(null);
                    setHoverAnchor(null);
                  }, 300);
                }
              }}
              selected={isSelected}
              sx={{
                justifyContent: collapsed ? "center" : "flex-start",
                px: collapsed ? 2 : 3,
                transition: "all 0.3s ease",
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2 }}>
                <Icon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.title} />}
              {!collapsed &&
                item.children &&
                (openMenus[item.title] ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          );

          return (
            <Box key={item.id}>
              {listItem}
              {!collapsed && item.children && (
                <Collapse
                  in={openMenus[item.title]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List disablePadding sx={{ pl: 4 }}>
                    {item.children.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubSelected = location.pathname === sub.path;
                      return (
                        <ListItemButton
                          key={sub.id}
                          onClick={() => handleNavigate(sub.path)}
                          selected={isSubSelected}
                          sx={{ pl: 4 }}
                        >
                          <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                            <SubIcon />
                          </ListItemIcon>
                          <ListItemText primary={sub.title} />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>

      <Popover
        open={!!hoverAnchor && !!hoveredMenu}
        anchorEl={hoverAnchor}
        onClose={() => {
          setHoveredMenu(null);
          setHoverAnchor(null);
        }}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        PaperProps={{
          sx: {
            p: 1,
            minWidth: 180,
            pointerEvents: "auto",
          },
        }}
        disableRestoreFocus
      >
        {hoveredMenu?.children ? (
          hoveredMenu.children.map((sub: any) => {
            const SubIcon = sub.icon;
            const isSubSelected = location.pathname === sub.path;

            return (
              <ListItemButton
                key={sub.id}
                onClick={() => {
                  handleNavigate(sub.path);
                  setHoveredMenu(null);
                  setHoverAnchor(null);
                }}
                selected={isSubSelected}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                  <SubIcon />
                </ListItemIcon>
                <ListItemText primary={sub.title} />
              </ListItemButton>
            );
          })
        ) : (
          <Typography px={2} py={1}>
            {hoveredMenu?.title}
          </Typography>
        )}
      </Popover>
    </>
  );
};

export default MenuItems;
