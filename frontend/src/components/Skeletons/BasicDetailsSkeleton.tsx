import { Box, Skeleton, useTheme } from "@mui/material";

const BasicDetailsSkeleton: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.photoContainer}>
        <Skeleton
          variant="circular"
          width={140}
          height={140}
          sx={styles.avatarSkeleton}
        />
      </Box>
      <Box sx={styles.detailsContainer}>
        <Box sx={styles.header}>
          <Box>
            <Skeleton variant="text" width={160} height={32} />
            <Box sx={styles.roleStatusRow}>
              <Skeleton variant="rounded" width={80} height={28} />
              <Skeleton variant="rounded" width={70} height={28} />
            </Box>
          </Box>
          <Skeleton variant="circular" width={36} height={36} />
        </Box>
        <Box sx={styles.infoGrid}>
          {[1, 2, 3].map((_, index) => (
            <Box key={index} sx={styles.infoItem}>
              <Skeleton variant="circular" width={20} height={20} />
              <Box>
                <Skeleton variant="text" width={90} height={16} />
                <Skeleton variant="text" width={130} height={20} />
              </Box>
            </Box>
          ))}
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
  avatarSkeleton: {
    borderRadius: "50%",
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
  roleStatusRow: {
    display: "flex",
    gap: 1,
    marginTop: 1,
  },
  infoGrid: {
    display: "flex",
    flexDirection: "row",
    gap: 3,
    marginTop: 2,
  },
  infoItem: {
    display: "flex",
    gap: 1.5,
  },
});

export default BasicDetailsSkeleton;
