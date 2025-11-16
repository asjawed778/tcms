import React from "react";
import { Box, Typography, Grid, useTheme, Theme } from "@mui/material";
import { EmployeeDetailsResponse } from "@/types/employee";
import { formatDate } from "@/utils/helper";
import InfoItem from "@/components/common/InfoItem";
import { Email } from "@mui/icons-material";

interface PersonalInfoTabProps {
  student: any;
}
const ParentInfoTab: React.FC<PersonalInfoTabProps> = ({ student }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Box sx={styles.root}>
      <Typography variant="h6" sx={styles.sectionTitle}>
        Father
      </Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem
            label="Name"
            value={student?.father?.name}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem
            label="Email"
            value={student?.father?.email}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Contact Number" value={student?.father?.contactNumber} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Qualification" value={student?.father?.qualification} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Occupation" value={student?.father?.occupation} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Business/Employer Name" value={student?.father?.businessOrEmployerName} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Office Number" value={student?.father?.officeNumber} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Office Address" value={student?.father?.officeAddress} />
        </Grid>
      </Grid>
      <Typography variant="h6" sx={styles.sectionTitle}>
        Mother
      </Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem
            label="Name"
            value={student?.mother?.name}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem
            label="Email"
            value={student?.mother?.email}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Contact Number" value={student?.mother?.contactNumber} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Qualification" value={student?.mother?.qualification} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Occupation" value={student?.mother?.occupation} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Business/Employer Name" value={student?.mother?.businessOrEmployerName} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Office Number" value={student?.mother?.officeNumber} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Office Address" value={student?.mother?.officeAddress} />
        </Grid>
      </Grid>
      <Typography variant="h6" sx={styles.sectionTitle}>
        Local Guardian
      </Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem
            label="Name"
            value={student?.localGuardian?.name}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem
            label="Email"
            value={student?.localGuardian?.email}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Contact Number" value={student?.localGuardian?.contactNumber} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Qualification" value={student?.localGuardian?.qualification} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Occupation" value={student?.localGuardian?.occupation} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Business/Employer Name" value={student?.localGuardian?.businessOrEmployerName} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Office Number" value={student?.localGuardian?.officeNumber} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Office Address" value={student?.localGuardian?.officeAddress} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ParentInfoTab;

const getStyles = (theme: Theme) => ({
  root: { px: 2 },
  sectionTitle: {
    fontWeight: 600,
    mt: 2,
    color: theme.palette.text.primary,
  },
});
