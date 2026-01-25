import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Divider,
  Theme,
  useTheme,
  Avatar,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CustomButton from "@/components/ui/CustomButton";
import logo from "@/assets/images/logo.png";

type PageHeaderProps = {
  backTo: string;
  backLabel?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  backTo,
  backLabel = "Return to dashboard",
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <AppBar position="fixed" elevation={0} sx={styles.appBar}>
      <Toolbar sx={styles.toolbar}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={logo} alt="Logo" sx={{ width: 36, height: 36 }} />
          <Typography
            variant="h6"
            sx={{
              cursor: "pointer",
              fontWeight: 800,
            }}
            onClick={() => navigate("/")}
          >
            TCMS
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem sx={styles.divider} />
        <CustomButton
          startIcon={<ArrowBack />}
          variant="text"
          onClick={() => navigate(backTo)}
          sx={styles.backButton}
        >
          {backLabel}
        </CustomButton>
      </Toolbar>
    </AppBar>
  );
};

export default PageHeader;

const getStyles = (theme: Theme) => ({
  appBar: {
    backgroundColor: theme.customColors.headerBackground,
    color: "#FFF",
    borderBottom: "1px solid #E5E7EB",
    zIndex: 1200,
  },
  toolbar: {
    minHeight: "52px !important",
    height: 52,
    display: "flex",
    alignItems: "center",
    gap: 2,
  },
  backButton: {
    color: "#FFF",
    fontSize: 18,
  },
  divider: {
    borderColor: "text.secondary",
  },
  title: {
    fontWeight: 600,
    fontSize: 20,
  },
});
