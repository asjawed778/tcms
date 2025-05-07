import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      textAlign="center"
    >
      <ErrorOutlineIcon sx={{ fontSize: 64, color: "orange" }} />
      <Typography variant="h4" fontWeight="bold" mt={2}>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" mt={1}>
        Sorry, the page you are looking for does not exist.
      </Typography>
      <Button
        variant="contained"
        color="warning"
        sx={{ mt: 3, px: 3 }}
        onClick={() => navigate("/")}
      >
        Go to Homepage
      </Button>
    </Box>
  );
};

export default PageNotFound;
