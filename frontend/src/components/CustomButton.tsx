import React, { ReactNode, MouseEventHandler } from "react";
import {
  styled,
  Box,
  CircularProgress,
  Button as MuiButton,
  ButtonProps,
  SxProps,
  Theme,
  useTheme,
} from "@mui/material";

const StyledButton = styled(MuiButton)(({ theme }) => ({
  fontSize: "14px",
  padding: theme.spacing("6px", "10px"),
  borderRadius: 8,
  minWidth: theme.spacing(9),
  textTransform: "none",
  whiteSpace: "nowrap",
  flexShrink: 0,
  transition: "all 0.2s ease-in-out",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
}));

interface CustomButtonProps extends Omit<ButtonProps, "startIcon" | "endIcon"> {
  label?: string;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  sx?: SxProps<Theme>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
  children?: ReactNode;
}

const SPINNER_SIZES = { small: 16, medium: 24, large: 32 };

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  children,
  onClick,
  type = "button",
  variant = "contained",
  color = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  ariaLabel,
  sx = {},
  ...rest
}) => {
  const isDisabled = disabled || loading;
  const theme = useTheme();
  const spinnerSize = SPINNER_SIZES[size] || 24;

  return (
    <Box
      sx={{
        display: "inline-block",
        width: fullWidth ? "100%" : "auto",
        cursor: isDisabled ? "not-allowed" : "pointer",
      }}
    >
      <StyledButton
        type={type}
        variant={variant}
        color={color}
        size={size}
        disabled={isDisabled}
        fullWidth={fullWidth}
        onClick={onClick}
        aria-busy={loading}
        aria-label={ariaLabel || label}
        sx={{
          color:
            variant === "contained" ? theme.palette.common.white : undefined,
          ...sx,
        }}
        {...rest}
      >
        {loading && (
          <>
            <CircularProgress
              size={spinnerSize}
              // color="primary"
              sx={{
                position: "absolute",
              }}
            />
          </>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            visibility: loading ? "hidden" : "visible",
          }}
        >
          {startIcon}
          {label || children}
          {endIcon}
        </Box>
      </StyledButton>
    </Box>
  );
};

export default CustomButton;
