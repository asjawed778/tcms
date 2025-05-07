import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useAppTheme } from "@/context/ThemeContext";

interface LoaderProps {
  fullscreen?: boolean;
  size?: number;
  thickness?: number;
}

const Loader: React.FC<LoaderProps> = ({ fullscreen = false, size = 40, thickness = 4 }) => {
  const { colors } = useAppTheme();
  
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height={fullscreen ? "100vh" : "100%"}
      bgcolor={fullscreen ? colors.background : "transparent"}
      aria-label="Loading spinner"
      role="status"
    >
      <CircularProgress
        color="success"
        size={size}
        thickness={thickness}
        sx={{
          color: colors.primary, 
        }}
      />
    </Box>
  );
};

export default Loader;
