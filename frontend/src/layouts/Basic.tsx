import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Basic: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
    <Header />
    <Sidebar />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar /> 
      <Outlet />
    </Box>
  </Box>
  );
}
export default Basic;