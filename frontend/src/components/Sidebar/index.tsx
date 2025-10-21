import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip,
  useMediaQuery,
  IconButton,
  Box,
  Typography,
  DrawerProps,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppTheme } from "@/context/ThemeContext";
import { useAppSelector } from "@/store/store";
import { setMobileOpen, toggleSidebar } from "@/store/reducers/sidebarReducer";
import { sidebarItems } from "./sidebarItems";

const drawerWidth = 200;
const collapsedWidth = 72;
const headerHeight = 32;

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const isMobile = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery(
    "(min-width:600px) and (max-width:1199px)"
  );
  const isLargeScreen = useMediaQuery("(min-width:1200px)");

  const { open, isMobileOpen } = useAppSelector((state) => state.sidebar);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const { colors } = useAppTheme();

  useEffect(() => {
    if (isLargeScreen && !open) {
      dispatch(toggleSidebar());
    } else if (isMediumScreen && open) {
      dispatch(toggleSidebar());
    }
  }, [isLargeScreen, isMediumScreen]);

  useEffect(() => {
    const expanded: Record<string, boolean> = {};
    sidebarItems.forEach(({ label, children }) => {
      if (children?.some((sub) => sub.path === pathname)) {
        expanded[label] = true;
      }
    });
    setOpenMenus(expanded);
  }, [pathname]);

  const handleToggle = () => dispatch(toggleSidebar());

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path);
      if (isMobile) dispatch(setMobileOpen(false));
    },
    [navigate, isMobile, dispatch]
  );

  const isRouteActive = useCallback(
    (path?: string) => pathname === path,
    [pathname]
  );

  const activeStyles = useMemo(
    () => ({
      bgcolor: colors.sidebarActiveBg,
      borderRadius: "8px",
      "& .MuiListItemIcon-root": {
        color: `${colors.sidebarActiveIcon} !important`,
      },
      "& .MuiTypography-root": {
        color: `${colors.sidebarActiveText} !important`,
        fontWeight: 500,
      },
      "&.Mui-selected, &.Mui-selected:hover": {
        bgcolor: colors.sidebarActiveBg,
      },
    }),
    [colors]
  );

  const variant: DrawerProps["variant"] = isMobile ? "temporary" : "permanent";

  const drawerProps: DrawerProps = {
    variant,
    open: isMobile ? isMobileOpen : true,
    onClose: () => dispatch(setMobileOpen(false)),
    ModalProps: { keepMounted: true },
    sx: {
      width: open ? drawerWidth : collapsedWidth,
      "& .MuiDrawer-paper": {
        width: open ? drawerWidth : collapsedWidth,
        backgroundColor: colors.sidebarBg,
        color: colors.primary,
        position: "fixed",
        top: `${headerHeight}px`,
        height: `calc(100vh - ${headerHeight}px)`,
        overflowX: "hidden",
        transition: (theme) =>
          theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
      },
    },
  };

  return (
    <>
      {isMobile && (
        <Box sx={{ p: 1 }}>
          <IconButton onClick={() => dispatch(setMobileOpen(true))}>
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      <Drawer {...drawerProps}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            position: "relative",
          }}
        >
          {!isMobile && (
            <IconButton
              onClick={handleToggle}
              size="small"
              sx={{
                position: "absolute",
                right: "-12px",
                top: "20px",
                zIndex: 2,
                backgroundColor: colors.sidebarBg,
                boxShadow: 2,
              }}
            >
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          )}

          <List sx={{ mt: 1, flexGrow: 1 }}>
            {sidebarItems.map(({ label, icon, path, children }) => {
              const isOpen = openMenus[label];

              if (children) {
                return (
                  <Box key={label}>
                    <Tooltip title={!open ? label : ""} placement="right">
                      <ListItemButton
                        onClick={() =>
                          setOpenMenus((prev) => ({
                            ...prev,
                            [label]: !prev[label],
                          }))
                        }
                        sx={{
                          borderRadius: "8px",
                          fontSize: "0.875rem",
                          color: colors.sidebarText,
                        }}
                      >
                        <ListItemIcon
                          sx={{ color: colors.sidebarText, minWidth: 32 }}
                        >
                          {icon}
                        </ListItemIcon>
                        {open && (
                          <>
                            <ListItemText
                              primary={label}
                              primaryTypographyProps={{
                                fontSize: "16px",
                                fontWeight: 500,
                                color: colors.sidebarText,
                              }}
                            />
                            {isOpen ? (
                              <ExpandLess fontSize="small" />
                            ) : (
                              <ExpandMore fontSize="small" />
                            )}
                          </>
                        )}
                      </ListItemButton>
                    </Tooltip>

                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {children.map(
                          ({
                            label: subLabel,
                            icon: subIcon,
                            path: subPath,
                          }) => (
                            <Tooltip
                              key={subLabel}
                              title={!open ? subLabel : ""}
                              placement="right"
                            >
                              <ListItemButton
                                selected={isRouteActive(subPath)}
                                onClick={() => handleNavigate(subPath!)}
                                sx={{
                                  color: colors.sidebarText,
                                  pl: 4,
                                  borderRadius: "8px",
                                  ...(isRouteActive(subPath)
                                    ? activeStyles
                                    : {}),
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: 32,
                                    color: colors.sidebarText,
                                  }}
                                >
                                  {subIcon}
                                </ListItemIcon>
                                {open && (
                                  <ListItemText
                                    primary={subLabel}
                                    primaryTypographyProps={{
                                      fontSize: "16px",
                                      fontWeight: 500,
                                      color: colors.sidebarText,
                                    }}
                                  />
                                )}
                              </ListItemButton>
                            </Tooltip>
                          )
                        )}
                      </List>
                    </Collapse>
                  </Box>
                );
              }

              return (
                <Tooltip
                  key={label}
                  title={!open ? label : ""}
                  placement="right"
                >
                  <ListItemButton
                    selected={isRouteActive(path)}
                    onClick={() => handleNavigate(path!)}
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: colors.sidebarText,
                      borderRadius: "8px",
                      mx: 1,
                      mt: 1,
                      ...(isRouteActive(path) ? activeStyles : {}),
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>{icon}</ListItemIcon>
                    {open && (
                      <Box sx={{ pl: 1 }}>
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontWeight: 500,
                            color: colors.sidebarText,
                          }}
                        >
                          {label}
                        </Typography>
                      </Box>
                    )}
                  </ListItemButton>
                </Tooltip>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
