import React, { ReactNode, forwardRef } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
  Slide,
  SlideProps,
  Grow,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SlideUpTransition = forwardRef(function SlideUpTransition(
  props: SlideProps & { children?: ReactNode },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} timeout={400} />;
});

const SlideRightTransition = forwardRef(function SlideRightTransition(
  props: SlideProps & { children?: ReactNode },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} timeout={400} />;
});

const SlideLeftTransition = forwardRef(function SlideLeftTransition(
  props: SlideProps & { children?: ReactNode },
  ref: React.Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} timeout={400} />;
});

const ZoomTransition = forwardRef(function ZoomTransition(
  props: SlideProps & { children?: ReactNode },
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
  position?: "center" | "right" | "left";
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
  position = "center",
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

  const TransitionComponent = isMobile
    ? SlideUpTransition
    : position === "right"
    ? SlideRightTransition
    : position === "left"
    ? SlideLeftTransition
    : ZoomTransition;

  const positionStyles = !isMobile
    ? {
        center: {
          alignSelf: "center",
          mx: "auto",
          borderRadius: "16px",
          height,
        },
        right: {
          ml: "auto",
          mr: 0,
          height: "100%",
          borderRadius: "16px 0 0 16px",
        },
        left: {
          mr: "auto",
          ml: 0,
          height: "100%",
          borderRadius: "0 16px 16px 0",
        },
      }[position]
    : {
        alignSelf: "flex-end",
        borderRadius: "16px 16px 0 0",
        height: "auto",
      };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isMobile}
      scroll="paper"
      TransitionComponent={TransitionComponent}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      aria-modal="true"
      keepMounted
      slotProps={{
        paper: {
          sx: {
            width: isMobile
              ? "100%" : width,
            maxWidth: "100%",
            bgcolor: "background.paper",
            boxShadow: "0 4px 20px rgb(0,0,0,0.1)",
            p: "28px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: isMobile ? "80%" : "100%",
            transition:
              "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
            ...positionStyles,
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
          "&::-webkit-scrollbar": { width: 8 },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0,0,0,0.2)",
            borderRadius: 4,
            border: "2px solid transparent",
            backgroundClip: "content-box",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(0,0,0,0.35)",
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
