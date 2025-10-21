import React, { ReactNode, forwardRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
  Slide,
  SlideProps,
  ZoomProps,
  Box,
  Typography,
  Grow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SlideUpTransition = forwardRef(function SlideUpTransition(
  props: SlideProps & { children?: ReactNode },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} timeout={400} />;
});

const ZoomTransition = forwardRef(function ZoomTransition(
  props: ZoomProps & { children?: ReactNode },
  ref: React.Ref<unknown>
) {
  return <Grow ref={ref} {...props} timeout={400} />;
});

interface ModalWrapperProps {
  open: boolean;
  onClose?: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
  title?: string;
  children?: ReactNode;
  width?: number | string;
  height?: number | string;
  closeIcon?: boolean;
  allowOutsideClickMobile?: boolean;
  allowOutsideClickDesktop?: boolean;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  open,
  onClose,
  title,
  children,
  width = 400,
  height = "auto",
  closeIcon = true,
  allowOutsideClickMobile = false,
  allowOutsideClickDesktop = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason === "backdropClick") {
      if (isMobile && !allowOutsideClickMobile) return;
      if (!isMobile && !allowOutsideClickDesktop) return;
    }
    onClose?.(event, reason);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isMobile}
      scroll="paper"
      TransitionComponent={isMobile ? SlideUpTransition : ZoomTransition}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      aria-modal="true"
      keepMounted
      slotProps={{
        paper: {
          sx: {
            position: "relative",
            width: isMobile ? "100%" : width,
            height: isMobile ? "auto" : height,
            maxWidth: "100%",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: isMobile ? "16px 16px 0 0" : 2,
            mx: isMobile ? 0 : 2,
            alignSelf: isMobile ? "flex-end" : "center",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: isMobile ? "80vh" : "90vh",
            transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
          },
        },
      }}
    >
      {closeIcon && !isMobile && (
        <IconButton
          aria-label="Close"
          onClick={(e) => onClose?.(e, "escapeKeyDown")}
          sx={{
            position: "absolute",
            top: 2,
            right: 2,
            color: "text.secondary",
            "&:hover": {
              color: "error.main",
            },
            zIndex: 10,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}

      {title && (
        <DialogTitle
          id="dialog-title"
          sx={{ py: 1, textAlign: "center" }}
          component="div"
        >
          <Typography fontWeight="bold" variant="h6" component="h2">
            {title}
          </Typography>
        </DialogTitle>
      )}
      <DialogContent id="dialog-description" sx={{ overflowY: "auto", p: 0 }}>
        <Box px={2} my={1.5}>
          {open && children}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ModalWrapper;
