import { Box, Typography } from "@mui/material";
import { HourglassEmpty } from "@mui/icons-material";

const ComingSoon = ({
  title = "Coming Soon...",
  message = "This feature is under development.",
}) => {
  return (
    <Box
      sx={{
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <HourglassEmpty
        sx={{
          fontSize: 60,
          color: "secondary.main",
          mb: 2,
        }}
      />

      <Typography variant="h5" fontWeight={600} color="secondary">
        {title}
      </Typography>

      <Typography mt={1} color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default ComingSoon;
