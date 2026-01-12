import { Box, CircularProgress, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import { CircularProgressProps } from "@mui/material/CircularProgress";
import { ReactNode } from "react";

type LoaderProps = {
  height?: string | number;
  size?: number | string;
  text?: ReactNode;
  color?: CircularProgressProps["color"];
  spinnerSx?: SxProps<Theme>;
  textSx?: SxProps<Theme>;
};

const Loader = ({
  height = "60vh",
  size = 36,
  text,
  color = "primary",
  spinnerSx,
  textSx,
}: LoaderProps) => {
  return (
    <Box
      sx={{
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <CircularProgress
        size={typeof size === "number" ? size : undefined}
        color={color}
        sx={{
          ...(typeof size === "string" && {
            width: size,
            height: size,
          }),
          ...spinnerSx,
        }}
      />

      {text && (
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 14,
            ...textSx,
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;
