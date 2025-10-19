import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CustomButton from "@/components/CustomButton";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
      bgcolor="background.default"
    >
      <Stack
        spacing={3}
        textAlign="center"
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <SentimentDissatisfiedIcon
            sx={{ fontSize: 120, color: "error.main" }}
          />
        </motion.div>

        <Typography
          sx={{
            fontSize: {
              xs: 32,
              md: 36,
              lg: 40,
            },
            fontWeight: 600,
          }}
        >
          404 - Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary">
          It looks like the page you're trying to reach doesn't exist or was
          moved. Let’s get you back on track!
        </Typography>

        <Box display="flex" justifyContent="center">
          <CustomButton
            label="Back to Home"
            sx={{
              borderRadius: "999px",
            }}
            onClick={() => navigate("/")}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default PageNotFound;
