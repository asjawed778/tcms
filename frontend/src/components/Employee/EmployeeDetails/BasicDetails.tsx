import {
  useTheme,
  Avatar,
  Box,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import { Edit, CameraAlt, Email, Phone, Badge } from "@mui/icons-material";

interface BasicDetailsProps {
  _id: string;
  employeeId: string;
  phoneNumber: string;
  photo: string;
  status: string;
  roleName: string;
  firstName: string;
  lastName: string;
  email: string;
  onEditDetails?: () => void;
  onEditPhoto?: () => void;
}

const BasicDetails: React.FC<BasicDetailsProps> = ({
  employeeId,
  phoneNumber,
  photo,
  status,
  roleName,
  firstName,
  lastName,
  email,
  onEditDetails,
  onEditPhoto,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.photoContainer}>
        <Box sx={styles.avatarWrapper}>
          <Avatar
            src={photo}
            alt={`${firstName} ${lastName}`}
            sx={styles.avatar}
          />
          <IconButton
            sx={styles.cameraButton}
            onClick={onEditPhoto}
            size="small"
          >
            <CameraAlt sx={styles.cameraIcon} />
          </IconButton>
        </Box>
      </Box>
      <Box sx={styles.detailsContainer}>
        <Box sx={styles.header}>
          <Box>
            <Typography variant="h5" sx={styles.name}>
              {firstName} {lastName}
            </Typography>
            <Box sx={styles.roleStatusRow}>
              <Chip label={roleName} sx={styles.roleChip} size="small" />
              <Chip
                label={status}
                sx={{
                  ...styles.statusChip,
                  backgroundColor:
                    status === "Active"
                      ? "rgba(76, 175, 80, 0.1)"
                      : "rgba(244, 67, 54, 0.1)",
                  color: status === "Active" ? "#4caf50" : "#f44336",
                }}
                size="small"
              />
            </Box>
          </Box>
          <IconButton sx={styles.editButton} onClick={onEditDetails}>
            <Edit />
          </IconButton>
        </Box>
        <Box sx={styles.infoGrid}>
          <Box sx={styles.infoItem}>
            <Badge sx={styles.icon} />
            <Box>
              <Typography variant="caption" sx={styles.label}>
                Employee ID
              </Typography>
              <Typography variant="body1" sx={styles.value}>
                {employeeId}
              </Typography>
            </Box>
          </Box>
          <Box sx={styles.infoItem}>
            <Email sx={styles.icon} />
            <Box>
              <Typography variant="caption" sx={styles.label}>
                Email
              </Typography>
              <Typography variant="body1" sx={styles.value}>
                {email}
              </Typography>
            </Box>
          </Box>
          <Box sx={styles.infoItem}>
            <Phone sx={styles.icon} />
            <Box>
              <Typography variant="caption" sx={styles.label}>
                Phone Number
              </Typography>
              <Typography variant="body1" sx={styles.value}>
                {phoneNumber}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const getStyles = (theme: any) => ({
  container: {
    display: "flex",
    gap: 3,
  },
  photoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 140,
    height: 140,
    border: `4px solid ${theme.palette.primary.main}`,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  cameraButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  cameraIcon: {
    fontSize: 18,
  },
  detailsContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    fontWeight: 600,
    marginBottom: 1,
    color: theme.palette.text.primary,
  },
  roleStatusRow: {
    display: "flex",
    gap: 1,
    alignItems: "center",
  },
  roleChip: {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    fontWeight: 500,
  },
  statusChip: {
    fontWeight: 500,
  },
  editButton: {
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: `${theme.palette.primary.main}15`,
    },
  },
  infoGrid: {
    display: "flex",
    flexDirection: "row",
    gap: 3,
  },
  infoItem: {
    display: "flex",
    gap: 1.5,
  },
  icon: {
    color: theme.palette.primary.main,
    fontSize: 20,
    marginTop: "4px",
  },
  label: {
    color: theme.palette.text.secondary,
    fontSize: "0.85rem",
    textTransform: "uppercase",
    fontWeight: 500,
    letterSpacing: "0.5px",
  },
  value: {
    color: theme.palette.text.primary,
    fontWeight: 500,
  },
});

export default BasicDetails;
