import React from "react";
import { Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h3" color="warning.main" fontWeight="bold" gutterBottom>
        Welcome to Our Website
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Explore our content and enjoy the experience.
      </Typography>

      <Button
        variant="contained"
        color="warning"
        size="large"
        onClick={() => navigate("/about")}
        sx={{ borderRadius: 2, px: 4 }}
      >
        Learn More
      </Button>
    </Container>
  );
};

export default HomePage;
