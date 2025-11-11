import React from "react";
import { Box, Typography, Grid, useTheme, Theme } from "@mui/material";
import { EmployeeDetailsResponse } from "@/types/employee";
import { formatDate } from "@/utils/helper";

interface PersonalInfoTabProps {
  employee: EmployeeDetailsResponse;
}
const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ employee }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Box sx={styles.root}>
      <Typography variant="h6" sx={styles.sectionTitle}>
        Personal Details
      </Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Father's Name" value={employee.fatherName} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Mother's Name" value={employee.motherName} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Gender" value={employee.gender} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Date of Birth" value={formatDate(employee.dob)} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Email" value={employee.email} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Phone Number" value={employee.phoneNumber} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Aadhaar Number" value={employee.aadhaarNumber} />
        </Grid>
      </Grid>
      <Typography variant="h6" sx={styles.sectionTitle}>
        Address Details
      </Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem
            label="Address Line 1"
            value={employee.address?.addressLine1}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem
            label="Address Line 2"
            value={employee.address?.addressLine2}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Country" value={employee.address?.country} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="State" value={employee.address?.state} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="City" value={employee.address?.city} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Pincode" value={employee.address?.pincode} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalInfoTab;

interface InfoItemProps {
  label: string;
  value?: string | number | null;
}
const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => {
  value = value || "--";
  return (
    <Box>
      <Box>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

const getStyles = (theme: Theme) => ({
  root: { px: 2 },
  sectionTitle: {
    fontWeight: 600,
    mt: 2,
    color: theme.palette.text.primary,
  },
});
