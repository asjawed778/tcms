import React, { useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  Backdrop,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion, AnimatePresence } from "framer-motion";

interface SideDrawerWrapperProps {
  open: boolean;
  onClose: () => void;
  header?: string | React.ReactNode;
  width?: number | string;
  anchor?: "left" | "right";
  closeOnOutsideClick?: boolean;
  showBackArrow?: boolean;
  children: React.ReactNode;
}

const SideDrawerWrapper: React.FC<SideDrawerWrapperProps> = ({
  open,
  onClose,
  header = "",
  width = 300,
  anchor = "right",
  closeOnOutsideClick = true,
  showBackArrow = true,
  children,
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const sheetWidth = isMobile
    ? "100%"
    : typeof width === "number"
    ? `${width}px`
    : width;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <>
          <Backdrop
            open
            sx={{ zIndex: 1400 }}
            onClick={closeOnOutsideClick ? onClose : undefined}
          />
          <motion.div
            initial={{ x: anchor === "right" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: anchor === "right" ? "100%" : "-100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              position: "fixed",
              top: 0,
              [anchor]: 0 as any,
              height: "100vh",
              width: sheetWidth,
              background: "#fff",
              zIndex: 1500,
              display: "flex",
              flexDirection: "column",
              boxShadow:
                anchor === "right"
                  ? "-3px 0px 12px rgba(0,0,0,0.1)"
                  : "3px 0px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.5,
                borderBottom: "1px solid #e0e0e0",
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 10,
              }}
            >
              {showBackArrow && (
                <IconButton onClick={onClose}>
                  <ArrowBackIcon />
                </IconButton>
              )}
              {typeof header === "string" ? (
                <Typography variant="h6" fontWeight={600} fontSize="24px">
                  {header}
                </Typography>
              ) : (
                header
              )}
            </Box>
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                px: 2,
                py: 2,
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "primary.main",
                  borderRadius: "4px",
                },
              }}
            >
              {children}
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideDrawerWrapper;
