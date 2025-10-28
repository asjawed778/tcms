import React, { ReactNode, forwardRef } from "react";
import {
  Dialog,
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
  width = 500,
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
            width: isMobile ? "100%" : width,
            height: isMobile ? "auto" : height,
            maxWidth: "100%",
            bgcolor: "background.paper",
            boxShadow: "0 4px 20px rgb(0,0,0,0.1)",
            borderRadius: isMobile ? "16px 16px 0 0" : "16px",
            p: "28px",
            alignSelf: isMobile ? "flex-end" : "center",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            // maxHeight: isMobile ? "80vh" : "90vh",
            maxHeight: isMobile ? "80%" : "90%",
            transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: title ? "space-between" : "flex-end",
          px: "4px",
        }}
      >
        {title && (
          <Typography fontWeight="bold" component="h2" fontSize="24px">
            {title}
          </Typography>
        )}
        {closeIcon && (
          <IconButton
            aria-label="Close"
            onClick={(e) => onClose?.(e, "escapeKeyDown")}
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "error.main",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <DialogContent
        id="dialog-description"
        sx={{
          pt: "32px",
          px: "4px",
          pb: 0,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0,0,0,0.2)",
            borderRadius: 4,
            border: "2px solid transparent",
            backgroundClip: "content-box",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(0,0,0,0.35)",
            backgroundClip: "content-box",
          },
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,0,0,0.2) transparent",
        }}
      >
        {open && children}
      </DialogContent>
    </Dialog>
  );
};

export default ModalWrapper;
