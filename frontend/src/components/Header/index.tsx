import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { toggleCollapsed, toggleMobile } from "../../store/reducers/sidebarReducer";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useAppTheme } from "@/context/ThemeContext";
import SessionDropdown from "../Sessions";
import ToggleThemeSwitch from "./ToggleThemeSwitch";
import { Close } from "@mui/icons-material";
import Profile from "./Profile";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { colors } = useAppTheme(); 
  const user = useAppSelector((state) => state.auth);
  const sidebar = useAppSelector((state) => state.sidebar)

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    // const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  

  const handleMenuBtn = () => {
    if (isSmallScreen) {
      dispatch(toggleMobile());
    } else {
      dispatch(toggleCollapsed());
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        backgroundColor: colors.headerBackground,
        color: colors.headerText,
        zIndex: 1300,
        height: 64,
        justifyContent: "center",
        
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: "64px !important" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={logo} alt="Logo" sx={{ width: 36, height: 36 }} />
          <Typography
            variant="h6"
            sx={{
              cursor: "pointer",
              fontWeight: 800,
            }}
            onClick={() => navigate("/")}
          >
            TCMS
          </Typography>
          <IconButton
            edge="start"
            onClick={handleMenuBtn}
            sx={{
              color: colors.headerText,
              zIndex: 1400,ml: isSmallScreen ? 2 : 7,
            }}
          >
          {isSmallScreen && sidebar.mobileOpen ? <Close /> : <MenuIcon />}
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          
          <SessionDropdown />
          <ToggleThemeSwitch />
          {user.isAuthenticated ? (
            <Profile />
          ) : (
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                color: colors.buttonSecondaryText,
                borderColor: colors.inputBorder,
                "&:hover": {
                  borderColor: colors.text,
                  backgroundColor: colors.primary,
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;


