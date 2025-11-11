import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Grow,
  GrowProps,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: GrowProps,
  ref: React.Ref<unknown>
) {
  return (
    <Grow
      ref={ref}
      {...props}
      timeout={{ appear: 500, enter: 500, exit: 500 }}
      mountOnEnter
      unmountOnExit
    />
  );
});

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
  <Dialog
    open={open}
    onClose={onClose}
    TransitionComponent={Transition}
    keepMounted
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
    PaperProps={{
      sx: {
        borderRadius: "16px",
        p: 1,
        minWidth: 320,
        transition: "all 0.5s ease-in-out",
      },
    }}
  >
    <DialogTitle
      id="dialog-title"
      sx={{ fontWeight: 600, fontSize: "20px", pb: 1 }}
    >
      {title}
    </DialogTitle>

    <DialogContent sx={{ pb: 2 }}>
      <Typography
        id="dialog-description"
        variant="body1"
        color="text.secondary"
      >
        {message}
      </Typography>
    </DialogContent>

    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} color="error" variant="outlined">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="primary" variant="contained" autoFocus>
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

export default DialogBoxWrapper;
