import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Divider,
  Theme,
  useTheme,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CustomButton from "@/components/ui/CustomButton";
import { useAppTheme } from "@/context/ThemeContext";

type PageHeaderProps = {
  title: string;
  backTo: string;
  backLabel?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  backTo,
  backLabel = "Back to dashboard",
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <AppBar position="fixed" elevation={0} sx={styles.appBar}>
      <Toolbar sx={styles.toolbar}>
        <CustomButton
          startIcon={<ArrowBack />}
          variant="text"
          onClick={() => navigate(backTo)}
          sx={styles.backButton}
        >
          {backLabel}
        </CustomButton>

        <Divider orientation="vertical" flexItem sx={styles.divider} />

        <Box>
          <Typography sx={styles.title}>{title}</Typography>
        </Box>
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
