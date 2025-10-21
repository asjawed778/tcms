import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { useAppTheme } from "@/context/ThemeContext"; 

const DashboardLayout: React.FC = () => {
  const { colors } = useAppTheme(); 
  // const location = useLocation();
  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column">
        <Header />
        {/* <Toolbar sx={{ mt: { xs: 0, lg: 0 } }} /> */}
        <Box
          component="main"
          flexGrow={1}
          // p={2}
          overflow="auto" 
          bgcolor={colors.background } 
          // bgcolor="#ccc" 
          color={colors.text}
          mt={7}    
        >
          {/* <CustomAnimatedDiv key={location.pathname} animationType="zoom"> */}
            <Outlet />
          {/* </CustomAnimatedDiv> */}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
