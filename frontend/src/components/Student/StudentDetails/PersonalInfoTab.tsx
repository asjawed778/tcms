import React from "react";
import { Box, Typography, Grid, useTheme, Theme } from "@mui/material";
import { EmployeeDetailsResponse } from "@/types/employee";
import { formatDate } from "@/utils/helper";
import InfoItem from "@/components/common/InfoItem";
import { StudentDetailsResponse } from "@/types/student";

interface PersonalInfoTabProps {
  student: StudentDetailsResponse;
}
const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ student }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Box sx={styles.root}>
      <Typography variant="h6" sx={styles.sectionTitle}>
        Personal Details
      </Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Father's Name" value={student?.father?.name} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Mother's Name" value={student?.mother?.name} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Gender" value={student?.gender} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Date of Birth" value={formatDate(student?.dob)} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Email" value={student?.email} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Phone Number" value={student?.contactNumber} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Aadhaar Number" value={student?.adharNumber} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Blood Group" value={student?.bloodGroup} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Mother Tongue" value={student?.motherTongue} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Nationality" value={student?.nationality} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Religion" value={student?.religion} />
        </Grid>
      </Grid>
      <Typography variant="h6" sx={styles.sectionTitle}>
        Address
      </Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem
            label="Address Line 1"
            value={student?.address?.addressLine1}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem
            label="Address Line 2"
            value={student?.address?.addressLine2}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Country" value={student?.address?.country} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="State" value={student?.address?.state} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="City" value={student?.address?.city} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Pincode" value={student?.address?.pincode} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalInfoTab;

const getStyles = (theme: Theme) => ({
  root: { px: 2 },
  sectionTitle: {
    fontWeight: 600,
    mt: 2,
    color: theme.palette.text.primary,
  },
});
