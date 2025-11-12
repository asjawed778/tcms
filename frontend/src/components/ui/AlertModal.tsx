import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CustomButton from "./CustomButton";
import { Close } from "@mui/icons-material";

type AlertType = "success" | "warning" | "delete";
interface AlertModalProps {
  open: boolean;
  type?: AlertType;
  title?: string;
  message: React.ReactNode | string;
  onClose: () => void;
  onConfirm?: () => void;
  width?: string | number;
}

const iconMap = {
  success: {
    icon: (
      <CheckCircleOutlineOutlinedIcon
        sx={{ fontSize: 70, color: "success.main" }}
      />
    ),
    bgColor: "rgba(69, 153, 72, 0.1)",
  },
  warning: {
    icon: <WarningAmberIcon sx={{ fontSize: 70, color: "warning.main" }} />,
    bgColor: "rgba(255, 193, 7, 0.1)",
  },
  delete: {
    icon: <DeleteForeverIcon sx={{ fontSize: 70, color: "error.main" }} />,
    bgColor: "rgba(244, 67, 54, 0.1)",
  },
};

const AlertModal: React.FC<AlertModalProps> = ({
  open,
  type = "delete",
  title,
  message,
  onClose,
  onConfirm,
  width = 500,
}) => {
  const { icon, bgColor } = iconMap[type];

  return (
    <Box>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width,
            borderRadius: "16px",
            position: "relative",
            overflow: "visible",
          },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "grey.400",
            zIndex: 1,
          }}
        >
          <Close />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: bgColor,
            py: 3,
          }}
        >
          <Box
            sx={{
              width: 90,
              height: 90,
              bgcolor: "#fff",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {icon}
          </Box>
        </Box>

        <DialogContent>
          <Typography variant="h6" align="center" fontWeight="bold" mb={1}>
            {title}
          </Typography>
          <Typography align="center">{message}</Typography>
        </DialogContent>
        {type === "success" ? (
          <DialogActions sx={{ p: 2 }}>
            <CustomButton
              label="Close"
              onClick={onClose}
              fullWidth
              variant="contained"
            />
          </DialogActions>
        ) : (
          <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
            <CustomButton label="No" onClick={onClose} variant="outlined" />
            <CustomButton label="Yes" onClick={onConfirm} />
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default AlertModal;
