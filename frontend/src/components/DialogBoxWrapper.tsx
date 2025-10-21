import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";

interface DialogBoxWrapperProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
}

const DialogBoxWrapper: React.FC<DialogBoxWrapperProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography>{message}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button color="secondary" onClick={onConfirm} autoFocus>
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

export default DialogBoxWrapper;
