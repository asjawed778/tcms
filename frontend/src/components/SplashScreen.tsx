// import React, { useState } from "react";
// import { Box, Button, Typography, CircularProgress, Fade } from "@mui/material";

// const SplashScreen: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
//   const [loading, setLoading] = useState(false);

//   const handleContinue = () => {
//     setLoading(true);
//     setTimeout(onContinue, 1500); 
//   };

//   return (
//     <Fade in timeout={800}>
//       <Box
//         sx={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100vw",
//           height: "100vh",
//           bgcolor: "background.default",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           zIndex: 9999,
//           textAlign: "center",
//           p: 3,
//         }}
//       >
//         <Typography variant="h4" sx={{ mb: 1, fontWeight: "bold" }}>🚀 MyApp</Typography>
//         <Typography variant="subtitle1" sx={{ mb: 3 }}>Welcome! Let's get started.</Typography>

//         {loading ? (
//           <CircularProgress color="primary" />
//         ) : (
//           <Button variant="contained" onClick={handleContinue}>
//             Continue
//           </Button>
//         )}
//       </Box>
//     </Fade>
//   );
// };

// export default SplashScreen;



import React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import logo from "../assets/logo.png"; // Ensure you have a logo in the `assets` folder

const SplashScreen: React.FC = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main
      }}
    >
      {/* Logo */}
      <img src={logo} alt="Logo" width={120} height={120} style={{ marginBottom: 16 }} />
      
      {/* App Name */}
      <Typography variant="h4">TCMS</Typography>
      
      {/* Loading Indicator */}
      <CircularProgress color="secondary" sx={{ mt: 2 }} />
    </Box>
  );
};

export default SplashScreen;
